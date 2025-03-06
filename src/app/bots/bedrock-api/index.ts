import { isArray } from 'lodash-es';
import { DEFAULT_CLAUDE_SYSTEM_MESSAGE } from '~app/consts';
import { requestHostPermission } from '~app/utils/permissions';
import { UserConfig } from '~services/user-config';
import { ChatError, ErrorCode } from '~utils/errors';
import { parseSSEResponse } from '~utils/sse';
import { AbstractBot, SendMessageParams } from '../abstract-bot';
import { file2base64 } from '../bing/utils';
import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseStreamCommand,
  Message as ChatMessage,
  ContentBlock as ContentPart
} from "@aws-sdk/client-bedrock-runtime";
import { FetchHttpHandler } from "@smithy/fetch-http-handler";

import { HttpRequest } from "@smithy/protocol-http";



const CONTEXT_SIZE = 40;

// interface ContentPart {
//   type: 'text' | 'image';
//   text?: string;
//   image?: { format: string; source: { bytes: string } };
//   [key: string]: any;
// }

// interface ChatMessage {
//   role: string;
//   content: ContentPart[];
// }

interface ConversationContext {
  messages: ChatMessage[];
}


export abstract class AbstractBedrockApiBot extends AbstractBot {
  private conversationContext?: ConversationContext

  private buildUserMessage(prompt: string, imageUrl?: string): ChatMessage {
    const content: ContentPart[] = [
      { text: prompt }
    ];

    if (imageUrl) {
      content.push({
        image: {
          format: 'jpeg',  // assuming format as jpeg
          source: { bytes: this.base64ToUint8Array(imageUrl) }
        }
      });
    }

    return { role: 'user', content };
  }

  private buildMessages(prompt: string, imageUrl?: string): ChatMessage[] {
    // 会話コンテキストからメッセージを取得
    const contextMessages = this.conversationContext!.messages.slice(-(CONTEXT_SIZE + 1));

    // 最初のメッセージがuserかどうかをチェック
    const firstMessageIndex = contextMessages.findIndex(msg => msg.role === 'user');

    // User メッセージが見つからない場合は空の配列を返す
    // User メッセージが見つかった場合は、それ以降のメッセージを使用
    const filteredMessages = firstMessageIndex === -1
      ? []
      : contextMessages.slice(firstMessageIndex);


    // メッセージの順序をチェックして修正
    const result: ChatMessage[] = [];

    for (let i = 0; i < filteredMessages.length; i++) {
      const currentMsg = filteredMessages[i];
      
      if (i === 0 && currentMsg.role !== 'user') {
        // 最初のメッセージがuserでない場合は無視
        continue;
      }

      if (i > 0) {
        const prevMsg = filteredMessages[i - 1];
        const expectedRole = prevMsg.role === 'user' ? 'assistant' : 'user';

        if (currentMsg.role !== expectedRole) {
          // 期待される順序と異なる場合、errorメッセージを挿入
          result.push({
            role: 'assistant',
            content: [{
              text: "Error: Message order was incorrect. Conversation has been reset for consistency."
            }]
          });
        }
      }

      result.push(currentMsg);

    }

    return [
      ...result.slice(-(CONTEXT_SIZE - 1)),
      this.buildUserMessage(prompt, imageUrl),
    ]
  }

  getSystemMessage() {
    return DEFAULT_CLAUDE_SYSTEM_MESSAGE
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }
  
    let imageUrl: string | undefined
    if (params.image) {
      imageUrl = await file2base64(params.image)
    }
  
    try {
      const resp = await this.fetchCompletionApi(this.buildMessages(params.prompt, imageUrl), params.signal)
      
      if (!resp.ok) {
        params.onEvent({
          type: 'ERROR',
          error: new ChatError('Failed to fetch API', ErrorCode.UNKOWN_ERROR)
        });
        console.error('Failed to fetch API:', await resp.text());
        return;
      }
  
      this.conversationContext.messages.push(this.buildUserMessage(params.rawUserInput || params.prompt, imageUrl))
  
      let done = false
      const result: ChatMessage = { 
        role: 'assistant', 
        content: [{ text: '' }] 
      }
      let thinkingContent = '';
      
      const finish = () => {
        done = true
        params.onEvent({ type: 'DONE' })
        this.conversationContext!.messages.push(result)
      }
  
      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
  
      while (!done) {
        const { value, done: readerDone } = await reader?.read() || { value: undefined, done: true };
        if (readerDone) {
          finish();
          break;
        }
  
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
  
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.type === 'contentDelta' && data.delta) {
              // 通常のテキスト出力の処理
              if (result.content && result.content.length > 0) {
                result.content[0].text += data.delta;
              }
              params.onEvent({
                type: 'UPDATE_ANSWER',
                data: {
                  text: Array.isArray(result.content) && result.content.length > 0 && 
                        typeof result.content[0].text === 'string'
                        ? result.content[0].text
                        : "Empty Response",
                  thinking: thinkingContent || undefined
                },
              });
            } else if (data.type === 'reasoningContent') {
              // Thinking モードの出力の処理
              thinkingContent += data.delta || '';
              params.onEvent({
                type: 'UPDATE_ANSWER',
                data: {
                  text: Array.isArray(result.content) && result.content.length > 0 && 
                        typeof result.content[0].text === 'string'
                        ? result.content[0].text
                        : "Empty Response",
                  thinking: thinkingContent
                },
              });
            } else if (data.type === 'stop') {
              finish();
              break;
            }
          } catch (error) {
            console.error('Error parsing stream data:', error);
            params.onEvent({
              type: 'ERROR',
              error: new ChatError('Error parsing stream data', ErrorCode.UNKOWN_ERROR)
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      params.onEvent({
        type: 'ERROR',
        error: new ChatError('Error sending message', ErrorCode.UNKOWN_ERROR)
      });
    }
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    // Base64文字列からバイナリ文字列を作成
    const binaryString = atob(base64);
    // バイナリ文字列からUint8Arrayを作成
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async modifyLastMessage(message: string): Promise<void> {
    console.log('modifyLastMessage', message)
    if (!this.conversationContext || this.conversationContext.messages.length === 0) {
      return
    }

    // 最後のメッセージを取得
    const lastMessage = this.conversationContext.messages[this.conversationContext.messages.length - 1]
    
    // 最後のメッセージがassistantのものでない場合は何もしない
    if (lastMessage.role !== 'assistant') {
      return
    }

    // 新しいコンテンツで最後のメッセージを更新
    if (typeof message === 'string') {
      // Bedrockのメッセージフォーマットに合わせて更新
      lastMessage.content = [{ text: message }]
    }
  }

  resetConversation() {
    this.conversationContext = undefined
  }

  abstract fetchCompletionApi(messages: ChatMessage[], signal ?: AbortSignal): Promise<Response>

}

class CustomFetchHttpHandler extends FetchHttpHandler {
  private apiKey: string;

  constructor(apiKey: string, options?: any) {
    super(options);
    this.apiKey = apiKey;
  }

  async handle(request: HttpRequest): Promise<any> {
    request.headers = {
      ...request.headers,
      'authorization': this.apiKey, 
    };
    
    return super.handle(request);
  }
}

export class BedrockApiBot extends AbstractBedrockApiBot {
  private client: BedrockRuntimeClient;
  private userConfig?: UserConfig;

  constructor(
    private config: Pick<
      UserConfig,
      'claudeApiKey' | 'claudeApiHost' | 'claudeApiModel' | 'claudeApiSystemMessage' | 'claudeApiTemperature'
    > & {
      thinkingMode?: boolean;
      thinkingBudget?: number;
    },
  ) {
    super()
    const api_path = 'v1/';
    // API Hostの最後のslashを削除
    const baseUrl = this.config.claudeApiHost.endsWith('/') ? this.config.claudeApiHost.slice(0, -1) : this.config.claudeApiHost;
    const fullUrlStr = `${baseUrl}/${api_path}`.replace('v1/v1/', 'v1/')
    this.client = new BedrockRuntimeClient({ 
      region: 'us-east-1', // 適切なリージョンを指定
      endpoint: fullUrlStr,
      credentials: {
        accessKeyId: 'AWS',
        secretAccessKey: 'AWS',
      },
      requestHandler: new CustomFetchHttpHandler(this.config.claudeApiKey, {
      }),
    });
  }

  async fetchCompletionApi(messages: ChatMessage[], signal?: AbortSignal): Promise<Response> {
    try {
      // Create the base command object
      const converceCommandObject: any = {
        modelId: this.getModelName(),
        messages: messages,
        system: [{ text: this.getSystemMessage() }]
      };
  
      // Add reasoning configuration or temperature based on thinkingMode flag
      if (this.config.thinkingMode) {
        const reasoningConfig = {
          thinking: {
            type: "enabled",
            budget_tokens: this.config.thinkingBudget || 2000
          }
        };
        converceCommandObject.additionalModelRequestFields = reasoningConfig;
        converceCommandObject.inferenceConfig = {
          maxTokens: 64000,
        };
      } else {
        converceCommandObject.inferenceConfig = {
          maxTokens: 8192,
          temperature: this.config.claudeApiTemperature
        };
      }

      const command = new ConverseStreamCommand(converceCommandObject);

      const response = await this.client.send(command);
      
      // Stream ResponseをWeb APIのResponseに変換
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();

      // ストリームの処理を開始
      if (response.stream) {
        const stream = response.stream as AsyncIterable<any>
        (async () => {
          try {
            for await (const chunk of stream) {
              if (chunk.contentBlockDelta) {
                const { delta, contentBlockIndex } = chunk.contentBlockDelta;
                if (delta && "reasoningContent" in delta) {
                  const data = {
                    type: 'reasoningContent',
                    delta: delta.reasoningContent?.text,
                    blockIndex: contentBlockIndex
                  };
                  await writer.write(new TextEncoder().encode(JSON.stringify(data) + '\n'));
                }
                if (delta && 'text' in delta) {
                  const data = {
                    type: 'contentDelta',
                    delta: delta.text,
                    blockIndex: contentBlockIndex
                  };
                  await writer.write(new TextEncoder().encode(JSON.stringify(data) + '\n'));
                }
              }
              else if (chunk.messageStop) {
                const data = {
                  type: 'stop',
                  reason: chunk.messageStop.stopReason
                };
                await writer.write(new TextEncoder().encode(JSON.stringify(data) + '\n'));
              }
            }
          } catch (error) {
            console.error('Stream processing error:', error);
          } finally {
            await writer.close();
          }
        })();
      }

      return new Response(stream.readable, {
        headers: {
          'Content-Type': 'text/event-stream',
        },
      });

    } catch (error: unknown) {
      console.error('Bedrock API error:', error);
      
      // エラーオブジェクトの型を判定
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error occurred';
    
      // statusCodeの取得
      const statusCode = (error as { statusCode?: number })?.statusCode || 500;
    
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: statusCode,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    }
    
  }

  public getModelName() {
    const { claudeApiModel } = this.config
    return claudeApiModel
  }

  get modelName() {
    return this.config.claudeApiModel
  }

  get name() {
    return `Claude (API/${this.config.claudeApiModel})`
  }

  get supportsImageInput() {
    return true
  }
}

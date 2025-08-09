import { isArray } from 'lodash-es';
import { DEFAULT_CLAUDE_SYSTEM_MESSAGE } from '~app/consts';
import { requestHostPermission } from '~app/utils/permissions';
import { UserConfig } from '~services/user-config';
import { ChatError, ErrorCode } from '~utils/errors';
import { parseSSEResponse } from '~utils/sse';
import { AbstractBot, SendMessageParams, ConversationHistory } from '../abstract-bot';
import { file2base64 } from '~app/utils/file-utils';
import { ChatMessageModel } from '~types';
import { uuid } from '~utils';
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

  // ConversationHistoryインターフェースの実装
  public setConversationHistory(history: ConversationHistory): void {
    if (history.messages && Array.isArray(history.messages)) {
      // ChatMessageModelからChatMessageへの変換
      const messages: ChatMessage[] = history.messages.map(msg => {
        if (msg.author === 'user') {
          return {
            role: 'user',
            content: [{ text: msg.text }]
          };
        } else {
          return {
            role: 'assistant',
            content: [{ text: msg.text }]
          };
        }
      });
      
      this.conversationContext = {
        messages: messages
      };
    }
  }

  public getConversationHistory(): ConversationHistory | undefined {
    if (!this.conversationContext) {
      return undefined;
    }
    
    // ChatMessageからChatMessageModelへの変換
    const messages = this.conversationContext.messages.map(msg => {
      const role = msg.role === 'user' ? 'user' : 'assistant';
      let text = '';
      
      if (Array.isArray(msg.content)) {
        // contentが配列の場合、textプロパティを持つ最初の要素を探す
        const textContent = msg.content.find(part => 'text' in part && typeof part.text === 'string');
        if (textContent && 'text' in textContent) {
          text = textContent.text || '';
        }
      }
      
      return {
        id: uuid(),
        author: role,
        text: text
      };
    });
    
    return { messages };
  }

  private buildUserMessage(prompt: string, images?: { data: string, format: 'jpeg' | 'png' | 'gif' | 'webp' }[]): ChatMessage {
    const content: ContentPart[] = [];

    // Add text content first
    content.push({ text: prompt });

    // Then add images if any
    if (images && images.length > 0) {
      for (const image of images) {
        try {
          const bytes = this.base64ToUint8Array(image.data);
          console.log(`Adding image: format=${image.format}, bytes length=${bytes.length}`);
          
          content.push({
            image: {
              format: image.format,
              source: {
                bytes: bytes
              }
            }
          });
        } catch (imageError) {
          console.error('Error processing image:', imageError);
          console.error('Image format:', image.format);
          console.error('Image data length:', image.data?.length || 0);
          throw new Error(`Failed to process image: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
        }
      }
    }

    return { role: 'user', content };
  }

  private buildMessages(prompt: string, images?: { data: string, format: 'jpeg' | 'png' | 'gif' | 'webp' }[]): ChatMessage[] {
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
      this.buildUserMessage(prompt, images),
    ]
  }

  getSystemMessage() {
    return DEFAULT_CLAUDE_SYSTEM_MESSAGE
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      this.conversationContext = { messages: [] }
    }

    const images_for_api: { data: string, format: 'jpeg' | 'png' | 'gif' | 'webp' }[] = [];
    if (params.images && params.images.length > 0) {
      console.log(`Processing ${params.images.length} images for Bedrock API`);
      
      for (const image of params.images) {
        try {
          const base64Data = await file2base64(image);
          
          // base64データが空でないことを確認
          if (!base64Data || base64Data.trim().length === 0) {
            throw new Error(`Empty base64 data returned for image: ${image.name || 'unknown'}`);
          }
          
          const mimeType = image.type.split('/')[1]?.toLowerCase();
          let format: 'jpeg' | 'png' | 'gif' | 'webp' = 'jpeg';
          
          console.log(`Image MIME type: ${image.type}, extracted format: ${mimeType}`);
          
          if (mimeType === 'png' || mimeType === 'gif' || mimeType === 'webp') {
            format = mimeType;
          } else if (mimeType === 'jpg') {
            format = 'jpeg';
          }
          
          // base64データの処理を改善
          let base64Content: string;
          
          if (base64Data.includes(',')) {
            // data:image/jpeg;base64,xxxxx 形式の場合
            const parts = base64Data.split(',');
            if (parts.length !== 2 || !parts[1] || parts[1].trim().length === 0) {
              throw new Error(`Invalid base64 data: no content after comma. Got: "${base64Data.substring(0, 100)}..."`);
            }
            base64Content = parts[1].trim();
          } else {
            // 既にbase64データのみの場合
            base64Content = base64Data.trim();
          }
          
          // base64データの妥当性をチェック
          if (!base64Content || base64Content.trim().length === 0) {
            throw new Error('Empty base64 content');
          }
          
          // base64形式の妥当性をチェック（簡易チェック）
          if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Content)) {
            throw new Error('Invalid base64 characters');
          }
          
          console.log(`Image processed: format=${format}, base64 length=${base64Content.length}`);
          
          images_for_api.push({
            data: base64Content,
            format: format,
          });
        } catch (imageProcessingError) {
          console.error('Error processing individual image:', imageProcessingError);
          console.error('Image type:', image.type);
          console.error('Image size:', image.size);
          throw imageProcessingError;
        }
      }
    }

    try {
      const resp = await this.fetchCompletionApi(this.buildMessages(params.prompt, images_for_api), params.signal)

      if (!resp.ok) {
        params.onEvent({
          type: 'ERROR',
          error: new ChatError('Failed to fetch API', ErrorCode.UNKOWN_ERROR)
        });
        console.error('Failed to fetch API:', await resp.text());
        return;
      }

      this.conversationContext.messages.push(this.buildUserMessage(params.rawUserInput || params.prompt, images_for_api))
  
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
      // より詳細なエラー情報をログに出力
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      // AWS SDK固有のエラー情報も出力
      if (error && typeof error === 'object') {
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
      params.onEvent({
        type: 'ERROR',
        error: new ChatError(`Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`, ErrorCode.UNKOWN_ERROR)
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
    // For Bedrock API, we need to set proper headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-amz-json-1.0',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Amzn-Bedrock-Accept': '*/*',
    };
    
    // Preserve existing content-type if it's different
    if (request.headers['Content-Type']) {
      headers['Content-Type'] = request.headers['Content-Type'];
    }
    
    request.headers = headers;
    
    return super.handle(request);
  }
}

export class BedrockApiBot extends AbstractBedrockApiBot {
  private client: BedrockRuntimeClient;
  private userConfig?: UserConfig;

  // Define a specific type for the config needed by BedrockApiBot
  constructor(
    private config: {
      apiKey: string;
      host: string;
      model: string;
      systemMessage: string;
      temperature: number;
      thinkingMode?: boolean;
      thinkingBudget?: number;
      isHostFullPath?: boolean; // isHostFullPath を型定義に追加
    },
  ) {
    super()
    
    let endpointUrl: string;
    const hostValue = this.config.host; // Common host is not accessible here without async
    const isFullPath = this.config.isHostFullPath ?? false; // Default to false if undefined

    if (isFullPath) {
      endpointUrl = hostValue;
    } else {
      // If not full path, Bedrock typically uses the host as the direct endpoint.
      // The previous '/v1/' logic might not be standard for Bedrock.
      // For now, if not full path, we use the host directly.
      // If a path needs to be appended, user should use Full Path.
      endpointUrl = hostValue.endsWith('/') ? hostValue.slice(0, -1) : hostValue;
      // Example: if host is "bedrock-runtime.us-east-1.amazonaws.com" and not full path,
      // it's used as is. If user needs "host/some/path", they should use Full Path.
    }
    // Clean up potential double slashes if any part of logic reintroduces them
    endpointUrl = endpointUrl.replace(/([^:]\/)\/+/g, "$1");

    this.client = new BedrockRuntimeClient({
      region: 'us-east-1',
      endpoint: endpointUrl,
      credentials: {
        accessKeyId: 'AWS',
        secretAccessKey: 'AWS',
      },
      requestHandler: new CustomFetchHttpHandler(this.config.apiKey, {
        requestTimeout: 120000,
      }),
      // Disable AWS signature to use custom authorization
      signer: {
        sign: async (request: any) => request, // No-op signer that doesn't modify the request
      },
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
          temperature: this.config.temperature // Use config.temperature
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
      
      // より詳細なエラー情報をログに出力
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // AWS SDK固有のエラー情報
      if (error && typeof error === 'object') {
        const errorObj = error as any;
        console.error('Error code:', errorObj.$metadata?.httpStatusCode || errorObj.statusCode);
        console.error('Error response:', errorObj.$response);
        console.error('Full error object:', JSON.stringify(error, null, 2));
      }
      
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
    // Ensure the try...catch block is properly closed before the method ends.
  } // This closes the fetchCompletionApi method

  public getModelName() {
    const { model: claudeApiModel } = this.config // Use config.model
    return claudeApiModel
  }

  get modelName(): string { // Add explicit return type annotation
    return this.config.model // Use config.model
  }

  get name() {
    return `Bedrock (${this.config.model})` // Update name logic
  }

  get supportsImageInput() {
    return true
  }
}

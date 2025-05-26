# Thinkingパーサー実装計画 (改訂版)

## 概要

すべてのモデルで思考モード（`<thinking>...</thinking>`または`<think>...</think>`タグ）を表示できるようにする機能を実装するための計画です。ユーザーの要望に応じて、特定のモデル（Bedrock API）に限定されていた機能をすべてのモデルで使えるようにします。

## 実装上の課題

1. **ストリーミング出力への対応**
   - テキストは一度に完全な形で届くわけではなく、断片的に到着する
   - タグが複数の断片にまたがる可能性がある
   - 部分的なタグ（例：`<thin`や`ing>`）を正しく処理する必要がある

2. **複数のタグ形式**
   - `<thinking>...</thinking>` 形式
   - `<think>...</think>` 形式
   - 両方をサポートする必要がある

## 1. ユーティリティ関数の実装

`src/utils/thinking-parser.ts` に新しいユーティリティ関数を作成します。

```typescript
/**
 * テキストから思考タグの内容を抽出し、タグ部分を削除したテキストとthinking内容を返す
 * ストリーミング出力に対応するため、状態を維持するクラスとして実装
 */
export class ThinkingParser {
  private buffer: string = '';
  private inThinkingBlock: boolean = false;
  private thinking: string = '';
  private cleanText: string = '';
  private partialTagDetected: boolean = false;

  // 思考タグのパターン
  private readonly THINKING_START_PATTERNS = [
    /<thinking>/i,
    /<think>/i
  ];
  private readonly THINKING_END_PATTERNS = [
    /<\/thinking>/i,
    /<\/think>/i
  ];

  /**
   * テキスト断片を処理し、思考内容とクリーンなテキストを抽出
   * @param textFragment 新しいテキスト断片
   * @returns 処理結果
   */
  processFragment(textFragment: string): { text: string; thinking?: string } {
    // バッファにテキスト断片を追加
    this.buffer += textFragment;
    
    // 状態に応じて処理
    if (this.inThinkingBlock) {
      this._processThinkingBlock();
    } else {
      this._detectAndExtractThinking();
    }
    
    // 現在の状態に基づいて結果を返す
    const result = {
      text: this.cleanText,
      thinking: this.thinking.length > 0 ? this.thinking : undefined
    };
    
    // クリーンテキストをリセット（次の断片用）
    this.cleanText = '';
    
    return result;
  }

  /**
   * 現在の思考ブロック内のテキストを処理
   */
  private _processThinkingBlock(): void {
    // 終了タグを検索
    for (const endPattern of this.THINKING_END_PATTERNS) {
      const endMatch = this.buffer.match(endPattern);
      if (endMatch) {
        // 終了タグが見つかった場合
        this.inThinkingBlock = false;
        const endIndex = endMatch.index!;
        
        // 終了タグまでの内容を思考内容として抽出
        this.thinking += this.buffer.substring(0, endIndex);
        
        // バッファから思考ブロックと終了タグを削除
        this.buffer = this.buffer.substring(endIndex + endMatch[0].length);
        
        // 残りのバッファをクリーンテキストに追加
        this.cleanText += this.buffer;
        this.buffer = '';
        return;
      }
    }
    
    // 終了タグが見つからない場合、全体を思考内容として保持
    this.thinking += this.buffer;
    this.buffer = '';
  }

  /**
   * 新しい思考ブロックを検出して抽出
   */
  private _detectAndExtractThinking(): void {
    // 開始タグを検索
    for (const startPattern of this.THINKING_START_PATTERNS) {
      const startMatch = this.buffer.match(startPattern);
      if (startMatch) {
        // 開始タグが見つかった場合
        this.inThinkingBlock = true;
        const startIndex = startMatch.index!;
        
        // 開始タグ前のテキストをクリーンテキストに追加
        this.cleanText += this.buffer.substring(0, startIndex);
        
        // バッファから開始タグまでを削除
        this.buffer = this.buffer.substring(startIndex + startMatch[0].length);
        
        // 残りのバッファで思考ブロックの処理を開始
        this._processThinkingBlock();
        return;
      }
    }
    
    // 開始タグが見つからない場合、全体をクリーンテキストとして返す
    this.cleanText += this.buffer;
    this.buffer = '';
  }

  /**
   * パーサーの状態をリセット
   */
  reset(): void {
    this.buffer = '';
    this.inThinkingBlock = false;
    this.thinking = '';
    this.cleanText = '';
    this.partialTagDetected = false;
  }
}

/**
 * 便利なラッパー関数 - 完全なテキストに対して一度の処理を行う
 * @param text 処理するテキスト
 * @returns 抽出結果
 */
export function extractThinking(text: string): { text: string; thinking?: string } {
  const parser = new ThinkingParser();
  return parser.processFragment(text);
}
```

## 2. AbstractBotクラスの拡張

`src/app/bots/abstract-bot.ts` を修正して、応答テキストからThinking内容を抽出する処理を追加します。ストリーミング出力に対応するため、パーサーのインスタンスを保持します。

```typescript
// 冒頭に追加
import { ThinkingParser } from '~utils/thinking-parser'

// AbstractBotクラスに追加
export abstract class AbstractBot {
  // 既存のプロパティ
  protected conversationHistory?: ConversationHistory;
  // 新規追加: 各ボットインスタンスごとにパーサーを持つ
  private thinkingParser = new ThinkingParser();
  
  // doSendMessageGenerator メソッド内の修正部分
  protected async *doSendMessageGenerator(params: MessageParams) {
    // パーサーをリセット（会話の開始時に状態をクリア）
    this.thinkingParser.reset();
    
    const wrapError = (err: unknown) => {
      // 既存の実装
    }
    const stream = new ReadableStream<AnwserPayload>({
      start: (controller) => {
        this.doSendMessage({
          prompt: params.prompt,
          rawUserInput: params.rawUserInput,
          image: params.image,
          signal: params.signal,
          onEvent: (event) => {
            if (event.type === 'UPDATE_ANSWER') {
              // ここでテキスト処理を追加
              if (event.data.text) {
                // テキスト断片を思考パーサーで処理
                const processedData = this.thinkingParser.processFragment(event.data.text);
                
                // 既存のthinking内容が存在するか、パーサーが思考内容を抽出した場合
                const updatedData = {
                  text: processedData.text,
                  // 既存のthinking内容を優先、なければパーサーの結果を使用
                  thinking: event.data.thinking || processedData.thinking
                };
                
                controller.enqueue(updatedData);
              } else {
                controller.enqueue(event.data);
              }
            } else if (event.type === 'DONE') {
              // 会話終了時にパーサーをリセット
              this.thinkingParser.reset();
              controller.close();
            } else if (event.type === 'ERROR') {
              // 既存の実装
            }
          },
        }).catch((err) => {
          // 既存の実装
        });
      },
    });
    yield* streamAsyncIterable(stream);
  }
  
  // 他の既存のメソッド
}
```

## 特徴

1. **ストリーミングに対応**
   - テキスト断片を段階的に処理できる状態を持つパーサーを実装
   - パーサーの状態を会話の開始・終了時にリセット

2. **複数のタグ形式をサポート**
   - `<thinking>...</thinking>`
   - `<think>...</think>`
   - 大文字小文字を区別しない

3. **既存実装との互換性**
   - Bedrock APIの `reasoningContent` タイプの処理は既存のまま保持
   - テキスト内の思考タグの処理が追加され、両方をサポート

## テスト計画

1. ストリーミング出力での思考タグ処理のテスト
   - 完全なタグが一度に届く場合
   - タグが複数の断片にまたがる場合
   - 複数の思考ブロックがある場合

2. 異なるタグ形式のテスト
   - `<thinking>...</thinking>` 形式
   - `<think>...</think>` 形式
   - 大文字小文字の混在ケース（例：`<Thinking>...</THINKING>`）

3. エッジケースのテスト
   - 不完全なタグ（開始タグのみ、終了タグのみ）
   - 入れ子になったタグ
   - 非常に大きな思考ブロック

4. 既存のBedrockの実装との互換性テスト
   - `thinking` フィールドが既に存在する場合の挙動確認

## 実装ステップ

1. `thinking-parser.ts` ファイルの作成とThinkingParserクラスの実装
2. ThinkingParserのユニットテストの作成と検証
3. `abstract-bot.ts` の修正とテスト
4. 複数のモデルでの動作確認
5. ドキュメント更新（モデル開発者向けのガイド）
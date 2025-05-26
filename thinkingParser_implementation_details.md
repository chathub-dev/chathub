# ThinkingParser 実装詳細

## ストリーミング環境における Thinking タグの処理

調査した結果、以下のポイントに注意して実装を進める必要があります：

### 1. メッセージ処理の流れ

1. **SSEストリームデータの解析**
   - `parseSSEResponse`関数でストリームを処理
   - 各チャンクがテキストデコードされ、パーサーに渡される
   - イベントごとにコールバック関数が呼び出される

2. **コールバック内での処理**
   - 各モデルは受け取ったデータをそれぞれの方法で処理
   - Bedrockは`contentDelta`タイプと`reasoningContent`タイプを区別して処理
   - 他のモデルは単純にテキストを累積するだけの場合が多い

3. **UPDATE_ANSWER イベントの発行**
   - 各ボットは処理したデータを元に `UPDATE_ANSWER` イベントを発行
   - このイベントが `AbstractBot` クラスの `doSendMessageGenerator` メソッドで処理される

### 2. 共通処理の実装ポイント

#### A. ThinkingParserの設計

```typescript
export class ThinkingParser {
  private buffer: string = '';          // 未処理のテキストバッファ
  private inThinkingBlock: boolean = false;  // 現在思考ブロック内にあるか
  private extractedThinking: string = '';    // 抽出された思考内容
  private accumulatedText: string = '';      // 思考タグ除去後の累積テキスト
  
  // タグパターンの定義
  private readonly THINKING_START_PATTERNS = [/<thinking>/i, /<think>/i];
  private readonly THINKING_END_PATTERNS = [/<\/thinking>/i, /<\/think>/i];

  // テキストフラグメントを処理して結果を返す
  processFragment(textFragment: string): { text: string; thinking?: string } {
    // 新しいテキストをバッファに追加
    this.buffer += textFragment;
    
    // バッファを処理
    this._processBuffer();
    
    // 結果オブジェクト
    return {
      text: this.accumulatedText,
      thinking: this.extractedThinking.length > 0 ? this.extractedThinking : undefined
    };
  }

  // 内部処理メソッド
  private _processBuffer() {
    // 思考ブロック内にいる場合と外にいる場合で処理を分ける
    // ...処理ロジック...
  }

  // 状態リセット
  reset() {
    this.buffer = '';
    this.inThinkingBlock = false;
    this.extractedThinking = '';
    this.accumulatedText = '';
  }
}
```

#### B. AbstractBot クラスでの統合

```typescript
protected async *doSendMessageGenerator(params: MessageParams) {
  // パーサー初期化
  this.thinkingParser = new ThinkingParser();
  
  // ストリーム処理設定
  const stream = new ReadableStream<AnwserPayload>({
    start: (controller) => {
      this.doSendMessage({
        // ...パラメータ...
        onEvent: (event) => {
          if (event.type === 'UPDATE_ANSWER') {
            if (event.data.text) {
              // テキスト処理とプロパティ作成をメソッド化
              const processedData = this._processThinkingContent(event.data);
              controller.enqueue(processedData);
            } else {
              controller.enqueue(event.data);
            }
          } else if (event.type === 'DONE') {
            // 終了処理
            this.thinkingParser.reset();
            controller.close();
          } else {
            // エラー処理など
          }
        },
      });
    },
  });
  
  yield* streamAsyncIterable(stream);
}

// 抽出処理を専用メソッドとして実装
private _processThinkingContent(data: AnwserPayload): AnwserPayload {
  // 既にthinkingプロパティがある場合はそのまま
  if (data.thinking) {
    return data;
  }
  
  // テキストからthinkingを抽出
  const processed = this.thinkingParser.processFragment(data.text);
  
  return {
    text: processed.text,
    thinking: processed.thinking
  };
}
```

### 3. エッジケースと対策

#### A. タグが複数チャンクにまたがる場合

以下のような状況に対応する必要があります：

```
チャンク1: "こんにちは。<thi"
チャンク2: "nking>これは思考です"
チャンク3: "</thinking>。回答を続けます"
```

**対策**:
- バッファに累積して処理する
- 開始タグが不完全な場合は次のチャンクを待つ
- 終了タグが見つかるまでバッファに蓄積する

#### B. 不完全なタグ処理

開始タグがあるが終了タグがない場合などの不完全なタグ構造に対応します：

```
"<thinking>これは思考の一部ですが、終了タグがありません"
```

**対策**:
- タイムアウトや最大バッファサイズの設定
- 会話終了時（DONEイベント）に未処理のバッファを処理する仕組み

#### C. ネストされたタグ

```
"<thinking>外側の思考<thinking>内側の思考</thinking>外側の続き</thinking>"
```

**対策**:
- 最も外側のタグのみを処理する
- または入れ子構造をサポートする場合は、スタックベースの処理を実装

### 4. テスト方法

1. **単体テスト**
   - 完全なタグ、部分的なタグ、入れ子タグなど様々なパターンでThinkingParserをテスト
   - 各メソッドの境界条件テスト

2. **統合テスト**
   - モックデータを使用してAbstractBotの処理をテスト
   - 実際のボット実装でのテスト（例：PerplexityBot）

3. **E2Eテスト**
   - 実際のAPIレスポンスを模したストリーミングテスト
   - UI表示の確認（Thinkingコンポーネントの動作確認）

## 具体的な実装手順

1. **Phase 1: ユーティリティ実装**
   - `thinking-parser.ts` ファイルと基本クラス作成
   - ユニットテスト作成と基本機能の検証

2. **Phase 2: AbstractBotへの統合**
   - 思考パーサーを利用するよう `abstract-bot.ts` を修正
   - テスト環境でのイベント処理の確認

3. **Phase 3: 既存実装との整合性確認**
   - Bedrock API実装の動作確認
   - Perplexityなど他のボットでの動作確認

4. **Phase 4: リファインメントと最適化**
   - エッジケース対応
   - パフォーマンス最適化
   - コードクリーンアップ

5. **Phase 5: ドキュメンテーション**
   - 開発者向けガイド
   - 使用例の追加
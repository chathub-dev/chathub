# Thinkingパーサー実装計画

## 概要

すべてのモデルで `<thinking>...</thinking>` タグを「思考モード」として表示する機能を実装するための計画です。ユーザーの要望に応じて、特定のモデル（Bedrock API）に限定されていた機能をすべてのモデルで使えるようにします。

## 1. ユーティリティ関数の実装

`src/utils/thinking-parser.ts` に新しいユーティリティ関数を作成します。

```typescript
/**
 * テキストから<thinking>タグの内容を抽出し、タグ部分を削除したテキストとthinking内容を返す
 */
export function extractThinking(text: string): { text: string; thinking?: string } {
  // <thinking>...</thinking>パターンを検索
  const thinkingRegex = /<thinking>([\s\S]*?)<\/thinking>/;
  const match = text.match(thinkingRegex);
  
  if (!match) {
    // <thinking>タグが見つからない場合は元のテキストをそのまま返す
    return { text };
  }
  
  // <thinking>タグの内容を取得
  const thinkingContent = match[1];
  
  // 元のテキストから<thinking>...</thinking>部分を削除
  const cleanText = text.replace(thinkingRegex, '').trim();
  
  return {
    text: cleanText,
    thinking: thinkingContent
  };
}
```

## 2. AbstractBotクラスの拡張

`src/app/bots/abstract-bot.ts` を修正して、応答テキストからThinking内容を抽出する処理を追加します。

```typescript
// 冒頭に追加
import { extractThinking } from '~utils/thinking-parser'

// doSendMessageGenerator メソッド内の修正部分
protected async *doSendMessageGenerator(params: MessageParams) {
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
        onEvent(event) {
          if (event.type === 'UPDATE_ANSWER') {
            // ここでテキスト処理を追加
            if (event.data.text) {
              // <thinking>タグを処理
              const { text, thinking } = extractThinking(event.data.text);
              
              // 既存のthinking内容が存在しない場合のみ、抽出したthinkingを設定
              const updatedData = {
                text,
                thinking: event.data.thinking || thinking
              };
              
              controller.enqueue(updatedData);
            } else {
              controller.enqueue(event.data);
            }
          } else if (event.type === 'DONE') {
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
```

## 特徴

1. **モデルに依存しない実装**
   - すべてのモデルで共通して機能します
   - 個別のモデル実装を修正する必要がありません

2. **既存実装との互換性**
   - Bedrock APIの `reasoningContent` タイプの処理は既存のまま保持
   - テキスト内の `<thinking>` タグの処理が追加され、両方をサポート

3. **処理フロー**
   - テキストに `<thinking>` タグが含まれている場合、抽出して `thinking` フィールドに設定
   - 既に `thinking` フィールドに内容がある場合（Bedrock API等）、そちらが優先
   - 元のテキストから `<thinking>` タグは削除され、クリーンなテキストとして表示

## テスト計画

1. Perplexityなどのレスポンスで `<thinking>` タグが含まれる場合のテスト
2. 既にBedrockで実装されている `thinking` フィールドが正常に機能することの確認
3. タグがない場合、テキストがそのまま表示されることの確認
4. 複数の `<thinking>` タグがある場合のテスト（最初のタグのみ抽出する挙動を想定）

## 実装ステップ

1. `thinking-parser.ts` ファイルの作成とユーティリティ関数の実装
2. `abstract-bot.ts` の修正
3. テストとバグ修正
4. ドキュメント更新（モデル開発者向けのガイド）
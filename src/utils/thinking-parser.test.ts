import { ThinkingParser, extractThinking } from './thinking-parser';
import { describe, expect, it, beforeEach } from '@jest/globals';

describe('ThinkingParser', () => {
  describe('extractThinking', () => {
    it('should extract thinking content from text', () => {
      const text = 'こんにちは。<thinking>これは思考内容です。</thinking>回答を続けます。';
      const result = extractThinking(text);
      
      expect(result.text).toBe('こんにちは。回答を続けます。');
      expect(result.thinking).toBe('これは思考内容です。');
    });

    it('should handle text without thinking tags', () => {
      const text = 'タグのないテキストです。';
      const result = extractThinking(text);
      
      expect(result.text).toBe('タグのないテキストです。');
      expect(result.thinking).toBeUndefined();
    });

    it('should handle <think> tag variant', () => {
      const text = 'こんにちは。<think>これは思考内容です。</think>回答を続けます。';
      const result = extractThinking(text);
      
      expect(result.text).toBe('こんにちは。回答を続けます。');
      expect(result.thinking).toBe('これは思考内容です。');
    });

    it('should be case insensitive', () => {
      const text = 'こんにちは。<THINKING>これは思考内容です。</Thinking>回答を続けます。';
      const result = extractThinking(text);
      
      expect(result.text).toBe('こんにちは。回答を続けます。');
      expect(result.thinking).toBe('これは思考内容です。');
    });
  });

  describe('ThinkingParser class', () => {
    let parser: ThinkingParser;

    beforeEach(() => {
      parser = new ThinkingParser();
    });

    it('should process complete text in one fragment', () => {
      const text = 'こんにちは。<thinking>これは思考内容です。</thinking>回答を続けます。';
      const result = parser.processFragment(text);
      
      expect(result.text).toBe('こんにちは。回答を続けます。');
      expect(result.thinking).toBe('これは思考内容です。');
    });

    it('should handle streaming when thinking tag is at the beginning', () => {
      // 思考タグが冒頭にある場合のストリーミング処理をテスト
      // 1. 開始タグとコンテンツの一部
      let result = parser.processFragment('<thinking>これは思考');
      expect(result.text).toBe('');
      expect(result.thinking).toBe('これは思考');
      
      // 2. 内容の続きと終了タグ
      result = parser.processFragment('内容です。</thinking>');
      expect(result.text).toBe('');
      expect(result.thinking).toBe('これは思考内容です。');
      
      // 3. 後続テキスト
      result = parser.processFragment('回答を続けます。');
      expect(result.text).toBe('回答を続けます。');
      expect(result.thinking).toBe('これは思考内容です。');
    });

    it('should reset parser state', () => {
      // 思考ブロックの途中まで処理
      parser.processFragment('こんにちは。<thinking>これは思考');
      
      // リセット
      parser.reset();
      
      // 新しいテキストを処理
      const result = parser.processFragment('新しいテキストです。');
      
      expect(result.text).toBe('新しいテキストです。');
      expect(result.thinking).toBeUndefined();
    });

    it('should handle multiple thinking blocks', () => {
      // 最初のブロックを処理
      let result = parser.processFragment('こんにちは。<thinking>最初の思考</thinking>中間テキスト');
      expect(result.text).toBe('こんにちは。中間テキスト');
      expect(result.thinking).toBe('最初の思考');
      
      // 2つ目のブロックを処理
      result = parser.processFragment('<thinking>2つ目の思考</thinking>最後のテキスト');
      expect(result.text).toBe('最後のテキスト');
      expect(result.thinking).toBe('2つ目の思考');
    });
  });
});
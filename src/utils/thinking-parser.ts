/**
 * テキストから思考タグ（<thinking>...</thinking>または<think>...</think>）を抽出するためのユーティリティ
 * 思考タグは返答の冒頭にのみ含まれていることを前提とした、シンプルな実装
 */
export class ThinkingParser {
  // 状態変数
  private buffer: string = '';          // 未処理のテキストバッファ
  private inThinkingBlock: boolean = false;  // 現在思考ブロック内にあるか
  private extractedThinking: string = '';    // 抽出された思考内容
  private accumulatedText: string = '';      // 思考タグ除去後の累積テキスト
  
  // タグパターンの定義
  private readonly THINKING_START_PATTERNS = [/<thinking>/i, /<think>/i];
  private readonly THINKING_END_PATTERNS = [/<\/thinking>/i, /<\/think>/i];

  /**
   * テキスト断片を処理して思考内容とクリーンなテキストを抽出
   * @param textFragment 新しいテキスト断片
   * @returns 処理結果（クリーンテキストと抽出された思考内容）
   */
  processFragment(textFragment: string): { text: string; thinking?: string } {
    // バッファにテキスト断片を追加
    this.buffer += textFragment;
    
    // バッファを処理
    this._processBuffer();
    
    // 結果オブジェクト
    const result = {
      text: this.accumulatedText,
      thinking: this.extractedThinking.length > 0 ? this.extractedThinking : undefined
    };
    
    // 累積テキストをリセット（次の断片用）
    this.accumulatedText = '';
    
    return result;
  }

  /**
   * バッファを処理して思考内容を抽出
   */
  private _processBuffer(): void {
    // 思考ブロック内にいる場合
    if (this.inThinkingBlock) {
      this._processThinkingBlock();
    } else {
      this._detectAndExtractThinking();
    }
  }

  /**
   * 思考ブロック内のテキストを処理
   * より簡潔な実装 - 思考タグは応答の冒頭にのみ存在することを前提
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
        this.extractedThinking += this.buffer.substring(0, endIndex);
        
        // バッファから思考ブロックと終了タグを削除
        this.buffer = this.buffer.substring(endIndex + endMatch[0].length);
        
        // 残りのバッファをクリーンテキストに追加
        this.accumulatedText += this.buffer;
        this.buffer = '';
        return;
      }
    }
    
    // 終了タグが見つからない場合、バッファ全体を思考内容として保持
    this.extractedThinking += this.buffer;
    this.buffer = '';
  }

  /**
   * 新しい思考ブロックを検出して抽出
   * 思考タグは返答の冒頭にのみ含まれることを前提とした実装
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
        this.accumulatedText += this.buffer.substring(0, startIndex);
        
        // バッファから開始タグまでを削除
        this.buffer = this.buffer.substring(startIndex + startMatch[0].length);
        
        // 新しい思考ブロックを開始する場合、既存の思考内容をリセット
        this.extractedThinking = '';
        
        // 残りのバッファで思考ブロックの処理を開始
        this._processThinkingBlock();
        return;
      }
    }
    
    // 開始タグが見つからない場合、全体をクリーンテキストとして返す
    this.accumulatedText += this.buffer;
    this.buffer = '';
  }

  /**
   * パーサーの状態をリセット
   */
  reset(): void {
    this.buffer = '';
    this.inThinkingBlock = false;
    this.extractedThinking = '';
    this.accumulatedText = '';
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
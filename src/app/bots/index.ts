import { CustomBot } from './custombot'



/**
 * カスタムボットのインスタンスを作成する関数
 * @param index カスタムボットのインデックス（0ベース）
 * @returns CustomBotのインスタンス
 */
export function createBotInstance(index: number) {
  // インデックスが有効範囲内かチェック（負の値でないことだけ確認）
  if (index >= 0) {
    // CustomBotは1ベースのcustomBotNumberを期待するため、index + 1を渡す
    return new CustomBot({ customBotNumber: index + 1 });
  }

  // 無効なインデックスの場合はエラーをスロー
  console.error(`Invalid bot index: ${index}`);
  throw new Error(`Invalid bot index: ${index}`);
}

/**
 * ボットインスタンスの型
 */
export type BotInstance = ReturnType<typeof createBotInstance>

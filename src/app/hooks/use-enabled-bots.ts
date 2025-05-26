import useSWR, { useSWRConfig } from 'swr'
import { getUserConfig } from '~services/user-config'

// SWRキーを定義
const SWR_KEY = 'user-config-for-bots'

/**
 * ボット情報のインターフェース
 * インデックスベースのアプローチに変更
 */
interface BotInfo {
  index: number; // botId の代わりにインデックスを使用
  bot: {
    name: string;
    avatar: string;
    shortName?: string;
  };
}

/**
 * 有効なボットの情報を取得するフック
 * @returns 有効なボットの情報の配列
 */
export function useEnabledBots(): BotInfo[] {
  const query = useSWR(SWR_KEY, async () => {
    // ユーザー設定全体を取得
    const config = await getUserConfig()
    const enabledBotsFromConfig = config.enabledBots || [] // number[] 型
    const customApiConfigs = config.customApiConfigs || []

    // すべてのカスタムボットの情報を生成
    const allBots = customApiConfigs.map((customConfig, index) => {
      const bot = {
        name: customConfig.name,
        avatar: customConfig.avatar,
        shortName: customConfig.shortName,
      }
      return { index, bot };
    });

    // enabledBotsFromConfig に含まれ、かつ実際に存在するインデックスのボットのみをフィルタリング
    const enabledBots = allBots.filter(bot =>
      enabledBotsFromConfig.includes(bot.index) && bot.index < customApiConfigs.length
    );
    
    return enabledBots;
  })

  // データがなければ空配列を返す
  return query.data || []
}

// 他のコンポーネントからSWRキャッシュの再検証をトリガーするためのヘルパー関数
export function revalidateEnabledBots() {
  const { mutate } = useSWRConfig()
  console.log('useEnabledBots: Triggering revalidation for', SWR_KEY);
  mutate(SWR_KEY)
}

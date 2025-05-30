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
    const customApiConfigs = config.customApiConfigs || []

    // すべてのカスタムボットの情報を生成し、enabledプロパティでフィルタリング
    const enabledBots = customApiConfigs
      .map((customConfig, index) => {
        const bot = {
          name: customConfig.name,
          avatar: customConfig.avatar,
          shortName: customConfig.shortName,
        }
        return { index, bot };
      })
      .filter((botInfo, index) => {
        // enabledプロパティがtrueのボットのみを返す
        const config = customApiConfigs[index];
        return config.enabled === true;
      });
    
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

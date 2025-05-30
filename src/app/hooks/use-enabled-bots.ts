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
  const query = useSWR<BotInfo[]>(SWR_KEY, async (): Promise<BotInfo[]> => {
    try {
      // ユーザー設定全体を取得
      const config = await getUserConfig()
      
      // customApiConfigsが存在し、配列であることを確認
      if (!config || !Array.isArray(config.customApiConfigs)) {
        console.warn('useEnabledBots: customApiConfigs is not available or not an array')
        return []
      }

      const customApiConfigs = config.customApiConfigs

      // すべてのカスタムボットの情報を生成し、enabledプロパティでフィルタリング
      const enabledBots: BotInfo[] = []
      
      customApiConfigs.forEach((customConfig, index) => {
        if (customConfig && customConfig.enabled === true) {
          const bot = {
            name: customConfig.name || `Custom Bot ${index + 1}`,
            avatar: customConfig.avatar || '',
            shortName: customConfig.shortName || '',
          }
          enabledBots.push({ index, bot })
        }
      })
      
      return enabledBots;
    } catch (error) {
      console.error('useEnabledBots: Error processing enabled bots:', error)
      return []
    }
  }, {
    // エラー時のフォールバック
    fallbackData: [],
    // エラー時も再試行しない（無限ループを防ぐ）
    shouldRetryOnError: false,
  })

  // データがなければ空配列を返す（型安全性を確保）
  return Array.isArray(query.data) ? query.data : []
}

// 他のコンポーネントからSWRキャッシュの再検証をトリガーするためのヘルパー関数
export function revalidateEnabledBots() {
  const { mutate } = useSWRConfig()
  console.log('useEnabledBots: Triggering revalidation for', SWR_KEY);
  mutate(SWR_KEY)
}

import { fileOpen, fileSave } from 'browser-fs-access'
import Browser from 'webextension-polyfill'
import { CustomApiConfig } from '~services/user-config'

export async function exportData() {
  const [syncData, localData] = await Promise.all([Browser.storage.sync.get(null), Browser.storage.local.get(null)])
  const data = {
    sync: syncData,
    local: localData,
    localStorage: { ...localStorage },
  }
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
  await fileSave(blob, { fileName: 'huddlellm.json' })
}

export async function importData() {
  const blob = await fileOpen({ extensions: ['.json'] })
  const json = JSON.parse(await blob.text())
  if (!json.sync) {
    throw new Error('Invalid data')
  }
  // Initialize empty local data if not present
  if (!json.local) {
    json.local = {}
  }

  // Convert old rakutenApiConfig to customApiConfig format
  if (json.sync.rakutenApiConfigCount) {
    const count = json.sync.rakutenApiConfigCount
    for (let i = 0; i < count; i++) {
      const oldKey = `rakutenApiConfig_${i}`
      const newKey = `customApiConfig_${i}`
      if (json.sync[oldKey]) {
        const oldConfig = json.sync[oldKey]
        json.sync[newKey] = {
          id: i + 1,
          name: oldConfig.name || '',
          shortName: oldConfig.shortName || oldConfig.name?.slice(0, 4) || '',
          host: oldConfig.host || oldConfig.url || '',
          model: oldConfig.model || '',
          temperature: oldConfig.temperature || 0.7,
          systemMessage: oldConfig.systemMessage || '',
          avatar: oldConfig.avatar || '',
          apiKey: oldConfig.apiKey || oldConfig.token || '',
          thinkingMode: oldConfig.thinkingMode || false,
          thinkingBudget: oldConfig.thinkingBudget || 2000,
          provider: oldConfig.provider || 'openai',
          webAccess: oldConfig.webAccess || false
        }
        delete json.sync[oldKey]
      }
    }
    // Convert top-level rakuten keys to custom keys
    if (json.sync.rakutenApiHost) {
      json.sync.customApiHost = json.sync.rakutenApiHost
    }
    if (json.sync.rakutenApiKey) {
      json.sync.customApiKey = json.sync.rakutenApiKey
    }

    json.sync.customApiConfigCount = count
    delete json.sync.rakutenApiConfigCount
    delete json.sync.rakutenApiHost
    delete json.sync.rakutenApiKey
  }

  if (!window.confirm('Are you sure you want to import data? This will overwrite your current data')) {
    return
  }
  await Browser.storage.local.clear()
  await Browser.storage.local.set(json.local)
  await Browser.storage.sync.clear()
  await Browser.storage.sync.set(json.sync)

  if (json.localStorage) {
    for (const [k, v] of Object.entries(json.localStorage as Record<string, string>)) {
      localStorage.setItem(k, v)
    }
  }

  alert('Imported data successfully. The page will now reload to apply changes.')
  // 少し待機してからリロード
  setTimeout(() => location.reload(), 1000)
}

/**
 * カスタムAPIテンプレートをエクスポートする関数
 * APIキーを除外し、テンプレートとして必要な情報のみを出力する
 */
export async function exportCustomAPITemplate() {
  // ストレージからカスタムAPI設定を取得
  const syncData = await Browser.storage.sync.get(null)
  
  // カスタムAPI設定の抽出
  const templateData: { sync: Record<string, any> } = {
    sync: {}
  }
  
  // customApiConfig_XXXキーを検索
  const configKeys = Object.keys(syncData).filter(key => key.startsWith('customApiConfig_'));
  
  // 各カスタムAPI設定を処理
  for (const configKey of configKeys) {
    const config = syncData[configKey] as CustomApiConfig | undefined
    
    if (config) {
      // APIキーを除外したコピーを作成
      const templateConfig: Partial<CustomApiConfig> = {
        ...config,
        apiKey: '' // APIキーを空にする
      }
      
      // テンプレートデータに追加
      templateData.sync[configKey] = templateConfig
    }
  }
  
  // 共通のAPIホストを含める（APIキーは含めない）
  if (syncData.customApiHost) {
    templateData.sync.customApiHost = syncData.customApiHost
  }
  
  // JSONとして保存
  const blob = new Blob([JSON.stringify(templateData)], { type: 'application/json' })
  await fileSave(blob, { fileName: 'huddle-llm-template.json' })
}

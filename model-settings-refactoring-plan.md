## モデル設定機能 解析・リファクタリング提案書 (最終版: Local Storage活用)

### 1. はじめに

本ドキュメントは、「モデル削除が永続化されない」問題の解決、および Chrome Sync ストレージの容量制限への対応として、`customApiConfigs` の保存先を `Browser.storage.local` に変更する最終的なリファクタリング案を提案します。その他の設定は引き続き `Browser.storage.sync` を使用します。

### 2. 現状のコード解析と問題点の特定

#### 2.1. 実際のコード確認結果
*   **[`SettingPage.tsx`](src/app/pages/SettingPage.tsx:1):** `save` 関数 ([`SettingPage.tsx:92`](src/app/pages/SettingPage.tsx:92)) で `cloneDeep` を使用し、イミュータブルな更新を試みている。
*   **[`CustomAPISettings.tsx`](src/app/components/Settings/CustomAPISettings.tsx):** `deleteCustomModel` 関数 ([`CustomAPISettings.tsx:179`](src/app/components/Settings/CustomAPISettings.tsx:179)) で配列のコピーを作成後 `splice` で要素を削除し、`updateConfigValue` を呼び出している。
*   **[`user-config.ts`](src/services/user-config.ts:1):**
    *   `customApiConfigs` は `CUSTOM_API_CONFIG_PREFIX}${index}` という個別キーで `Browser.storage.sync` に保存されている。
    *   古いキーを削除するロジック ([`user-config.ts:373-376`](src/services/user-config.ts:373-376)) に問題がある。
        *   [`user-config.ts:374`](src/services/user-config.ts:374) に全角スペースがあり `parseInt` が `NaN` を返す。
        *   `index >= limitedConfigs.length` という条件自体が、配列の途中要素を削除した場合に古いキーを残してしまう根本的な欠陥を持つ。

#### 2.2. Chrome Sync ストレージの制限
*   1キーあたりの最大サイズ: 8KB
*   総容量制限: 100KB
*   `customApiConfigs` を単一キーで `sync` に保存すると、この制限を超える可能性があるため、個別キー方式が採用されていた。

### 3. リファクタリング方針 (最終決定)

1.  **`customApiConfigs` の保存先変更:**
    *   [`src/services/user-config.ts`](src/services/user-config.ts:1) を修正し、`customApiConfigs` の読み書きを `Browser.storage.local.get('customApiConfigs')` および `Browser.storage.local.set({ customApiConfigs: ... })` を使用するように変更。
    *   `customApiConfigs` は単一のキー (`'customApiConfigs'`) で配列ごと `local` ストレージに保存。これにより Chrome Sync ストレージの容量制限を回避し、個別キー管理の複雑さを解消。
2.  **その他の設定の維持:**
    *   `customApiConfigs` 以外の設定項目は、引き続き `Browser.storage.sync` を使用し、デバイス間同期を維持。
3.  **マイグレーション処理の実装:**
    *   `getUserConfig` 関数内に、既存の `sync` ストレージ上の古い個別キー形式 (`CUSTOM_API_CONFIG_PREFIX}${index}`) で保存された `customApiConfigs` データを検出し、新しい `local` ストレージの単一キー (`'customApiConfigs'`) へ移行する処理を追加。移行後、`sync` ストレージ上の古い個別キーは削除。
4.  **状態管理とUI:**
    *   [`SettingPage.tsx`](src/app/pages/SettingPage.tsx:1) での `customApiConfigs` の状態管理やUI操作は、現状のイミュータブルな更新方法（`cloneDeep` の使用など）を基本的に維持。
5.  **問題点の解消:**
    *   `customApiConfigs` を単一キーで `local` に保存する方式に変更することで、当初問題となっていた [`user-config.ts:374`](src/services/user-config.ts:374) の全角スペースを含む個別キー削除ロジック自体が不要になり、モデル削除が永続化されない問題は根本的に解決される。

### 4. 具体的な変更点 ([`src/services/user-config.ts`](src/services/user-config.ts:1) が主)

#### 4.1. `getUserConfig` の修正

```typescript
// src/services/user-config.ts
export async function getUserConfig(): Promise<UserConfig> {
  try {
    // 1. customApiConfigs を local から取得
    const localData = await Browser.storage.local.get('customApiConfigs');
    let customConfigsInLocal: CustomApiConfig[] | undefined = localData.customApiConfigs;

    // 2. その他の設定を sync から取得 (customApiConfigs を除く)
    const syncKeysToGet = Object.keys(userConfigWithDefaultValue).filter(k => k !== 'customApiConfigs');
    const syncData = await Browser.storage.sync.get(syncKeysToGet);

    let finalConfig = defaults({}, syncData, userConfigWithDefaultValue); // syncData とデフォルトでベースを作成

    // 3. マイグレーション処理: sync の個別キー -> local の単一キー
    // customConfigsInLocal が未定義または空の場合のみマイグレーションを試みる
    if (customConfigsInLocal === undefined || (Array.isArray(customConfigsInLocal) && customConfigsInLocal.length === 0)) {
      const allSyncDataForMigration = await Browser.storage.sync.get(null); // sync全体を取得して個別キーを探す
      const oldIndividualConfigKeys = Object.keys(allSyncDataForMigration)
        .filter(key => key.startsWith(CUSTOM_API_CONFIG_PREFIX));

      if (oldIndividualConfigKeys.length > 0) {
        console.log('Migrating customApiConfigs from sync (individual keys) to local (single key)...');
        let migratedConfigs: CustomApiConfig[] = [];
        for (const key of oldIndividualConfigKeys) {
          if (allSyncDataForMigration[key] && typeof allSyncDataForMigration[key] === 'object') {
            migratedConfigs.push(allSyncDataForMigration[key] as CustomApiConfig);
          }
        }
        // 念のためインデックス順にソート (キー名からインデックスを抽出してソート)
        migratedConfigs.sort((a, b) => {
            const getIndexFromKey = (config: CustomApiConfig, keyPrefix: string, allData: Record<string, any>): number => {
                // configオブジェクトから対応するキーを探し、そのキーからインデックスを抽出
                for (const k in allData) {
                    if (allData[k] === config && k.startsWith(keyPrefix)) {
                        const indexStr = k.substring(keyPrefix.length);
                        const index = parseInt(indexStr, 10);
                        if (!isNaN(index)) return index;
                    }
                }
                return Infinity; // 見つからない場合は最後に
            };
            const indexA = getIndexFromKey(a, CUSTOM_API_CONFIG_PREFIX, allSyncDataForMigration);
            const indexB = getIndexFromKey(b, CUSTOM_API_CONFIG_PREFIX, allSyncDataForMigration);
            return indexA - indexB;
        });
        
        customConfigsInLocal = migratedConfigs;
        await Browser.storage.local.set({ customApiConfigs: migratedConfigs });
        await Browser.storage.sync.remove(oldIndividualConfigKeys); // sync から古い個別キーを削除
        console.log('Migration complete.');
      }
    }

    // finalConfig に customApiConfigs をセット (マイグレーション後またはlocalから取得した値)
    finalConfig.customApiConfigs = customConfigsInLocal || [...userConfigWithDefaultValue.customApiConfigs];
    
    // providerフィールドのデフォルト値設定など、既存の処理は維持
    if (finalConfig.customApiConfigs) {
      finalConfig.customApiConfigs.forEach((config: CustomApiConfig) => {
        if (config.provider === undefined) {
          config.provider = CustomApiProvider.OpenAI; // デフォルトプロバイダーを設定
        }
      });
    }
    
    // enabledBotsからenabledプロパティへのマイグレーション (syncData を参照)
    if (syncData.enabledBots && Array.isArray(syncData.enabledBots) && finalConfig.customApiConfigs) {
        finalConfig.customApiConfigs.forEach((config: CustomApiConfig, index: number) => {
        // enabledBots はインデックスの配列だったため、新しい customApiConfigs のインデックスと照合
        if (config.enabled === undefined) {
          // 注意: enabledBots のインデックスが、マイグレーション後の customApiConfigs の
          // インデックスと一致する保証がない場合、より堅牢なマッピングが必要。
          // ここでは単純なインデックス一致で進めるが、IDベースならより確実。
          // 今回はIDベースではないので、インデックスで仮対応。
          config.enabled = syncData.enabledBots.includes(index); 
        }
      });
      await Browser.storage.sync.remove('enabledBots');
    }
    
    // useCustomChatbotOnly フラグを削除 (syncData を参照)
    if (finalConfig.hasOwnProperty('useCustomChatbotOnly')) {
        delete (finalConfig as any).useCustomChatbotOnly;
        await Browser.storage.sync.remove('useCustomChatbotOnly');
    }

    return finalConfig;
  } catch (error) {
    console.error('Failed to get user config:', error);
    toast.error('設定の読み込みに失敗しました。デフォルト設定を使用します。');
    return { ...userConfigWithDefaultValue }; // エラー時は完全なデフォルト値を返す
  }
}
```

#### 4.2. `updateUserConfig` の修正

```typescript
// src/services/user-config.ts
export async function updateUserConfig(updates: Partial<UserConfig>) {
  try {
    const { customApiConfigs, ...otherUpdates } = updates;

    // 1. customApiConfigs を local に保存 (存在する場合)
    if (customApiConfigs !== undefined) { // null や空配列も保存対象とするため、undefined のみチェック
      if (Array.isArray(customApiConfigs)) {
        const limitedConfigs = customApiConfigs.slice(0, MAX_CUSTOM_MODELS);
        await Browser.storage.local.set({ customApiConfigs: limitedConfigs });
      } else {
        // customApiConfigs が配列でない不正なケース (例: null)
        await Browser.storage.local.set({ customApiConfigs: [] }); // 空配列として保存
      }
    }

    // 2. その他の設定を sync に保存 (存在する場合)
    if (Object.keys(otherUpdates).length > 0) {
      const updatesForSync: Record<string, any> = {};
      const keysToRemoveFromSync: string[] = [];

      for (const [key, value] of Object.entries(otherUpdates)) {
        if (value === undefined) {
          keysToRemoveFromSync.push(key);
        } else {
          updatesForSync[key] = value;
        }
      }
      if (Object.keys(updatesForSync).length > 0) {
        await Browser.storage.sync.set(updatesForSync);
      }
      if (keysToRemoveFromSync.length > 0) {
        await Browser.storage.sync.remove(keysToRemoveFromSync);
      }
    }
    
    // 古い個別キー削除ロジック (全角スペース問題があった箇所) は完全に不要になる

    const event = new CustomEvent(CHATBOTS_UPDATED_EVENT);
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Failed to update user config:', error);
    let errorMessage = '設定の保存に失敗しました';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    toast.error(errorMessage);
  }
}
```

#### 4.3. `clearAllCustomConfigs` の修正

```typescript
// src/services/user-config.ts
export async function clearAllCustomConfigs(): Promise<void> {
  try {
    await Browser.storage.local.set({ customApiConfigs: [] }); // local の customApiConfigs を空配列で上書き

    // sync 上の古い個別キーも念のため削除 (マイグレーション漏れ対策)
    const allSyncKeys = await Browser.storage.sync.get(null);
    const oldIndividualConfigKeysInSync = Object.keys(allSyncKeys)
      .filter(key => key.startsWith(CUSTOM_API_CONFIG_PREFIX));
    if (oldIndividualConfigKeysInSync.length > 0) {
      await Browser.storage.sync.remove(oldIndividualConfigKeysInSync);
    }
    toast.success('全てのカスタム設定を削除しました');
  } catch (error) {
    console.error('Failed to clear custom configs:', error);
    let errorMessage = 'カスタム設定の削除に失敗しました';
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    toast.error(errorMessage);
  }
}
```

### 5. 期待される効果
*   モデル削除が正しく永続化される。
*   `customApiConfigs` の保存に `local` ストレージを使用することで、Chrome Sync ストレージの容量制限を回避。
*   その他の設定は `sync` ストレージでデバイス間同期を維持。
*   古い個別キー方式からのマイグレーションにより、データ整合性を確保。

### 6. 実装ステップ
1.  **`user-config.ts` の修正:**
    *   `getUserConfig` を上記提案通りに修正（`local` と `sync` の分離、マイグレーション処理含む）。
    *   `updateUserConfig` を上記提案通りに修正。
    *   `clearAllCustomConfigs` を上記提案通りに修正。
2.  **動作確認:**
    *   新規ユーザーの場合の動作確認。
    *   既存データ（`sync` 上に個別キー形式）を持つユーザーのマイグレーション動作確認。
    *   モデルの追加、編集、削除が正しく動作し、`local` ストレージに永続化されることを確認。
    *   その他の設定が `sync` ストレージに正しく保存・同期されることを確認。
    *   ページ再読み込み後も設定が維持されることを確認。

### 7. まとめ
この最終プランにより、報告された問題の解決とストレージ制限への対応を両立します。
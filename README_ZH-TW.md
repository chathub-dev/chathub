<p align="center">
    <img src="./src/assets/icon.png" width="150">
</p>

<h1 align="center">ChatHub</h1>

<div align="center">

### ChatHub 是個全能的聊天機器人客戶端

[![作者][作者-image]][作者-url]
[![許可證][許可證-image]][許可證-url]
[![發布][發布-image]][發布-url]
[![版本發佈][版本發佈-image]][版本發佈-url]    
    
[English](README.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](README_IN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [简体中文](README_ZH-CN.md) &nbsp;&nbsp;|&nbsp;&nbsp; 繁體中文 &nbsp;&nbsp;|&nbsp;&nbsp; [日本語](README_JA.md)

##    
    
### 安装
    
<a href="https://chromewebstore.google.com/detail/chathub-all-in-one-chatbo/iaakpnchhognanibcahlpcplchdfmgma?utm_source=website"><img src="https://user-images.githubusercontent.com/64502893/231991498-8df6dd63-727c-41d0-916f-c90c15127de3.png" width="200" alt="获取 Chromium 版本的 ChatHub"></a>&nbsp;&nbsp;
<a href="https://microsoftedge.microsoft.com/addons/detail/chathub-allinone-chat/kdlmggoacmfoombiokflpeompajfljga"><img src="https://user-images.githubusercontent.com/64502893/231991158-1b54f831-2fdc-43b6-bf9a-f894000e5aa8.png" width="160" alt="获取 Microsoft Edge 版本的 ChatHub"></a>
    
##

[螢幕截圖](#-螢幕截圖) &nbsp;&nbsp;|&nbsp;&nbsp; [功能特色](#-功能特色) &nbsp;&nbsp;|&nbsp;&nbsp; [支援的聊天機器人](#-支援的聊天機器人) &nbsp;&nbsp;|&nbsp;&nbsp; [手動安裝](#-手動安裝) &nbsp;&nbsp;|&nbsp;&nbsp; [從原始碼建立](#-從原始碼建立) &nbsp;&nbsp;|&nbsp;&nbsp; [更新日誌](#-更新日誌)

[作者-image]: https://img.shields.io/badge/author-wong2-blue.svg
[作者-url]: https://github.com/wong2    
[許可證-image]: https://img.shields.io/github/license/chathub-dev/chathub?color=blue
[許可證-url]: https://github.com/chathub-dev/chathub/blob/main/LICENSE
[發布-image]: https://img.shields.io/github/v/release/chathub-dev/chathub?color=blue
[發布-url]: https://github.com/chathub-dev/chathub/releases/latest
[版本發佈-image]: https://img.shields.io/github/last-commit/chathub-dev/chathub?label=last%20commit
[版本發佈-url]: https://github.com/chathub-dev/chathub/commits

</div>

##

## 📷 螢幕截圖

![螢幕截圖](screenshots/extension.png?raw=true)

![螢幕截圖 (暗模式)](screenshots/dark.png?raw=true)

## ✨ 功能特色

- 🤖 在一個應用程式中使用不同的聊天機器人，目前支援 ChatGPT、新的 Bing Chat、Google Bard、Claude，還有 10 多個開源模型，包括 Alpaca、Vicuna、ChatGLM 等
- 💬 同時與多個聊天機器人進行對話，輕鬆比較它們的回答
- 🚀 支援 ChatGPT API 和 GPT-4 瀏覽
- 🔍 快速啟動應用程式的捷徑，可在瀏覽器中的任何地方使用
- 🎨 支援 Markdown 和程式碼高亮顯示
- 📚 自訂提示和社群提示的提示庫
- 💾 本地保存對話歷史
- 📥 匯出和匯入所有資料
- 🔗 將對話分享為 Markdown 格式
- 🌙 黑暗模式

## 🤖 支援的聊天機器人

* ChatGPT（透過網頁應用程式/API/Azure/Poe）
* Bing Chat
* Google Bard
* Claude（透過 Poe）
* iFlytek Spark
* ChatGLM
* Alpaca
* Vicuna
* Koala
* Dolly
* LLaMA
* StableLM
* OpenAssistant
* ChatRWKV
* ...

## 🔧 手動安裝

- 從 [Releases](https://github.com/chathub-dev/chathub/releases) 下載 chathub.zip
- 解壓縮該文件
- 在 Chrome/Edge 瀏覽器中，前往擴展功能頁面 (chrome://extensions 或 edge://extensions)
- 啟用開發人員模式
- 拖動解壓縮後的文件夾到頁面上的任何位置以導入它 (導入後不要刪除文件夾)

## 🔨 從原始碼建立

- 複製原始碼
- `yarn install`
- `yarn build`
- 按照「手動安裝」中的步驟將 `dist` _資料夾載入瀏覽器_

## 📜 更新日誌

### v1.22.0

- 支援 Claude API

### v1.21.0

- 新增更多開源模型

### v1.20.0

- 從 Chrome 側邊面板進入

### v1.19.0

- 快速存取提示

### v1.18.0

- 支援 Alpaca、Vicuna 和 ChatGLM

### v1.17.0

- 支援 GPT-4 瀏覽模型

### v1.16.5

- 新增支援 Azure OpenAI 服務

### v1.16.0

- 新增自訂主題設定

### v1.15.0

- 新增訊飛 Spark 機器人

### v1.14.0

- 支援高級用戶的全能模式中的更多機器人

### v1.12.0

- 新增高級授權

### v1.11.0

- 支援 Claude (透過 Poe)

### v1.10.0

- 新增 Command + K 功能

### v1.9.4

- 新增暗模式

### v1.9.3

- 支援使用 katex 的數學公式
- 將社區提示保存到本地

### v1.9.2

- 刪除對話歷史消息

### v1.9.0

- 可將聊天記錄以 Markdown 格式或通過 sharegpt.com 分享

### v1.8.0

- 匯出/匯入所有數據
- 編輯本地提示
- 切換聊天機器人以進行比較

### v1.7.0

- 新增對話歷史

### v1.6.0

- 新增支援 Google Bard

### v1.5.4

- 支援 ChatGPT API 模式下的 GPT-4 模型

### v1.5.1

- 新增 i18n 設置

### v1.5.0

- 支援 ChatGPT Webapp 模式下的 GPT-4 模型

### v1.4.0

- 新增提示庫

### v1.3.0

- 新增複製代碼按鈕
- 在全能模式和獨立模式之間同步聊天狀態
- 允許在生成答案時輸入

### v1.2.0

- 支援複製消息文本
- 改善設置頁面表單元素樣式

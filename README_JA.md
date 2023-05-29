<p align="center">
    <img src="./src/assets/icon.png" width="150">
</p>

<h1 align="center">ChatHub</h1>

<div align="center">

### ChatHub はオールインワンのチャットボットクライアントです

[![author][author-image]][author-url]
[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![last commit][last-commit-image]][last-commit-url]    
    
[English](README.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](README_IN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [简体中文](README_ZH-CN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [繁體中文](README_ZH-TW.md) &nbsp;&nbsp;|&nbsp;&nbsp; 日本語

##    
    
### インストール
    
<a href="https://chrome.google.com/webstore/detail/chathub-all-in-one-chatbo/iaakpnchhognanibcahlpcplchdfmgma?utm_source=github"><img src="https://user-images.githubusercontent.com/64502893/231991498-8df6dd63-727c-41d0-916f-c90c15127de3.png" width="200" alt="Chromium 用の ChatHub を入手してください"></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/chathub-allinone-chat/kdlmggoacmfoombiokflpeompajfljga?utm_source=github"><img src="https://user-images.githubusercontent.com/64502893/231991158-1b54f831-2fdc-43b6-bf9a-f894000e5aa8.png" width="160" alt="Microsoft Edge 用の ChatHub を入手してください"></a>
    
##

[スクリーンショット](#-スクリーンショット) &nbsp;&nbsp;|&nbsp;&nbsp; [特徴](#-特徴) &nbsp;&nbsp;|&nbsp;&nbsp; [サポートされているボット](#-サポートされているボット) &nbsp;&nbsp;|&nbsp;&nbsp; [手動インストール](#-手動インストール) &nbsp;&nbsp;|&nbsp;&nbsp; [ソースからビルドする](#-ソースからビルドする) &nbsp;&nbsp;|&nbsp;&nbsp; [変更ログ](#-変更ログ)

[author-image]: https://img.shields.io/badge/author-wong2-blue.svg
[author-url]: https://github.com/wong2    
[license-image]: https://img.shields.io/github/license/chathub-dev/chathub?color=blue
[license-url]: https://github.com/chathub-dev/chathub/blob/main/LICENSE
[release-image]: https://img.shields.io/github/v/release/chathub-dev/chathub?color=blue
[release-url]: https://github.com/chathub-dev/chathub/releases/latest   
[last-commit-image]: https://img.shields.io/github/last-commit/chathub-dev/chathub?label=last%20commit
[last-commit-url]: https://github.com/chathub-dev/chathub/commits

</div>

##

## 📷 スクリーンショット

![Screenshot](screenshots/extension.png?raw=true)

![Screenshot (Dark Mode)](screenshots/dark.png?raw=true)


## ✨ 特徴

- 🤖 アプリ内で異なるチャットボットを使用します。現在は ChatGPT、新しい Bing Chat、Google Bard、Claude（Poe 経由）、Alpaca、Vicuna、ChatGLM をサポートしており、将来的にはさらに統合されます
- 💬 複数のチャットボットと同時にチャットすることで、回答を比較しやすくします
- 🚀 ChatGPT API および GPT-4 Browsing をサポートします
- 🔍 ブラウザのどこからでもアプリを素早くアクティブにするためのショートカット
- 🎨 Markdown とコードのハイライトのサポート
- 📚 カスタムプロンプトとコミュニティプロンプトのためのプロンプトライブラリ
- 💾 ローカルに保存された会話履歴
- 📥 データのエクスポートとインポート
- 🔗 マークダウン形式で会話を共有
- 🌙 ダークモード

## 🤖 サポートされているボット

* ChatGPT（Web アプリ/API/Azure/Poe経由）
* Bing Chat
* Google Bard
* Claude（Poe 経由）
* iFlytek Spark
* ChatGLM
* Alpaca
* Vicuna
* ...

## 🔧 手動インストール

- [リリース](https://github.com/chathub-dev/chathub/releases)から chathub.zip をダウンロード
- ファイルを解凍
- Chrome/Edge で拡張機能ページに移動します (chrome://extensions または edge://extensions)
- 開発者モードを有効にする
- 解凍したフォルダーをページ上の任意の場所にドラッグしてインポートします (後でフォルダーを削除しないでください)

## 🔨 ソースからビルドする

- ソースコードをクローン
- `yarn install`
- `yarn build`
- _マニュアルインストール_ の手順に従って、`dist` _フォルダをブラウザに読み込みます_

## 📜 変更ログ

### v1.20.0

- Chrome のサイドパネルからアクセスできるようにしました

### v1.19.0

- プロンプトへの簡単アクセス

### v1.18.0

- Alpaca、Vicuna、ChatGLM のサポート

### v1.17.0

- GPT-4 Browsing モデルのサポート

### v1.16.5

- Azure OpenAI サービスのサポートを追加

### v1.16.0

- カスタムテーマ設定を追加

### v1.15.0

- Xunfei Spark ボットを追加

### v1.14.0

- プレミアムユーザー向けのオールインワンモードで、より多くのボットをサポート

### v1.12.0

- プレミアムライセンスを追加

### v1.11.0

- クロードのサポートを追加 (Poe経由で)

### v1.10.0

- Command + K

### v1.9.4

- ダークモード

### v1.9.3

- katex で数式をサポート
- コミュニティプロンプトをローカルに保存

### v1.9.2

- 履歴メッセージを削除する

### v1.9.0

- markdown として、または sharegpt.com 経由でチャットを共有する

### v1.8.0

- すべてのデータのインポート/エクスポート
- ローカルプロンプトを編集する
- 比較のためにチャットボットを切り替える

### v1.7.0

- 会話履歴を追加する

### v1.6.0

- Google Bard のサポートを追加

### v1.5.4

- ChatGPT api モードで GPT-4 モデルをサポート

### v1.5.1

- i18n 設定を追加

### v1.5.0

- ChatGPT Webapp モードで GPT-4 モデルをサポート

### v1.4.0

- プロンプトライブラリを追加

### v1.3.0

- コピーコードボタンを追加
- オールインワンモードとスタンドアロンモードの間でチャット状態を同期
- 回答の生成中に入力を許可

### v1.2.0

- コピーメッセージテキストのサポート
- ページフォーム要素スタイルの設定を改善

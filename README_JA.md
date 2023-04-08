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
    
[English](README.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](README_IN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [简体中文](README_ZH-CN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [繁體中文](README_ZH-TW.md)|&nbsp;&nbsp; 日本語

##    
    
### インストール
    
<a href="https://chrome.google.com/webstore/detail/chathub-all-in-one-chatbo/iaakpnchhognanibcahlpcplchdfmgma?utm_source=website"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get ChatHub for Chromium"></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/chathub-allinone-chat/kdlmggoacmfoombiokflpeompajfljga"><img src="https://user-images.githubusercontent.com/585534/107280673-a5ece780-6a26-11eb-9cc7-9fa9f9f81180.png" alt="Get ChatHub for Microsoft Edge"></a>
    
##

[スクリーンショット](#-Screenshot) &nbsp;&nbsp;|&nbsp;&nbsp; [特徴](#-Features) &nbsp;&nbsp;|&nbsp;&nbsp; [手動インストール](#-manual-installation) &nbsp;&nbsp;|&nbsp;&nbsp; [ロードマップ](#%EF%B8%8F-roadmap) &nbsp;&nbsp;|&nbsp;&nbsp; [変更ログ](#-Changelog)

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

- 🤖 1 つのアプリでさまざまなチャットボットを使用できます。現在は ChatGPT、新しい Bing Chat、Google Bard をサポートしていますが、将来的にはさらに統合される予定です
- 💬 同時に複数のチャットボットとチャットして、回答を簡単に比較できます
- 🚀 ChatGPT Plus よりも高速で費用対効果の高い ChatGPT API モードをサポート
- 📊 ChatGPT API モード使用時のトークン使用統計
- 🔍 ブラウザのどこからでもアプリをすばやく起動するためのショートカット
- 🎨 Markdown とコードの強調表示のサポート
- 📚 カスタム プロンプトおよびコミュニティ プロンプト用のプロンプト ライブラリ
- 💾 ローカルに保存された会話履歴
- 📥 すべてのデータのエクスポートとインポート
- 🔗 会話を markdown に共有する
- 🌙 ダークモード

## 🔧 手動インストール

- [リリース](https://github.com/chathub-dev/chathub/releases)から chathub.zip をダウンロード
- ファイルを解凍
- Chrome/Edge で拡張機能ページに移動します (chrome://extensions または edge://extensions)
- 開発者モードを有効にする
- 解凍したフォルダーをページ上の任意の場所にドラッグしてインポートします (後でフォルダーを削除しないでください)

## 🔨 ソースからのビルド

- ソースコードをクローン
- `yarn install`
- `yarn build`
- _マニュアルインストール_ の手順に従って、`dist` フォルダをブラウザに読み込みます

## 🗺️ ロードマップ

- [x] 会話履歴
- [x] 会話を markdown に共有する
- [x] ダークモード

## 📜 変更ログ

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

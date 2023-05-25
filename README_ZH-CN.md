<p align="center">
    <img src="./src/assets/icon.png" width="150">
</p>

<h1 align="center">ChatHub</h1>

<div align="center">

### ChatHub 是款全能聊天机器人客户端

[![作者][作者-image]][作者-url]
[![许可证][许可证-image]][许可证-url]
[![发布][发布-image]][发布-url]
[![最后提交][最后提交-image]][最后提交-url]

[English](README.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](README_IN.md) &nbsp;&nbsp;|&nbsp;&nbsp; 简体中文 &nbsp;&nbsp;|&nbsp;&nbsp; [繁體中文](README_ZH-TW.md) &nbsp;&nbsp;|&nbsp;&nbsp; [日本語](README_JA.md)

##

### 安装

<a href="https://chrome.google.com/webstore/detail/chathub-all-in-one-chatbo/iaakpnchhognanibcahlpcplchdfmgma?utm_source=website"><img src="https://user-images.githubusercontent.com/64502893/231991498-8df6dd63-727c-41d0-916f-c90c15127de3.png" width="200" alt="获取 Chromium 版 ChatHub"></a>&nbsp;&nbsp;
<a href="https://microsoftedge.microsoft.com/addons/detail/chathub-allinone-chat/kdlmggoacmfoombiokflpeompajfljga"><img src="https://user-images.githubusercontent.com/64502893/231991158-1b54f831-2fdc-43b6-bf9a-f894000e5aa8.png" width="160" alt="获取 Microsoft Edge 版 ChatHub"></a>

##

[截图](#-截图) &nbsp;&nbsp;|&nbsp;&nbsp; [特点](#-特点) &nbsp;&nbsp;|&nbsp;&nbsp; [手动安装](#-手动安装) &nbsp;&nbsp;|&nbsp;&nbsp; [从源代码构建](#-从源代码构建) &nbsp;&nbsp;|&nbsp;&nbsp; [路线图](#%EF%B8%8F-路线图) &nbsp;&nbsp;|&nbsp;&nbsp; [更新日志](#-更新日志)

[作者-image]: https://img.shields.io/badge/author-wong2-blue.svg
[作者-url]: https://github.com/wong2
[许可证-image]: https://img.shields.io/github/license/chathub-dev/chathub?color=blue
[许可证-url]: https://github.com/chathub-dev/chathub/blob/main/LICENSE
[发布-image]: https://img.shields.io/github/v/release/chathub-dev/chathub?color=blue
[发布-url]: https://github.com/chathub-dev/chathub/releases/latest
[最后提交-image]: https://img.shields.io/github/last-commit/chathub-dev/chathub?label=last%20commit
[最后提交-url]: https://github.com/chathub-dev/chathub/commits

</div>

##

## 📷 截图

![截图](screenshots/extension.png?raw=true)

![截图 (暗黑模式)](screenshots/dark.png?raw=true)

## ✨ 特点

- 🤖 在一个应用中使用不同的聊天机器人，目前支持 ChatGPT、新的 Bing Chat、Google Bard、Claude（通过 Poe）、Alpaca、Vicuna、ChatGLM，并将来会集成更多的机器人
- 💬 同时与多个聊天机器人进行对话，方便比较它们的回答
- 🚀 支持 ChatGPT API 和 GPT-4 浏览
- 🔍 快捷方式，可在浏览器的任何位置快速激活应用
- 🎨 支持 Markdown 和代码高亮显示
- 📚 自定义提示和社区提示的提示库
- 💾 本地保存对话历史
- 📥 导出和导入所有数据
- 🔗 将对话转为 Markdown 并分享
- 🌙 暗黑模式

## 🤖 支持的聊天机器人

* ChatGPT（通过 Web 应用/API/Azure/Poe）
* Bing Chat
* Google Bard
* Claude（通过 Poe）
* iFlytek Spark
* ChatGLM
* Alpaca
* Vicuna
* ...

## 🔧 手动安装

- 从 [Releases](https://github.com/chathub-dev/chathub/releases) 下载 chathub.zip
- 解压文件
- 在 Chrome/Edge 中进入扩展页面 (chrome://extensions 或 edge://extensions)
- 启用开发者模式
- 将解压后的文件夹拖到页面上的任何位置进行导入（导入后不要删除文件夹）

## 🔨 从源代码构建

- 克隆源代码
- 运行 `yarn install`
- 运行 `yarn build`
- 按照 _手动安装_ 中的步骤将 `dist` _文件夹加载到浏览器中_

## 📜 更新日志

### v1.19.0

- 快速访问提示

### v1.18.0

- 支持 Alpaca、Vicuna 和 ChatGLM

### v1.17.0

- 支持 GPT-4 浏览模型

### v1.16.5

- 增加 Azure OpenAI 服务支持

### v1.16.0

- 增加自定义主题设置

### v1.15.0

- 增加讯飞 Spark 机器人

### v1.14.0

- 为高级用户在全能模式中支持更多机器人

### v1.12.0

- 增加高级许可证

### v1.11.0

- 支持 Claude (via Poe)

### v1.10.0

- 新增了快捷键 Command + K

### v1.9.4

- 新增了暗黑模式

### v1.9.3

- 支持使用 katex 插件输入数学公式
- 可以将社区提示保存到本地

### v1.9.2

- 可以删除历史消息

### v1.9.0

- 可以将聊天记录分享为 Markdown 或通过 sharegpt.com 分享

### v1.8.0

- 可以导入/导出所有数据
- 可以编辑本地提示
- 可以切换聊天机器人进行比较

### v1.7.0

- 新增了对话历史记录

### v1.6.0

- 增加了对 Google Bard 的支持

### v1.5.4

- 在 ChatGPT API 模式下支持 GPT-4 模型

### v1.5.1

- 增加了国际化设置

### v1.5.0

- 在 ChatGPT Webapp 模式下支持 GPT-4 模型

### v1.4.0

- 新增了 Prompt 库

### v1.3.0

- 增加了复制代码按钮
- 在全合一模式和独立模式之间同步聊天状态
- 允许在生成答案时输入

### v1.2.0

- 支持复制消息文本
- 改进了设置页面表单元素的样式

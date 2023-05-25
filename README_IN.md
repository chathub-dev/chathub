<p align="center">
    <img src="./src/assets/icon.png" width="150">
</p>

<h1 align="center">ChatHub</h1>

<div align="center">

### ChatHub adalah klien chatbot all-in-one

[![author][author-image]][author-url]
[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![last commit][last-commit-image]][last-commit-url]  

[Inggris](README.md) &nbsp;&nbsp;|&nbsp;&nbsp; Indonesia &nbsp;&nbsp;|&nbsp;&nbsp; [简体中文](README_ZH-CN.md) &nbsp;&nbsp;|&nbsp;&nbsp; [繁體中文](README_ZH-TW.md) &nbsp;&nbsp;|&nbsp;&nbsp; [日本語](README_JA.md)

##    
    
### Instal
    
<a href="https://chrome.google.com/webstore/detail/chathub-all-in-one-chatbo/iaakpnchhognanibcahlpcplchdfmgma?utm_source=github"><img src="https://user-images.githubusercontent.com/64502893/231991498-8df6dd63-727c-41d0-916f-c90c15127de3.png" width="200" alt="Dapatkan ChatHub untuk Chromium"></a>
<a href="https://microsoftedge.microsoft.com/addons/detail/chathub-allinone-chat/kdlmggoacmfoombiokflpeompajfljga?utm_source=github"><img src="https://user-images.githubusercontent.com/64502893/231991158-1b54f831-2fdc-43b6-bf9a-f894000e5aa8.png" width="160" alt="Dapatkan ChatHub untuk Microsoft Edge"></a>
    
##

[Tangkapan Layar](#-tangkapan-layar) &nbsp;&nbsp;|&nbsp;&nbsp; [Fitur](#-fitur) &nbsp;&nbsp;|&nbsp;&nbsp; [Bot yang Didukung](#-supported-bots) &nbsp;&nbsp;|&nbsp;&nbsp; [Instalasi Manual](#-instalasi-manual) &nbsp;&nbsp;|&nbsp;&nbsp; [Membangun dari Source](#-membangun-dari-source) &nbsp;&nbsp;|&nbsp;&nbsp; [Changelog](#-changelog)
    
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

## 📷 Tangkapan Layar

![Tangkapan Layar](screenshots/extension.png?raw=true)

![Tangkapan Layar (Mode Gelap)](screenshots/dark.png?raw=true)

## ✨ Fitur

- 🤖 Gunakan chatbot yang berbeda dalam satu aplikasi, saat ini mendukung ChatGPT, Bing Chat yang baru, Claude (melalui Poe), Alpaca, Vicuna, ChatGLM,  dan akan mengintegrasikan lebih banyak di masa depan
- 💬 Chat dengan beberapa chatbot secara bersamaan, sehingga mudah untuk membandingkan jawaban mereka
- 🚀 Mendukung API ChatGPT dan Browsing GPT-4
- 🔍 Pintasan untuk dengan cepat mengaktifkan aplikasi di mana saja di browser
- 🎨 Mendukung penyorotan markdown dan kode
- 📚 Perpustakaan Prompt untuk prompt kustom dan prompt komunitas
- 💾 Riwayat percakapan tersimpan secara lokal
- 📥 Ekspor dan Impor semua data Anda
- 🔗 Bagikan percakapan ke markdown
- 🌙 Mode gelap

## 🤖 Bot yang Didukung

* ChatGPT (melalui Webapp/API/Azure/Poe)
* Bing Chat
* Google Bard
* Claude (melalui Poe)
* iFlytek Spark
* ChatGLM
* Alpaca
* Vicuna
* ...

## 🔧 Instalasi Manual

- Unduh chathub.zip dari [Release](https://github.com/chathub-dev/chathub/releases)
- Ekstrak file
- Di Chrome/Edge, buka halaman ekstensi (chrome://extensions atau edge://extensions)
- Aktifkan Mode Pengembang
- Seret folder yang telah diekstrak ke mana saja di halaman untuk mengimpor (jangan hapus folder setelah itu)

## 🔨 Membangun dari Source

- Clone source code
- `yarn install`
- `yarn build`
- Muat folder `dist` ke browser dengan mengikuti langkah-langkah dalam _Instalasi Manual_

## 📜 Changelog

### v1.19.0

- Akses cepat ke prompt

### v1.18.0

- Mendukung Alpaca, Vicuna, dan ChatGLM

### v1.17.0

- Mendukung model Browsing GPT-4

### v1.16.5

- Menambahkan dukungan layanan Azure OpenAI

### v1.16.0

- Menambahkan pengaturan tema kustom

### v1.15.0

- Menambahkan bot Xunfei Spark

### v1.14.0

- Mendukung lebih banyak bot dalam mode all-in-one untuk pengguna premium

### v1.12.0

- Menambahkan lisensi premium

### v1.11.0

- Dukungan Claude (melalui Poe)

### v1.10.0

- Command + K

### v1.9.4

- Mode gelap

### v1.9.3

- Dukungan rumus matematika dengan katex
- Simpan prompt komunitas ke lokal

### v1.9.2

- Hapus riwayat pesan

### v1.9.0

- Bagikan percakapan sebagai markdown atau melalui sharegpt.com

### v1.8.0

- Impor/Ekspor semua data
- Edit prompt lokal
- Mengalihkan chatbot untuk dibandingkan

### v1.7.0

- Menambahkan riwayat percakapan

### v1.6.0

- Menambahkan dukungan untuk Google Bard

### v1.5.4

- Dukungan model GPT-4 dalam mode api ChatGPT

### v1.5.1

- Menambahkan pengaturan i18n

### v1.5.0

- Dukungan model GPT-4 dalam mode Webapp ChatGPT

### v1.4.0

- Menambahkan Prompt Library

### v1.3.0

- Menambahkan tombol salin kode
- Sinkronisasi status chat antara all-in-one dan mode mandiri
- Memungkinkan input sambil menghasilkan jawaban

### v1.2.0

- Dukungan untuk menyalin teks pesan
- Perbaiki gaya elemen formulir halaman pengaturan

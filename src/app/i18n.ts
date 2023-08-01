import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  'zh-CN': {
    translation: {
      'Shortcut to open this app': '打开ChatHub的快捷键',
      Settings: '设置',
      'Startup page': '启动页面',
      'Chat style': '会话风格',
      'Change shortcut': '修改快捷键',
      Save: '保存',
      Saved: '已保存',
      Export: '导出',
      Import: '导入',
      'Export/Import All Data': '导出/导入数据',
      'Data includes all your settings, chat histories, and local prompts': '数据包括所有设置、聊天记录和本地prompts',
      Edit: '编辑',
      Use: '使用',
      Send: '发送',
      Stop: '停止',
      Title: '标题',
      Content: '内容',
      Search: '搜索',
      Model: '模型',
      Cancel: '取消',
      'Presale discount': '预售折扣',
      'More bots in All-In-One mode': '在All-In-One模式下使用更多chatbot（三合一、四合一）',
      'Chat history full-text search': '全文搜索聊天记录',
      'Customize theme': '自定义主题',
      'More features in the future': '享受未来所有功能更新',
      'Support the development of ChatHub': '支持ChatHub的开发',
      'Enjoy ChatHub? Give us a 5-star rating!': '喜欢ChatHub吗？给我们个5星好评吧！',
      'Write review': '去评价',
      'Activate license': '激活License',
      '🎉 License activated': '🎉 License已激活',
      'All-In-One Mode': 'All-In-One模式',
      'Two in one': '二合一',
      'Three in one': '三合一',
      'Four in one': '四合一',
      'Activate up to 5 devices': '最多可激活5台设备',
      Deactivate: '反激活',
      'Get premium license': '购买会员',
      'Theme Settings': '主题设置',
      'Theme Mode': '主题模式',
      'Theme Color': '主题色',
      'Follow Arc browser theme': '跟随Arc浏览器主题色',
      'iFlytek Spark': '讯飞星火',
      'You need to login to Poe first': '需要先登录Poe账号',
      'Login at bing.com': '去 bing.com 登录',
      'Login at poe.com': '去 poe.com 登录',
      'Login at xfyun.cn': '登录讯飞账号',
      'Lifetime license': '终身授权',
      'Join the waitlist': '加入waitlist',
      'GPT-4 models require ChatGPT Plus': 'ChatGPT Plus账号可使用',
      'Model used by ChatGPT iOS app, potentially faster': 'ChatGPT iOS app使用的模型，可能更快',
      'Poe subscribers only': 'Poe订阅会员可用',
      'Quick access in Chrome side bar': '在Chrome侧边栏快速访问',
      'You have opened ChatHub {{openTimes}} times, consider unlock all features?':
        '哇！你已经打开ChatHub {{openTimes}}次了，是否要解锁全部功能呢？🥺',
      'Open Prompt Library': '管理提示词',
      'Use / to select prompts, Shift+Enter to add new line': '使用 / 选择提示词，Shift+Enter添加换行',
      'Your Prompts': '你的提示词',
      'Community Prompts': '提示词社区',
      'Create new prompt': '创建提示词',
      'Earlybird price': '早鸟价格',
      'Share conversation': '分享会话',
      'Clear conversation': '清空会话',
      'View history': '查看历史消息',
      'Premium Feature': '会员功能',
      'Upgrade to unlock': '升级解锁',
      'Please check your network connection': '请检查您的网络连接，中国用户可能需要科学上网',
      'Display size': '显示大小',
      'You’ve reached the daily free message limit for this model': '你已经达到了该模型今日免费消息上限',
      'This is a limitation set by poe.com': '这是poe.com的限制',
      Feedback: '反馈',
      Theme: '主题',
      Premium: '付费会员',
      Chatbots: '聊天机器人',
      'Manage order and devices': '管理订单与设备',
      'Upgrade to premium to chat with more than two bots or send images': '升级会员，同时和两个以上的机器人聊天',
      Upgrade: '升级',
      'This usually mean you need to add a payment method to your OpenAI account, checkout: ':
        '这通常意味着您需要在OpenAI账户中添加付款方式，请查看：',
      'Are you sure you want to clear history messages?': '确定要清空历史消息吗？',
      'Clear history messages': '清空消息',
      'Compare with image input': '用图片作为输入',
      'Web Access': '联网搜索',
      'Upgrade to Premium for web access and more features': '升级会员，解锁联网搜索和更多功能',
    },
  },
  de: {
    translation: {
      'Shortcut to open this app': 'Tastenkürzel zum Öffnen dieser App',
      Settings: 'Einstellungen',
      'Startup page': 'Startseite',
      'Conversation style': 'Konversationsstil',
      'Change shortcut': 'Tastenkürzel ändern',
      Save: 'Speichern',
      Export: 'Exportieren',
      Import: 'Importieren',
      'Export/Import All Data': 'Alle Daten exportieren/importieren',
      'Data includes all your settings, chat histories, and local prompts':
        'Daten beinhalten alle Einstellungen, Chatverläufe und lokale Prompts',
    },
  },
  es: {
    translation: {
      'Shortcut to open this app': 'Acceso directo para abrir esta aplicación',
      Settings: 'Configuración',
      'Startup page': 'Página de inicio',
      'Chat style': 'Estilo de chat',
      'Change shortcut': 'Cambiar acceso directo',
      Save: 'Guardar',
      Saved: 'Guardado',
      Export: 'Exportar',
      Import: 'Importar',
      'Export/Import All Data': 'Exportar/Importar todos los datos',
      'Data includes all your settings, chat histories, and local prompts':
        'Los datos incluyen todas las configuraciones, historiales de chat y promts locales',
      Edit: 'Editar',
      Use: 'Usar',
      Send: 'Enviar',
      Stop: 'Detener',
      Title: 'Título',
      Content: 'Contenido',
      Search: 'Buscar',
      Model: 'Modelo',
      Cancel: 'Cancelar',
      'Presale discount': 'Descuento de preventa',
      'More bots in All-In-One mode': 'Más bots en modo Todo en Uno (tres en uno, cuatro en uno)',
      'Chat history full-text search': 'Búsqueda de texto completo en el historial de chat',
      'Customize theme': 'Personalizar tema',
      'More features in the future': 'Más características en el futuro',
      'Support the development of ChatHub': 'Apoyar el desarrollo de ChatHub',
      'Enjoy ChatHub? Give us a 5-star rating!': '¿Disfrutas de ChatHub? ¡Danos una calificación de 5 estrellas!',
      'Write review': 'Escribir reseña',
      'Activate license': 'Activar licencia',
      '🎉 License activated': '🎉 Licencia activada',
      'All-In-One Mode': 'Modo Todo en Uno',
      'Two in one': 'Dos en uno',
      'Three in one': 'Tres en uno',
      'Four in one': 'Cuatro en uno',
      'Activate up to 5 devices': 'Activar hasta 5 dispositivos',
      Deactivate: 'Desactivar',
      'Get premium license': 'Obtener licencia premium',
      'Theme Settings': 'Configuración de tema',
      'Theme Mode': 'Modo de tema',
      'Theme Color': 'Color de tema',
      'Follow Arc browser theme': 'Seguir el tema del navegador Arc',
      'iFlytek Spark': 'iFlytek Spark',
      'You need to login to Poe first': 'Necesitas iniciar sesión en Poe primero',
      'Login at bing.com': 'Iniciar sesión en bing.com',
      'Login at poe.com': 'Iniciar sesión en poe.com',
      'Login at xfyun.cn': 'Iniciar sesión en xfyun.cn',
      'Lifetime license': 'Licencia de por vida',
      'Join the waitlist': 'Unirse a la lista de espera',
      'GPT-4 models require ChatGPT Plus': 'Los modelos GPT-4 requieren ChatGPT Plus',
      'Model used by ChatGPT iOS app, potentially faster':
        'Modelo utilizado por la aplicación ChatGPT iOS, potencialmente más rápido',
      'Poe subscribers only': 'Solo para suscriptores de Poe',
      'Quick access in Chrome side bar': 'Acceso rápido en la barra lateral de Chrome',
      'You have opened ChatHub {{openTimes}} times, consider unlock all features?':
        '¡Has abierto ChatHub {{openTimes}} veces, considera desbloquear todas las funciones! 🥺',
      'Open Prompt Library': 'Abrir biblioteca de promts',
      'Use / to select prompts, Shift+Enter to add new line':
        'Usa / para seleccionar promts, Shift+Enter para agregar nueva línea',
      'Your Prompts': 'Tus promts',
      'Community Prompts': 'Promts de la comunidad',
      'Create new prompt': 'Crear nuevo prompt',
      'Earlybird price': 'Precio de Earlybird',
      'Share conversation': 'Compartir conversación',
      'Clear conversation': 'Borrar conversación',
      'View history': 'Ver historial',
      'Premium Feature': 'Función premium',
      'Upgrade to unlock': 'Actualizar para desbloquear',
      'Please check your network connection':
        'Por favor, comprueba tu conexión de red, los usuarios de China pueden necesitar una conexión a Internet segura',
      'Display size': 'Tamaño de pantalla',
      'You’ve reached the daily free message limit for this model':
        'Has alcanzado el límite diario de mensajes gratuitos para este modelo',
      'This is a limitation set by poe.com': 'Esta es una limitación establecida por poe.com',
      Feedback: 'Comentarios',
      Theme: 'Tema',
      Premium: 'Premium',
      Chatbots: 'Chatbots',
      'Manage order and devices': 'Gestionar pedidos y dispositivos',
      'Upgrade to premium to chat with more than two bots or send images':
        'Actualiza a premium para chatear con más de dos bots a la vez',
      Upgrade: 'Actualizar',
      'This usually mean you need to add a payment method to your OpenAI account, checkout: ':
        'Esto generalmente significa que necesitas agregar un método de pago a tu cuenta de OpenAI, revisa:',
      'Web Access': 'el acceso a la web',
      'Upgrade to Premium for web access and more features': 'Actualiza a Premium para acceso a la web y más funciones',
    },
  },
  fr: {
    translation: {
      'Shortcut to open this app': 'Raccourci pour ouvrir cette application',
      Settings: 'Paramètres',
      'Startup page': 'Page de démarrage',
      'Conversation style': 'Style de conversation',
      'Change shortcut': 'Modifier le raccourci',
      Save: 'Enregistrer',
      Export: 'Exporter',
      Import: 'Importer',
      'Export/Import All Data': 'Exporter/Importer toutes les données',
      'Data includes all your settings, chat histories, and local prompts':
        'Les données incluent tous vos paramètres, historiques de chat et invitations locales',
    },
  },
  in: {
    translation: {
      'Shortcut to open this app': 'Pintasan untuk membuka aplikasi ini',
      Settings: 'Pengaturan',
      'Startup page': 'Halaman awal',
      'Chat style': 'Gaya percakapan',
      'Change shortcut': 'Ubah pintasan',
      Save: 'Simpan',
      Saved: 'Tersimpan',
      Export: 'Ekspor',
      Import: 'Impor',
      'Export/Import All Data': 'Ekspor/Impor Semua Data',
      'Data includes all your settings, chat histories, and local prompts':
        'Data mencakup semua pengaturan, riwayat percakapan, dan prompt lokal Anda',
      Edit: 'Edit',
      Use: 'Gunakan',
      Send: 'Kirim',
      Stop: 'Berhenti',
      Title: 'Judul',
      Content: 'Konten',
      Search: 'Cari',
      Model: 'Model',
      'Presale discount': 'Diskon pra-penjualan',
      'More bots in All-In-One mode': 'Lebih banyak bot dalam mode All-In-One',
      'Chat history full-text search': 'Pencarian teks penuh riwayat percakapan',
      'Customize theme': 'Kustomisasi tema',
      'More features in the future': 'Lebih banyak fitur di masa depan',
      'Support the development of ChatHub': 'Dukung pengembangan ChatHub',
      'Enjoy ChatHub? Give us a 5-star rating!': 'Menikmati ChatHub? Beri kami rating 5 bintang!',
      'Write review': 'Tulis ulasan',
      'Activate license': 'Aktifkan lisensi',
      '🎉 License activated': '🎉 Lisensi diaktifkan',
      'All-In-One Mode': 'Mode All-In-One',
      'Two in one': 'Dua dalam satu',
      'Three in one': 'Tiga dalam satu',
      'Four in one': 'Empat dalam satu',
      'Activate up to 5 devices': 'Aktifkan hingga 5 perangkat',
      Deactivate: 'Nonaktifkan',
      'Get premium license': 'Dapatkan lisensi premium',
      'Theme Settings': 'Pengaturan tema',
      'Theme Mode': 'Mode tema',
      'Theme Color': 'Warna tema',
      'Follow Arc browser theme': 'Ikuti tema browser Arc',
      'iFlytek Spark': 'iFlytek Spark',
      'You need to login to Poe first': 'Anda perlu login ke Poe terlebih dahulu',
      'Login at bing.com': 'Login di bing.com',
      'Login at poe.com': 'Login di poe.com',
      'Login at xfyun.cn': 'Login di xfyun.cn',
      'Lifetime license': 'Lisensi seumur hidup',
      'Join the waitlist': 'Gabung dalam daftar tunggu',
      'GPT-4 models require ChatGPT Plus': 'Model GPT-4 membutuhkan ChatGPT Plus',
      'Model used by ChatGPT iOS app, potentially faster':
        'Model yang digunakan oleh aplikasi ChatGPT iOS, mungkin lebih cepat',
      'Poe subscribers only': 'Hanya pelanggan Poe',
      'Quick access in Chrome side bar': 'Akses cepat di sisi bilah Chrome',
      'You have opened ChatHub {{openTimes}} times, consider unlock all features?':
        'Wow! Anda telah membuka ChatHub sebanyak {{openTimes}} kali, pertimbangkan untuk membuka semua fitur?',
      'Open Prompt Library': 'Buka Perpustakaan Prompt',
      'Use / to select prompts, Shift+Enter to add new line':
        'Gunakan / untuk memilih prompt, Shift+Enter untuk menambahkan baris baru',
      'Your Prompts': 'Prompt Anda',
      'Community Prompts': 'Prompt Komunitas',
      'Create new prompt': 'Buat prompt baru',
    },
  },
  ja: {
    translation: {
      'Shortcut to open this app': 'このアプリを開くショートカット',
      Settings: '設定',
      'Startup page': 'スタートアップページ',
      'Chat style': 'チャットスタイル',
      'Change shortcut': 'ショートカットを変更する',
      Save: '保存',
      Saved: '保存されました',
      Export: 'エクスポート',
      Import: 'インポート',
      'Export/Import All Data': 'すべてのデータをエクスポート/インポート',
      'Data includes all your settings, chat histories, and local prompts':
        'データはすべての設定、チャット履歴、およびローカルのプロンプトを含みます',
      Edit: '編集',
      Use: '使用',
      Send: '送信',
      Stop: '停止',
      Title: 'タイトル',
      Content: 'コンテンツ',
      Search: '検索',
      Model: 'モデル',
      Cancel: 'キャンセル',
      'Presale discount': 'プレセール割引',
      'More bots in All-In-One mode': 'オールインワンモードでより多くのボットを使用する',
      'Chat history full-text search': 'チャット履歴の全文検索',
      'Customize theme': 'テーマをカスタマイズ',
      'More features in the future': '将来のさらなる機能',
      'Support the development of ChatHub': 'ChatHubの開発をサポート',
      'Enjoy ChatHub? Give us a 5-star rating!': 'ChatHubを楽しんでいますか？5つ星の評価をお願いします！',
      'Write review': 'レビューを書く',
      'Activate license': 'ライセンスを有効にする',
      '🎉 License activated': '🎉 ライセンスが有効化されました',
      'All-In-One Mode': 'オールインワンモード',
      'Two in one': '二つ一体',
      'Three in one': '三つ一体',
      'Four in one': '四つ一体',
      'Activate up to 5 devices': '最大5台のデバイスを有効化する',
      Deactivate: '無効にする',
      'Get premium license': 'プレミアムライセンスを取得する',
      'Theme Settings': 'テーマ設定',
      'Theme Mode': 'テーマモード',
      'Theme Color': 'テーマカラー',
      'Follow Arc browser theme': 'Arcブラウザのテーマに従う',
      'iFlytek Spark': '科大訳飛スパーク',
      'You need to login to Poe first': '先にPoeにログインする必要があります',
      'Login at bing.com': 'bing.comでログイン',
      'Login at poe.com': 'poe.comでログイン',
      'Login at xfyun.cn': 'xfyun.cnでログインする',
      'Lifetime license': 'ライフタイムライセンス',
      'Join the waitlist': 'ウェイトリストに参加する',
      'GPT-4 models require ChatGPT Plus': 'GPT-4モデルはChatGPT Plusが必要',
      'Model used by ChatGPT iOS app, potentially faster': 'ChatGPT iOSアプリで使用されるモデル、おそらく速い',
      'Poe subscribers only': 'Poeの加入者のみ',
      'Quick access in Chrome side bar': 'Chromeサイドバーからのクイックアクセス',
      'You have opened ChatHub {{openTimes}} times, consider unlock all features?':
        'ChatHubを{{openTimes}}回開きました。全機能を解放しますか？',
      'Open Prompt Library': 'プロンプトライブラリを開く',
      'Use / to select prompts, Shift+Enter to add new line':
        '/ を使用してプロンプトを選択し、Shift+Enterで新しい行を追加します',
      'Your Prompts': 'あなたのプロンプト',
      'Community Prompts': 'コミュニティのプロンプト',
      'Create new prompt': '新しいプロンプトを作成する',
      'Earlybird price': '早期割引価格',
      'Share conversation': '会話を共有する',
      'Clear conversation': '会話をクリアする',
      'View history': '履歴を表示する',
      'Premium Feature': 'プレミアム機能',
      'Upgrade to unlock': 'アンロックするためのアップグレード',
      'Please check your network connection': 'ネットワーク接続をご確認ください',
      'Display size': '表示サイズ',
      'You’ve reached the daily free message limit for this model':
        'このモデルの1日あたりの無料メッセージ上限に達しました',
      'This is a limitation set by poe.com': 'これはpoe.comによって設定された制限です',
      Feedback: 'フィードバック',
      Theme: 'テーマ',
      Premium: 'プレミアム',
      Chatbots: 'チャットボット',
      'Manage order and devices': '注文とデバイスの管理',
      'Upgrade to premium to chat with more than two bots or send images':
        '一度に2つ以上のボットとチャットするためにプレミアムにアップグレードする',
      Upgrade: 'アップグレード',
      'This usually mean you need to add a payment method to your OpenAI account, checkout:':
        'これは通常、OpenAIアカウントに支払い方法を追加する必要があることを意味します。チェックアウト：',
      'Upgrade to Premium for web access and more features':
        'ウェブアクセスとさらなる機能のためにプレミアムにアップグレード',
    },
  },
  th: {
    translation: {
      'Shortcut to open this app': 'ทางลัดเพื่อเปิดแอปนี้',
      Settings: 'การตั้งค่า',
      'Startup page': 'หน้าเริ่มต้น',
      'Conversation style': 'สไตล์การสนทนา',
      'Change shortcut': 'เปลี่ยนทางลัด',
      Save: 'บันทึก',
      Export: 'ส่งออก',
      Import: 'นำเข้า',
      'Export/Import All Data': 'ส่งออก/นำเข้าข้อมูลทั้งหมด',
      'Data includes all your settings, chat histories, and local prompts':
        'ข้อมูลรวมถึงการตั้งค่าทั้งหมดของคุณ ประวัติการแชท และข้อความเตือนในเครื่อง',
    },
  },
  'zh-TW': {
    translation: {
      'Shortcut to open this app': '開啟此應用程式的快捷鍵',
      Settings: '設定',
      'Startup page': '啟動頁面',
      'Conversation style': '對話風格',
      'Change shortcut': '變更快捷鍵',
      Save: '儲存',
      Export: '匯出',
      Import: '匯入',
      'Export/Import All Data': '匯出/匯入所有資料',
      'Data includes all your settings, chat histories, and local prompts': '資料包含所有設定、聊天紀錄和本地prompts',
    },
  },
  pt: {
    translation: {
      'Shortcut to open this app': 'Atalho para abrir este aplicativo',
      Settings: 'Configurações',
      'Startup page': 'Página de inicialização',
      'Chat style': 'Estilo de bate-papo',
      'Change shortcut': 'Mudar atalho',
      Save: 'Salvar',
      Saved: 'Salvo',
      Export: 'Exportar',
      Import: 'Importar',
      'Export/Import All Data': 'Exportar/Importar todos os dados',
      'Data includes all your settings, chat histories, and local prompts':
        'Os dados incluem todas as suas configurações, históricos de bate-papo e prompts locais',
      Edit: 'Editar',
      Use: 'Usar',
      Send: 'Enviar',
      Stop: 'Parar',
      Title: 'Título',
      Content: 'Conteúdo',
      Search: 'Procurar',
      Model: 'Modelo',
      Cancel: 'Cancelar',
      'Presale discount': 'Desconto na pré-venda',
      'More bots in All-In-One mode': 'Mais bots no modo All-In-One',
      'Chat history full-text search': 'Pesquisa de texto completo no histórico de bate-papo',
      'Customize theme': 'Personalizar tema',
      'More features in the future': 'Mais recursos no futuro',
      'Support the development of ChatHub': 'Apoie o desenvolvimento do ChatHub',
      'Enjoy ChatHub? Give us a 5-star rating!': 'Gosta do ChatHub? Dê-nos uma classificação de 5 estrelas!',
      'Write review': 'Escrever avaliação',
      'Activate license': 'Ativar licença',
      '🎉 License activated': '🎉 Licença ativada',
      'All-In-One Mode': 'Modo All-In-One',
      'Two in one': 'Dois em um',
      'Three in one': 'Três em um',
      'Four in one': 'Quatro em um',
      'Activate up to 5 devices': 'Ative até 5 dispositivos',
      Deactivate: 'Desativar',
      'Get premium license': 'Obtenha licença premium',
      'Theme Settings': 'Configurações de Tema',
      'Theme Mode': 'Modo de Tema',
      'Theme Color': 'Cor do Tema',
      'Follow Arc browser theme': 'Siga o tema do navegador Arc',
      'iFlytek Spark': 'iFlytek Spark',
      'You need to login to Poe first': 'Você precisa fazer login no Poe primeiro',
      'Login at bing.com': 'Login em bing.com',
      'Login at poe.com': 'Login em poe.com',
      'Login at xfyun.cn': 'Login em xfyun.cn',
      'Lifetime license': 'Licença vitalícia',
      'Join the waitlist': 'Junte-se à lista de espera',
      'GPT-4 models require ChatGPT Plus': 'Modelos GPT-4 requerem ChatGPT Plus',
      'Model used by ChatGPT iOS app, potentially faster':
        'Modelo usado pelo aplicativo ChatGPT iOS, potencialmente mais rápido',
      'Poe subscribers only': 'Apenas para assinantes do Poe',
      'Quick access in Chrome side bar': 'Acesso rápido na barra lateral do Chrome',
      'You have opened ChatHub {{openTimes}} times, consider unlock all features?':
        'Você abriu o ChatHub {{openTimes}} vezes, considera desbloquear todos os recursos?',
      'Open Prompt Library': 'Abrir biblioteca de prompts',
      'Use / to select prompts, Shift+Enter to add new line':
        'Use / para selecionar prompts, Shift+Enter para adicionar uma nova linha',
      'Your Prompts': 'Seus Prompts',
      'Community Prompts': 'Prompts da Comunidade',
      'Create new prompt': 'Criar novo prompt',
      'Earlybird price': 'Preço de earlybird',
      'Share conversation': 'Compartilhar conversa',
      'Clear conversation': 'Limpar conversa',
      'View history': 'Ver histórico',
      'Premium Feature': 'Recurso Premium',
      'Upgrade to unlock': 'Atualize para desbloquear',
      'Please check your network connection': 'Por favor, verifique sua conexão de rede',
      'Display size': 'Tamanho de exibição',
      'You’ve reached the daily free message limit for this model':
        'Você atingiu o limite diário de mensagens gratuitas para este modelo',
      'This is a limitation set by poe.com': 'Esta é uma limitação definida por poe.com',
      Feedback: 'Feedback',
      Theme: 'Tema',
      Premium: 'Premium',
      Chatbots: 'Chatbots',
      'Manage order and devices': 'Gerenciar pedidos e dispositivos',
      'Upgrade to premium to chat with more than two bots or send images':
        'Atualize para o premium para conversar com mais de dois bots de uma vez',
      Upgrade: 'Atualizar',
      'This usually mean you need to add a payment method to your OpenAI account, checkout: ':
        'Isso geralmente significa que você precisa adicionar um método de pagamento à sua conta OpenAI, checkout:',
      'Upgrade to Premium for web access and more features':
        'Faça upgrade para Premium para acesso à web e mais recursos',
    },
  },
}

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n

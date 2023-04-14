import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      'Shortcut to open this app': 'Shortcut to open this app',
      Settings: 'Settings',
      'Startup page': 'Startup page',
      'Conversation style': 'Conversation style',
      'Change shortcut': 'Change shortcut',
      Save: 'Save',
      Saved: 'Saved',
      Export: 'Export',
      Import: 'Import',
      'Export/Import All Data': 'Export/Import All Data',
      'Data includes all your settings, chat histories, and local prompts':
        'Data includes all your settings, chat histories, and local prompts',
      Edit: 'Edit',
      Use: 'Use',
      Send: 'Send',
      Stop: 'Stop',
      Title: 'Title',
      Cotnent: 'Content',
      PromptRoleWarning: 'Only available for ChatGPT using API',
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
      'Conversation style': 'Estilo de conversación',
      'Change shortcut': 'Cambiar acceso directo',
      Save: 'Guardar',
      Export: 'Exportar',
      Import: 'Importar',
      'Export/Import All Data': 'Exportar/Importar todos los datos',
      'Data includes all your settings, chat histories, and local prompts':
        'Los datos incluyen todas tus configuraciones, historiales de chat y promociones locales',
      PromptRoleWarning: 'Solo disponible para ChatGPT usando API',
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
      'Shortcut to open this app': 'Jalur Pintas untuk membuka aplikasi ini',
      Settings: 'Pengaturan',
      'Startup page': 'Halaman Awal',
      'Conversation style': 'Gaya Percakapan',
      'Change shortcut': 'Ubah Jalur Pintas',
      Save: 'Simpan',
      Saved: 'Tersimpan',
      Export: 'Ekspor',
      Import: 'Impor',
      'Export/Import All Data': 'Ekspor/Impor Seluruh Data',
      'Data includes all your settings, chat histories, and local prompts':
        'Data mencakup semua pengaturan, riwayat percakapan, dan prompt lokal Anda',
      Edit: 'Edit',
      Use: 'Gunakan',
      Send: 'Kirim',
      Stop: 'Berhenti',
      Title: 'Judul',
      Content: 'Isi',
    },
  },
  ja: {
    translation: {
      'Shortcut to open this app': 'このアプリを開くためのショートカット',
      Settings: '設定',
      'Startup page': 'スタートアップページ',
      'Conversation style': '会話スタイル',
      'Change shortcut': 'ショートカットを変更',
      Save: '保存',
      Export: 'エクスポート',
      Import: 'インポート',
      'Export/Import All Data': 'すべてのデータをエクスポート/インポート',
      'Data includes all your settings, chat histories, and local prompts':
        'データには、すべての設定、チャット履歴、ローカルプロンプトが含まれます',
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
  zh: {
    translation: {
      'Shortcut to open this app': '打开ChatHub的快捷键',
      Settings: '设置',
      'Startup page': '启动页面',
      'Conversation style': '会话风格',
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
      'Presale discount': '预售折扣',
      'Cloud syncing data': '数据云同步',
      'More bots in All-In-One mode': '在All-In-One模式下使用更多chatbot',
      'Chat history full-text search': '全文搜索聊天记录',
      'Customize theme': '自定义主题',
      'More in the future': '享受未来所有功能更新',
      'Enjoy ChatHub? Give us a 5-star rating!': '喜欢ChatHub吗？给我们个5星好评吧！',
      'Write review': '去评价',
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

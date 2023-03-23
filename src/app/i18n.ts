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
      Export: 'Export',
      Import: 'Import',
      'Export/Import All Data': 'Export/Import All Data',
      'Data includes all your settings, chat histories, and local prompts':
        'Data includes all your settings, chat histories, and local prompts',
    },
  },
  de: {
    translation: {
      'Shortcut to open this app': 'Verknüpfung zum Öffnen dieser App',
      Settings: 'Einstellungen',
      'Startup page': 'Startseite',
      'Conversation style': 'Konversationsstil',
      'Change shortcut': 'Verknüpfung ändern',
      Save: 'Speichern',
    },
  },
  es: {
    translation: {
      'Shortcut to open this app': 'Acceso directo para abrir esta aplicación',
      Settings: 'Ajustes',
      'Startup page': 'Página de inicio',
      'Conversation style': 'Estilo de conversación',
      'Change shortcut': 'Cambiar acceso directo',
      Save: 'Guardar',
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
    },
  },
  ja: {
    translation: {
      'Shortcut to open this app': 'このアプリを開くためのショートカット',
      Settings: '設定',
      'Startup page': 'スタートアップページ',
      'Conversation style': '会話スタイル',
      'Change shortcut': 'ショートカットの変更',
      Save: '保存',
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
      Export: '导出',
      Import: '导入',
      'Export/Import All Data': '导出/导入数据',
      'Data includes all your settings, chat histories, and local prompts': '数据包括所有设置、聊天记录和本地prompts',
    },
  },
  'zh-TW': {
    translation: {
      'Shortcut to open this app': '開啟此應用程式的快捷鍵',
      Settings: '設定',
      'Startup page': '啟動頁面',
      'Conversation style': '對話風格',
      'Change shortcut': '更改快捷鍵',
      Save: '儲存',
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

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

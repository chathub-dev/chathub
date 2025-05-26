import i18n, { Resource } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next, Translation } from 'react-i18next'
import { getLanguage } from '~services/storage/language'
import japanese from './locales/japanese.json'
import simplifiedChinese from './locales/simplified-chinese.json'
import traditionalChinese from './locales/traditional-chinese.json'
import english from './locales/english.json'

const resources: Resource = {
  'zh-CN': { translation: simplifiedChinese },
  'zh-TW': { translation: traditionalChinese },
  ja: { translation: japanese },
  en: { translation: english}
}

export const languageCodes = Object.keys(resources)

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    lng: getLanguage(),
    fallbackLng: 'zh-CN',
    resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['navigator'],
      caches: [],
    },
  })

export default i18n

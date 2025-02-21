import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface SettingPageSideMenuProps {
  activeSection: string
  onSectionClick: (section: string) => void
}

const SettingPageSideMenu: FC<SettingPageSideMenuProps> = ({ activeSection, onSectionClick }) => {
  const { t } = useTranslation()
  
  const sections = [
    { id: 'startup', title: t('Startup page') },
    { id: 'chatbots', title: t('Select Chatbots') },
    { id: 'configurations', title: t('Chatbots configuration'), 
      subsections: [
        { id: 'chatgpt', title: 'ChatGPT' },
        { id: 'claude', title: 'Claude' },
        { id: 'gemini', title: 'Gemini' },
        { id: 'bing', title: 'Bing' },
        { id: 'perplexity', title: 'Perplexity' },
        { id: 'custom', title: 'Custom API' },
      ]
    },
    { id: 'shortcuts', title: t('Shortcuts') },
    { id: 'export', title: t('Export/Import Data') },
  ]

  return (
    <div className="w-64 fixed left-0 top-0 h-full bg-gray-50 p-4 overflow-y-auto">
      <nav>
        {sections.map((section) => (
          <div key={section.id} className="mb-4">
            <div
              className={`cursor-pointer p-2 rounded ${
                activeSection === section.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => onSectionClick(section.id)}
            >
              {section.title}
            </div>
            {section.subsections && (
              <div className="ml-4 mt-2">
                {section.subsections.map((subsection) => (
                  <div
                    key={subsection.id}
                    className={`cursor-pointer p-2 rounded ${
                      activeSection === subsection.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => onSectionClick(subsection.id)}
                  >
                    {subsection.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}

export default SettingPageSideMenu

import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest(async () => {
  return {
    manifest_version: 3,
    name: '__MSG_appName__',
    description: '__MSG_appDesc__',
    default_locale: 'en',
    version: '1.42.3',
    icons: {
      '16': 'src/assets/icon.png',
      '32': 'src/assets/icon.png',
      '48': 'src/assets/icon.png',
      '128': 'src/assets/icon.png',
    },
    background: {
      service_worker: 'src/background/index.ts',
      type: 'module',
    },
    action: {},
    host_permissions: [
      'https://*.bing.com/',
      'https://*.openai.com/',
      'https://bard.google.com/',
      'https://*.chathub.gg/',
      'https://*.duckduckgo.com/',
      'https://*.poe.com/',
      'https://*.anthropic.com/',
      'https://*.claude.ai/',
    ],
    optional_host_permissions: ['https://*/*', 'wss://*/*'],
    permissions: ['storage', 'unlimitedStorage', 'sidePanel', 'declarativeNetRequestWithHostAccess'],
    content_scripts: [
      {
        matches: ['https://chat.openai.com/*'],
        js: ['src/content-script/chatgpt-inpage-proxy.ts'],
      },
    ],
    commands: {
      'open-app': {
        suggested_key: {
          default: 'Alt+J',
          windows: 'Alt+J',
          linux: 'Alt+J',
          mac: 'Command+J',
        },
        description: 'Open ChatHub app',
      },
    },
    side_panel: {
      default_path: 'sidepanel.html',
    },
    declarative_net_request: {
      rule_resources: [
        {
          id: 'ruleset_bing',
          enabled: true,
          path: 'src/rules/bing.json',
        },
        {
          id: 'ruleset_ddg',
          enabled: true,
          path: 'src/rules/ddg.json',
        },
        {
          id: 'ruleset_qianwen',
          enabled: true,
          path: 'src/rules/qianwen.json',
        },
        {
          id: 'ruleset_baichuan',
          enabled: true,
          path: 'src/rules/baichuan.json',
        },
        {
          id: 'ruleset_pplx',
          enabled: true,
          path: 'src/rules/pplx.json',
        },
      ],
    },
  }
})

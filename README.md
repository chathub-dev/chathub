<p align="center">
    <img src="./src/assets/icon.png" width="150">
</p>

<h1 align="center">ChatHub OSS</h1>



## Install

To be updated (You can build by youself for now)

## 📷 Screenshot

![Screenshot](screenshots/extension.png?raw=true)

## 🤝 Sponsors

<div style="background-color:#e8f5e9; padding:10px; border-left:5px solid #4caf50; border-radius:5px;"> <!-- 緑とアイコンで強調 -->
<h2><b>Important Remarks</b> <span style="color:#4caf50;">&#9888;</span></h2>

<p>この拡張機能は、現在はAPIのみをサポートします。<br>
Webapp機能のサポートはロードマップに存在ありません。</p>
</div>

## ✨ Features

- 🤖 Use different chatbots in one app, currently supporting ChatGPT, new Bing Chat, Google Bard, Claude, and open-source models including LLama2, Vicuna, ChatGLM etc
- 💬 Chat with multiple chatbots at the same time, making it easy to compare their answers
- 🚀 Support ChatGPT API and GPT-4 Browsing
- 🔍 Shortcut to quickly activate the app anywhere in the browser
- 🎨 Markdown and code highlight support
- 📚 Prompt Library for custom prompts and community prompts
- 💾 Conversation history saved locally
- 📥 Export and Import all your data
- 🔗 Share conversation to markdown
- 🌙 Dark mode
- 🌐 Web access

## 🤖 Supported Bots

- ChatGPT
- Google Bard
- Claude 3.5



## 🔨 Build from Source

- Clone the source code
- `corepack enable`
- `yarn install`
- `yarn build`
- In Chrome/Edge go to the Extensions page (chrome://extensions or edge://extensions)
- Enable Developer Mode
- Drag the `dist` folder anywhere on the page to import it (do not delete the folder afterward)

## Privacy Policy 


以下はChrome Web Storeのプライバシーポリシーです。

Chrome for Developers

English Sign in Chrome Extensions

Chrome for Developers Home Docs Chrome Extensions Chrome Web Store Was this helpful?

Troubleshooting Chrome Web Store violations

bookmark_border

This page is provided to help you understand why your extension was rejected or removed from the Chrome Web Store and how you can fix the violation.

Each section in this document describes the issues that correspond to a particular category of violation. In order to make it easier to reference specific violations, the Chrome Web Store assigns each violation a human-readable ID. These IDs are composed of two words: a color and an element. For example, Yellow Magnesium corresponds to the general class of errors where the extension does not behave as expected.

Additional requirements for Manifest V3 Corresponds to notification ID: Blue Argon

The intent of this policy is to ensure that Manifest V3 extensions are not including remotely hosted code.

Common reasons for rejection Including a <script> tag that points to a resource that is not within the extension's package.

Using JavaScript's eval()` method or other mechanisms to execute a string fetched from a remote source.

Building an interpreter to run complex commands fetched from a remote source, even if those commands are fetched as data.

How can you rectify this? Double check all code for references to external JavaScript files, which should be replaced with internal extension files.

Review the Manifest V3 migration guide Improve extension security for a walkthrough on alternatives to execution of arbitrary strings and remotely hosted code.

Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Additional Requirements for Manifest V3 Extensions using Manifest V3 must meet additional requirements related to the extension's code. Specifically, the full functionality of an extension must be easily discernible from its submitted code. This means that the logic of how each extension operates should be self-contained. The extension may reference and load data and other information sources that are external to the extension, but these external resources must not contain any logic. Functionality not working Corresponds to notification ID: Yellow Magnesium

The intent of this policy is to ensure a minimum quality level for all items published in the Chrome Web Store. Extensions should provide the functionality described in their listings and, if they cannot, communicate that to the user.

Common reasons for removal/rejection Your item has packaging errors. Examples: There are files mentioned in your manifest that are not present in your package. This is most commonly seen with image files. The path or name of the files mentioned in your package are incorrect A functionality in your item is not working due to a server side issue at the time of reviewing. Your item is just not functioning as it expected based on the item's listing. How can you rectify this? Test the code that you submit to the web store locally. Test the exact files that you submit to the web store, not just a local development version of your extension. This may mean extracting resources from the package that you submitted. Unpacked and packed extensions can have different behaviors. Make sure that Chrome loads a packed version of your extension as expected by manually packing your extension and dragging the generated .crx file onto the chrome://extensions page. Verify that your submission contains the files you expect at the paths you expect. Ensure that all the files mentioned in your manifest.json are present in the package and their names and paths are correct. Check for case sensitivity bugs. For example, say your background script was named Background.js, but your manifest.json references background.js. Some file systems will treat these as the same file while others will treat them as two distinct files, causing Chrome to error when loading the extension. Make sure that your extensions clearly communicate error conditions to the user. It should be as obvious as possible for new users to understand how your extension works and verify it's behaving correctly. If your extension requires an account or special network environment, make sure that requirement is communicated to the user. If these conditions are not met, consider ways that you can make the user aware that the extension will not work as expected. Test your experience on an unreliable internet connection (e.g. lie-fi). The extension's UI should gracefully handle request timeouts, HTTP 400 and 500 errors, certificate timeouts, and other such error conditions. If you cannot determine why the reviewer thought that your extension was not working as expected, contact developer support to request more information about the rejection. In some cases, reviewers may encounter issues you cannot reproduce. Use the developer support contact form to request clarification about what features or user flows did not behave as expected. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Spam & Placement in the Store Functionality: Do not post an extension with a single purpose of installing or launching another app, theme, webpage, or extension. Extensions with broken functionality—such as dead sites or non-functioning features—are not allowed. Excessive permissions Corresponds to notification ID: Purple Potassium

The intent of this policy is to prevent excessive and unnecessary access to user data by extensions.

Common reasons for removal/rejection The extension is requesting a permission but not using it. The extension is requesting a permission that is not required to implement the functionality the extension provides. Commonly misunderstood permissions activeTab This permission grants temporary access to a tab in response to a user invoking your extension. It DOES NOT grant passive access to the user's currently focused tab.

When is it required? When you need temporary access to a tab after the user invokes your extension. When is it NOT required? When the extension has access to broad host permissions or host permissions for the specific domains that are relevant to the extension's operations. When using methods on the action, browserAction, pageAction APIs. These APIs can use activeTab to grant temporary host permissions for the currently focused tab, but they do not need activeTab to function. When using tabs.sendMessage to send a message to a specific tab. For basic use of tabs.query, such as querying the user's current tab. tabs This permission ONLY grants access to the url, pendingUrl, title, or favIconUrl properties of Tab objects.

When is it required? When an extension does not have broad host access, but needs to be able to read sensitive data like the URL of an arbitrary tab. When is it NOT required? When using methods on the tabs API. When the extension has access to broad host permissions. Host permissions grant the extension access to the same data as well as other capabilities. cookies This exposes the chrome.cookies API and allows the extension to modify cookies on origins that it has host permissions to access.

When is it required? When accessing chrome.cookies from the extension's background context or in another context using the extension's origin such as an extension's popup. When using chrome.cookies to interact with detailed cookie data, such as SameSite values. When is it NOT required? When using document.cookie or the Cookie Store API. storage The storage permission exposes the chrome.storage API to the extension.

When is it required? When using the chrome.storage API. When is it NOT required? When using the Web Storage API (document.localStorage, document.sessionStorage) or IndexedDB. How can you rectify this? Review the list of commonly misunderstood permissions to see if you have committed one of the mistakes listed there. Request only the narrowest permission required to implement your extension's functionality. Remove all unused permissions from your manifests.json's permissions, optional_permissions, and host_permissions arrays. If the message from review does not contain enough information to determine which permissions were considered excessive, contact developer support to request more information about the rejection. If the reviewer indicated that your extension did not use a given permission but you believe it does, contact developer support to appeal the decision and to provide a detailed explanation of why the permission is necessary and how it is used. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Use of Permissions Request access to the narrowest permissions necessary to implement your Product's features or services. If more than one permission could be used to implement a feature, you must request those with the least access to data or functionality.

Don't attempt to "future proof" your Product by requesting a permission that might benefit services or features that have not yet been implemented.

Missing or insufficient metadata Corresponds to notification ID: Yellow Zinc

The intent of this policy is to ensure a basic quality level of all items in the Chrome Web Store. Users should be able to understand what features and functionality an item provides based on its listing before they choose to install it. Items that misrepresent their capabilities or fail to disclose important information may be subject to enforcement action.

Common reasons for removal/rejection The extension is missing an icon, title, screenshot, or description. The extension's title is not meaningful or is misleading. The extension's screenshots or description is not meaningful or doesn't adequately explain the functionality it provides. How can you rectify this? Ensure the extension has a meaningful icon, title, screenshots, and description. Clearly explain the extension's functionality in the description and screenshots. List all major features the extension provides. Review the rectification guidance in the Functionality not working section. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Impersonation or Deceptive Behavior: If your product has a blank description field or is missing an icon or screenshots, it will be rejected. If any of your product's content, title, icon, description, or screenshots contains false or misleading information, we may remove it. Deceptive behavior Corresponds to notification IDs: Red Nickel, Red Potassium, and Red Silicon

The intent of this policy is to prevent extensions from deceiving or misleading the users.

Common reasons for removal/rejection The extension does not provide the functionality described in the metadata1. The extension provides different functionality than what is described in the metadata1. The extension performs actions not mentioned in the metadata1. The extension impersonates another entity2. The extension copies or is copied from another entity2. The extension pretends to be authorized by another entity2. 1 Metadata means the title, icon, description, screenshots, and other developer-provided information specified in the developer dashboard.

2 An entity here means any company, organization, or extension.

How can you rectify this? Ensure the functionality promised by your extension is working as intended. Clearly state the functionality of your extension in the metadata. Do not perform actions not mentioned in the metadata. Do not pretend to be another entity. Do not copy another extension. You may offer the same functionality as another extension but do not copy from other extensions. Do not pretend that your extension was endorsed, authorized or produced by another entity. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Impersonation or Deceptive Behavior: Don't pretend to be someone else, and don't represent that your product is authorized by, endorsed by, or produced by another company or organization, if that is not the case. Developers should not divert users or provide links to any other site that mimics the Chrome Web Store or passes itself off as the Chrome Web Store. Your Product and its user experience also must not mimic functionality or warnings from a user's operating system or browser. Any changes to device settings must be made with the user's knowledge and consent and be easily reversible by the user. We do not allow products that deceive or mislead users, including in the content, title, description, or screenshots. Don't misrepresent the functionality of your product or include non-obvious functionality that doesn't serve the primary purpose of the product. Descriptions of your product must directly state the functionality so that users have a clear understanding of the product they are adding. For example, products should not contain: Claimed functionalities that are not possible to implement (e.g. "Who has viewed your social media account") or which are not directly provided by the extension (e.g. file converters which only link to other file conversion services) Any metadata that misrepresents the extension's or developer's current status or performance on the Chrome Web Store (e.g. "Editor's Choice" or "Number One") If your product has a blank description field or is missing an icon or screenshots, it will be rejected. If any of your product's content, title, icon, description, or screenshots contains false or misleading information, we may remove it. User data policy - disclosure policy Corresponds to notification ID: Purple Lithium

The User Data Privacy policy is a broad category under which several other policies are gathered. All of these policies have to do with the handling and transmission of sensitive information about the user.

This policy applies to all extensions that collect user data. This particular section is to ensure that users are aware of what data is collected, and how it is collected, used, and shared.

Common reasons for removal/rejection The extension is collecting user data but has not provided a privacy policy. The privacy policy is not provided in the designated field—a common mistake here is providing the privacy policy in the description. The privacy policy URL is not working. The privacy policy is not accessible. The privacy policy URL is not leading to privacy policy. The privacy policy does not talk about user data collection, usage, handling or sharing. How can you rectify this? Add a valid, working and accessible link to your privacy policy in the designated field. Visit the Privacy tab for your extension to verify that a privacy policy link appears in the "Privacy Policy" box (located at the bottom of the Privacy tab) and that the link works as expected. Ensure the privacy policy talks about data collection, usage, handling, and sharing. If you have done the above but are still encountering review issues, contact developer support to request clarification or appeal the verdict. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Personal or Sensitive User Data Posting a Privacy Policy & Secure Transmission: If your Product handles personal or sensitive user data (including personally identifiable information, financial and payment information, health information, authentication information, website content and resources, form data, web browsing activity, user-provided content and personal communications), then your Product must:

Post a privacy policy, and Handle the user data securely, including transmitting it via modern cryptography. Illegal activities Corresponds to notification ID: Grey Zinc

The intent of this policy is to prevent the use of extensions and the Chrome Web Store to promote or participate in illegal activities.

Common reasons for removal/rejection The extension is doing anything illegal. See the policy extract for specific examples.

How can you rectify this? If this is the primary functionality of your extension, there is no direct rectification. You should unpublish your extension. If this was an unintended functionality, then remove the content or services that are in violation and resubmit your extension. If you would like more information about why this verdict was applied to your extension, developer support may be able to provide you with further details. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Illegal Activities: Keep it legal. Don't engage in or promote unlawful activities in your product, such as rape, illegal sex work, or the sale of prescription drugs without a prescription.. We will remove content which promotes, glorifies, or encourages dangerous or illegal activity that may result in physical harm to those involved. Online gambling Corresponds to notification ID: Grey Copper

Do not post content or provide services that facilitate online gambling.

Common reasons for removal/rejection Providing online gambling within an extension. Facilitating online gambling on other sites through the extension. For example, providing functionality to calculate the odds of a bet on a gambling site. While this extension does not directly allow the user to gamble, it does facilitate online gambling. Directing users to an online gambling site. Providing games of skill that offer prizes of cash or other value. How can you rectify this? If this is the primary functionality of your extension, then it is recommended to unpublish your extension. If this was an unintended functionality, then remove the content or services that are in violation and resubmit your extension. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Gambling: We don't allow content or services that facilitate online gambling, including but not limited to online casinos, sports betting, lotteries, or games of skill that offer prizes of cash or other value. Pornographic content Corresponds to notification ID: Grey Lithium

The intent of this policy is to prevent the use of extensions and the Chrome Web Store as a platform for pornography.

Common reasons for removal/rejection The extension itself contains sexually explicit material. The extension is displaying or providing sexually explicit material. The extension is directing users to pornographic sites. The extension is primarily meant to enhance sites that provide sexually explicit material. How can you rectify this? If the primary purpose of your extension is to provide access to sexually explicit material or enhance pornographic sites, you should unpublish your extension; such extensions are not allowed on the Chrome Web Store. If this was an unintended functionality, then remove the content or services that are in violation and resubmit your extension. Make sure that your extension does not contain sexually explicit images, video, text, etc. If your extension provides integrations with adult-oriented sites, make sure that the "Mature content" flag is enabled for your extension in the developer dashboard. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Sexually Explicit Material: We don't allow content that contains nudity, graphic sex acts, sexually explicit m

<think> Okay, I need to answer the user's query about Chrome Web Store's privacy policies based on the provided search results. Let me start by going through each of the sources to gather relevant information.
First, looking at source [1], it mentions that Chrome Web Store updated its user data policy in 2016, requiring developers to be transparent about handling personal data. They must provide a privacy policy, encrypt sensitive data, and disclose any use of data beyond core features. This sets the foundation for transparency and user consent.

Source [2] is a sample privacy policy from a Chrome extension developer. It emphasizes not collecting personal information unless necessary, storing data locally in LocalStorage, and obtaining user consent upon installation. This gives an example of how developers should structure their privacy policies.

From source [3], there's troubleshooting advice for policy violations. It highlights common issues like missing privacy policy links or inadequate disclosures. Developers must ensure their privacy policy is accessible and details data handling practices. This shows enforcement mechanisms and how violations are addressed.

Source [4] provides a guide on creating a privacy policy page for Chrome extensions. It outlines specific requirements such as linking the policy in the developer dashboard and detailing data collection methods. The example policy includes sections on data storage and user consent, which are critical components.

In source [7], Google's 2020 updates to privacy practices are discussed. Extensions must now display data collection info directly in the Chrome Web Store listing and limit data usage to declared purposes. This indicates ongoing updates to enhance transparency.

Source [10] clarifies that extensions handling sensitive data must post a privacy policy and use encryption. Even if they don't handle such data, they should state so in their policy. This reinforces the necessity of clear communication regardless of data handling.

Putting this together, the key points are transparency through a clear privacy policy, secure data handling with encryption, user consent for data collection beyond core features, and accurate representation in the Chrome Web Store listing. Enforcement includes rejection for non-compliance, requiring developers to rectify issues like broken links or insufficient disclosures.

I need to structure this answer with headers for each main requirement, using bullet points or tables where appropriate. Citations should follow each relevant point using the source numbers provided. Make sure to avoid any markdown formatting issues and adhere strictly to the user's guidelines. </think>

Chrome Web Storeでは、拡張機能開発者に対して厳格なプライバシーポリシー要件を課しており、主に以下の5つの柱で構成されています。

透明性の確保
プライバシーポリシーの必須掲載：個人情報や機密データを扱う拡張機能は、Chromeウェブストア開発者ダッシュボードの専用欄に有効なプライバシーポリシーリンクを掲載する必要があります[3][4][7]
データ収集の明確な開示：2021年1月以降、ストア掲載情報に「データ収集の種類」「使用方法」「共有先」を平易な言葉で表示することが義務付けられています[7]
機能範囲外のデータ利用：主要機能に不要な個人データ収集時にはユーザーへの明示的な同意取得が必須です[1][10]
データ取り扱いの安全性
暗号化要件：個人情報や認証情報などの機密データ転送時にはTLS 1.2以上の最新暗号化技術が必須です[1][10]
ローカル保存の推奨：パスワードなどの認証情報はLocalStorageに保存し、開発者サーバーへ送信しないことが求められます[4][7]
保存期間の明文化：データ保存期間をプライバシーポリシーに明記し、アンインストール時に削除される仕組みが必要です[4]
ユーザーコントロール
機能	要件
同意取得	インストール前のポリシー確認と明示的同意[2][4]
オプトアウト	データ収集の停止機能をオプションページに実装[3][7]
オフライン機能	ローカル保存のみ可能な「オフラインモード」提供推奨[3]
制限事項と禁止行為
データ販売の全面禁止：収集したユーザーデータの第三者販売が明確に禁止されています[7]
ブラウジング履歴収集制限：主要機能に不可欠な場合のみ許可（例：アドブロックツール）[1][3]
外部コード実行禁止：Manifest V3でリモートコード実行が完全禁止され、自己完結型コードが必須になりました[10]
審査と違反対応
審査不合格時の主な修正要件：

プライバシーポリシーリンクの有効性確認（リンク切れ修正）[3]
データ収集範囲の再定義（不要なパーミッション削除）[10]
暗号化方式のアップデート（TLS 1.2未満使用の場合）[1]
ユーザー通知機能の強化（データ収集時のリアルタイム通知追加）[7]
2023年1月のポリシー更新では、クリックベイト拡張機能や空機能拡張の排除、アフィリエイト広告の開示義務強化が実施され、違反拡張機能は即時削除の対象となります[5]。開発者は定期的なポリシー確認と、ユーザーデータ処理プロセスの継続的監査が強く推奨されています。

以下はChrome Web Storeのプライバシーポリシーです。

Chrome for Developers

English Sign in Chrome Extensions

Chrome for Developers Home Docs Chrome Extensions Chrome Web Store Was this helpful?

Troubleshooting Chrome Web Store violations

bookmark_border

This page is provided to help you understand why your extension was rejected or removed from the Chrome Web Store and how you can fix the violation.

Each section in this document describes the issues that correspond to a particular category of violation. In order to make it easier to reference specific violations, the Chrome Web Store assigns each violation a human-readable ID. These IDs are composed of two words: a color and an element. For example, Yellow Magnesium corresponds to the general class of errors where the extension does not behave as expected.

Additional requirements for Manifest V3 Corresponds to notification ID: Blue Argon

The intent of this policy is to ensure that Manifest V3 extensions are not including remotely hosted code.

Common reasons for rejection Including a <script> tag that points to a resource that is not within the extension's package.

Using JavaScript's eval()` method or other mechanisms to execute a string fetched from a remote source.

Building an interpreter to run complex commands fetched from a remote source, even if those commands are fetched as data.

How can you rectify this? Double check all code for references to external JavaScript files, which should be replaced with internal extension files.

Review the Manifest V3 migration guide Improve extension security for a walkthrough on alternatives to execution of arbitrary strings and remotely hosted code.

Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Additional Requirements for Manifest V3 Extensions using Manifest V3 must meet additional requirements related to the extension's code. Specifically, the full functionality of an extension must be easily discernible from its submitted code. This means that the logic of how each extension operates should be self-contained. The extension may reference and load data and other information sources that are external to the extension, but these external resources must not contain any logic. Functionality not working Corresponds to notification ID: Yellow Magnesium

The intent of this policy is to ensure a minimum quality level for all items published in the Chrome Web Store. Extensions should provide the functionality described in their listings and, if they cannot, communicate that to the user.

Common reasons for removal/rejection Your item has packaging errors. Examples: There are files mentioned in your manifest that are not present in your package. This is most commonly seen with image files. The path or name of the files mentioned in your package are incorrect A functionality in your item is not working due to a server side issue at the time of reviewing. Your item is just not functioning as it expected based on the item's listing. How can you rectify this? Test the code that you submit to the web store locally. Test the exact files that you submit to the web store, not just a local development version of your extension. This may mean extracting resources from the package that you submitted. Unpacked and packed extensions can have different behaviors. Make sure that Chrome loads a packed version of your extension as expected by manually packing your extension and dragging the generated .crx file onto the chrome://extensions page. Verify that your submission contains the files you expect at the paths you expect. Ensure that all the files mentioned in your manifest.json are present in the package and their names and paths are correct. Check for case sensitivity bugs. For example, say your background script was named Background.js, but your manifest.json references background.js. Some file systems will treat these as the same file while others will treat them as two distinct files, causing Chrome to error when loading the extension. Make sure that your extensions clearly communicate error conditions to the user. It should be as obvious as possible for new users to understand how your extension works and verify it's behaving correctly. If your extension requires an account or special network environment, make sure that requirement is communicated to the user. If these conditions are not met, consider ways that you can make the user aware that the extension will not work as expected. Test your experience on an unreliable internet connection (e.g. lie-fi). The extension's UI should gracefully handle request timeouts, HTTP 400 and 500 errors, certificate timeouts, and other such error conditions. If you cannot determine why the reviewer thought that your extension was not working as expected, contact developer support to request more information about the rejection. In some cases, reviewers may encounter issues you cannot reproduce. Use the developer support contact form to request clarification about what features or user flows did not behave as expected. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Spam & Placement in the Store Functionality: Do not post an extension with a single purpose of installing or launching another app, theme, webpage, or extension. Extensions with broken functionality—such as dead sites or non-functioning features—are not allowed. Excessive permissions Corresponds to notification ID: Purple Potassium

The intent of this policy is to prevent excessive and unnecessary access to user data by extensions.

Common reasons for removal/rejection The extension is requesting a permission but not using it. The extension is requesting a permission that is not required to implement the functionality the extension provides. Commonly misunderstood permissions activeTab This permission grants temporary access to a tab in response to a user invoking your extension. It DOES NOT grant passive access to the user's currently focused tab.

When is it required? When you need temporary access to a tab after the user invokes your extension. When is it NOT required? When the extension has access to broad host permissions or host permissions for the specific domains that are relevant to the extension's operations. When using methods on the action, browserAction, pageAction APIs. These APIs can use activeTab to grant temporary host permissions for the currently focused tab, but they do not need activeTab to function. When using tabs.sendMessage to send a message to a specific tab. For basic use of tabs.query, such as querying the user's current tab. tabs This permission ONLY grants access to the url, pendingUrl, title, or favIconUrl properties of Tab objects.

When is it required? When an extension does not have broad host access, but needs to be able to read sensitive data like the URL of an arbitrary tab. When is it NOT required? When using methods on the tabs API. When the extension has access to broad host permissions. Host permissions grant the extension access to the same data as well as other capabilities. cookies This exposes the chrome.cookies API and allows the extension to modify cookies on origins that it has host permissions to access.

When is it required? When accessing chrome.cookies from the extension's background context or in another context using the extension's origin such as an extension's popup. When using chrome.cookies to interact with detailed cookie data, such as SameSite values. When is it NOT required? When using document.cookie or the Cookie Store API. storage The storage permission exposes the chrome.storage API to the extension.

When is it required? When using the chrome.storage API. When is it NOT required? When using the Web Storage API (document.localStorage, document.sessionStorage) or IndexedDB. How can you rectify this? Review the list of commonly misunderstood permissions to see if you have committed one of the mistakes listed there. Request only the narrowest permission required to implement your extension's functionality. Remove all unused permissions from your manifests.json's permissions, optional_permissions, and host_permissions arrays. If the message from review does not contain enough information to determine which permissions were considered excessive, contact developer support to request more information about the rejection. If the reviewer indicated that your extension did not use a given permission but you believe it does, contact developer support to appeal the decision and to provide a detailed explanation of why the permission is necessary and how it is used. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Use of Permissions Request access to the narrowest permissions necessary to implement your Product's features or services. If more than one permission could be used to implement a feature, you must request those with the least access to data or functionality.

Don't attempt to "future proof" your Product by requesting a permission that might benefit services or features that have not yet been implemented.

Missing or insufficient metadata Corresponds to notification ID: Yellow Zinc

The intent of this policy is to ensure a basic quality level of all items in the Chrome Web Store. Users should be able to understand what features and functionality an item provides based on its listing before they choose to install it. Items that misrepresent their capabilities or fail to disclose important information may be subject to enforcement action.

Common reasons for removal/rejection The extension is missing an icon, title, screenshot, or description. The extension's title is not meaningful or is misleading. The extension's screenshots or description is not meaningful or doesn't adequately explain the functionality it provides. How can you rectify this? Ensure the extension has a meaningful icon, title, screenshots, and description. Clearly explain the extension's functionality in the description and screenshots. List all major features the extension provides. Review the rectification guidance in the Functionality not working section. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Impersonation or Deceptive Behavior: If your product has a blank description field or is missing an icon or screenshots, it will be rejected. If any of your product's content, title, icon, description, or screenshots contains false or misleading information, we may remove it. Deceptive behavior Corresponds to notification IDs: Red Nickel, Red Potassium, and Red Silicon

The intent of this policy is to prevent extensions from deceiving or misleading the users.

Common reasons for removal/rejection The extension does not provide the functionality described in the metadata1. The extension provides different functionality than what is described in the metadata1. The extension performs actions not mentioned in the metadata1. The extension impersonates another entity2. The extension copies or is copied from another entity2. The extension pretends to be authorized by another entity2. 1 Metadata means the title, icon, description, screenshots, and other developer-provided information specified in the developer dashboard.

2 An entity here means any company, organization, or extension.

How can you rectify this? Ensure the functionality promised by your extension is working as intended. Clearly state the functionality of your extension in the metadata. Do not perform actions not mentioned in the metadata. Do not pretend to be another entity. Do not copy another extension. You may offer the same functionality as another extension but do not copy from other extensions. Do not pretend that your extension was endorsed, authorized or produced by another entity. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Impersonation or Deceptive Behavior: Don't pretend to be someone else, and don't represent that your product is authorized by, endorsed by, or produced by another company or organization, if that is not the case. Developers should not divert users or provide links to any other site that mimics the Chrome Web Store or passes itself off as the Chrome Web Store. Your Product and its user experience also must not mimic functionality or warnings from a user's operating system or browser. Any changes to device settings must be made with the user's knowledge and consent and be easily reversible by the user. We do not allow products that deceive or mislead users, including in the content, title, description, or screenshots. Don't misrepresent the functionality of your product or include non-obvious functionality that doesn't serve the primary purpose of the product. Descriptions of your product must directly state the functionality so that users have a clear understanding of the product they are adding. For example, products should not contain: Claimed functionalities that are not possible to implement (e.g. "Who has viewed your social media account") or which are not directly provided by the extension (e.g. file converters which only link to other file conversion services) Any metadata that misrepresents the extension's or developer's current status or performance on the Chrome Web Store (e.g. "Editor's Choice" or "Number One") If your product has a blank description field or is missing an icon or screenshots, it will be rejected. If any of your product's content, title, icon, description, or screenshots contains false or misleading information, we may remove it. User data policy - disclosure policy Corresponds to notification ID: Purple Lithium

The User Data Privacy policy is a broad category under which several other policies are gathered. All of these policies have to do with the handling and transmission of sensitive information about the user.

This policy applies to all extensions that collect user data. This particular section is to ensure that users are aware of what data is collected, and how it is collected, used, and shared.

Common reasons for removal/rejection The extension is collecting user data but has not provided a privacy policy. The privacy policy is not provided in the designated field—a common mistake here is providing the privacy policy in the description. The privacy policy URL is not working. The privacy policy is not accessible. The privacy policy URL is not leading to privacy policy. The privacy policy does not talk about user data collection, usage, handling or sharing. How can you rectify this? Add a valid, working and accessible link to your privacy policy in the designated field. Visit the Privacy tab for your extension to verify that a privacy policy link appears in the "Privacy Policy" box (located at the bottom of the Privacy tab) and that the link works as expected. Ensure the privacy policy talks about data collection, usage, handling, and sharing. If you have done the above but are still encountering review issues, contact developer support to request clarification or appeal the verdict. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Personal or Sensitive User Data Posting a Privacy Policy & Secure Transmission: If your Product handles personal or sensitive user data (including personally identifiable information, financial and payment information, health information, authentication information, website content and resources, form data, web browsing activity, user-provided content and personal communications), then your Product must:

Post a privacy policy, and Handle the user data securely, including transmitting it via modern cryptography. Illegal activities Corresponds to notification ID: Grey Zinc

The intent of this policy is to prevent the use of extensions and the Chrome Web Store to promote or participate in illegal activities.

Common reasons for removal/rejection The extension is doing anything illegal. See the policy extract for specific examples.

How can you rectify this? If this is the primary functionality of your extension, there is no direct rectification. You should unpublish your extension. If this was an unintended functionality, then remove the content or services that are in violation and resubmit your extension. If you would like more information about why this verdict was applied to your extension, developer support may be able to provide you with further details. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Illegal Activities: Keep it legal. Don't engage in or promote unlawful activities in your product, such as rape, illegal sex work, or the sale of prescription drugs without a prescription.. We will remove content which promotes, glorifies, or encourages dangerous or illegal activity that may result in physical harm to those involved. Online gambling Corresponds to notification ID: Grey Copper

Do not post content or provide services that facilitate online gambling.

Common reasons for removal/rejection Providing online gambling within an extension. Facilitating online gambling on other sites through the extension. For example, providing functionality to calculate the odds of a bet on a gambling site. While this extension does not directly allow the user to gamble, it does facilitate online gambling. Directing users to an online gambling site. Providing games of skill that offer prizes of cash or other value. How can you rectify this? If this is the primary functionality of your extension, then it is recommended to unpublish your extension. If this was an unintended functionality, then remove the content or services that are in violation and resubmit your extension. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Gambling: We don't allow content or services that facilitate online gambling, including but not limited to online casinos, sports betting, lotteries, or games of skill that offer prizes of cash or other value. Pornographic content Corresponds to notification ID: Grey Lithium

The intent of this policy is to prevent the use of extensions and the Chrome Web Store as a platform for pornography.

Common reasons for removal/rejection The extension itself contains sexually explicit material. The extension is displaying or providing sexually explicit material. The extension is directing users to pornographic sites. The extension is primarily meant to enhance sites that provide sexually explicit material. How can you rectify this? If the primary purpose of your extension is to provide access to sexually explicit material or enhance pornographic sites, you should unpublish your extension; such extensions are not allowed on the Chrome Web Store. If this was an unintended functionality, then remove the content or services that are in violation and resubmit your extension. Make sure that your extension does not contain sexually explicit images, video, text, etc. If your extension provides integrations with adult-oriented sites, make sure that the "Mature content" flag is enabled for your extension in the developer dashboard. Relevant policy This section addresses extensions that are in violation of the following section of the Chrome Web Store developer program policies:

Content Policies Sexually Explicit Material: We don't allow content that contains nudity, graphic sex acts, sexually explicit material, or content that drives tra

上記をもとに、READMEを完成させてください。以下の点を含めること ◯このアプリは、ユーザーのデータを一切収集しない。 ◯ユーザーが利用するAIサービス（設定画面で明示的にオンにするのちに使える）や、ユーザーが設定したAPIを介して利用するサービスのユーザーデータ利用に関してはこのアプリ開発者は関知しない。ユーザーの責任で利用すること

日本語、中国語、英語の併記にすること。

<p align="center"> <img src="./src/assets/icon.png" width="150"> </p> <h1 align="center">ChatHub OSS</h1>
Install
To be updated (You can build by youself for now)

📷 Screenshot
Screenshot

🤝 Sponsors
<div style="background-color:#e8f5e9; padding:10px; border-left:5px solid #4caf50; border-radius:5px;"> <!-- 緑とアイコンで強調 --> <h2><b>Important Remarks</b> <span style="color:#4caf50;">&#9888;</span></h2> <p>この拡張機能は、現在はAPIのみをサポートします。<br> Webapp機能のサポートはロードマップに存在ありません。</p> </div>
✨ Features
🤖 Use different chatbots in one app, currently supporting ChatGPT, new Bing Chat, Google Bard, Claude, and open-source models including LLama2, Vicuna, ChatGLM etc
💬 Chat with multiple chatbots at the same time, making it easy to compare their answers
🚀 Support ChatGPT API and GPT-4 Browsing
🔍 Shortcut to quickly activate the app anywhere in the browser
🎨 Markdown and code highlight support
📚 Prompt Library for custom prompts and community prompts
💾 Conversation history saved locally
📥 Export and Import all your data
🔗 Share conversation to markdown
🌙 Dark mode
🌐 Web access
🤖 Supported Bots
ChatGPT
Google Bard
Claude 3.5
🔨 Build from Source
Clone the source code
corepack enable
yarn install
yarn build
In Chrome/Edge go to the Extensions page (chrome://extensions or edge://extensions)
Enable Developer Mode
Drag the dist folder anywhere on the page to import it (do not delete the folder afterward)
Privacy Policy
<think> Okay, I need to help the user complete their README file based on the Chrome Web Store's privacy policy and their specific requirements. Let me start by understanding what they need.
First, the user provided a detailed privacy policy from Chrome Web Store, which outlines various requirements for extensions. They want their README to include two main points:

The app does not collect any user data.
The app isn't responsible for data usage by third-party AI services or APIs that users enable.
Additionally, the README needs to be in Japanese, Chinese, and English. The existing structure includes sections like Install, Screenshot, Sponsors, Important Remarks, Features, Supported Bots, Build from Source, and now they need a Privacy Policy section.

Looking at the search results provided, especially sources [1], [2], and [3], they emphasize the need for a clear privacy policy that states data isn't collected and how third-party services are handled. The user's app doesn't collect data, so that's straightforward. For third-party services, the policy should clarify that once users enable those services (like AI APIs), the responsibility shifts to the user and the third-party providers.

I should structure the Privacy Policy section to address both points clearly. Using markdown for readability, maybe a header followed by bullet points or subsections. Since it's trilingual, each language section should be clearly separated but equivalent in content.

Also, considering Chrome's requirements from the search results, mentioning that no data is stored or transmitted by the app itself is crucial. For third-party services, advising users to review those services' privacy policies would be good.

I need to make sure the language is concise and complies with Chrome's policies. Checking examples from sources [1] and [2], they use clear headings and bullet points. I'll follow that format.

Now, translating each section into Chinese and English while maintaining consistency. Ensuring that technical terms are accurately translated. Maybe using subsections for each language under the main Privacy Policy header.

Also, integrating the user's specific points about not collecting data and disclaiming responsibility for third-party services. Making sure these are prominently featured in each language version.

Finally, placing the Privacy Policy section appropriately in the README, probably after the Build from Source section but before any closing remarks or licenses. </think>


## 📜 Privacy Policy / プライバシーポリシー / 隐私政策
### 🇯🇵 日本語
◯ 本アプリケーションはユーザーの個人データを一切収集しません
◯ ユーザーが設定画面で明示的に有効化したAIサービス、またはユーザー自身が設定したAPI経由で利用するサービスにおけるデータ取り扱いについては、当開発者は一切の関知をしません。これら外部サービスの利用はユーザー自身の責任において行ってください

### 🇨🇳 中文
◯ 本应用不会收集任何用户个人信息
◯ 对用户在设置中主动启用的AI服务，或通过用户自定义API接口调用的服务，开发者不承担任何责任亦不参与相关管理，由此产生的数据处理行为及风险均由用户自行承担

### 🇺🇸 English

◯ This application does NOT collect any user data
◯ The developer is not responsible for data handling by AI services explicitly enabled in settings or third-party APIs configured by users. Use of these services is at users' own discretion

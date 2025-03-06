// apiConfig.js

const API_URL =
  import.meta.env.VITE_ENV === 'qa'
    ? `https://devaiwebfunctions-evaffrf2behvf8hf.eastus2-01.azurewebsites.net`
    : `https://prodaiwebfxapp.azurewebsites.net`;

const endpoints = {
  translations: {
    translateAzureText: `${API_URL}/translate/azure/text`,
    translateAzureDocuments: `${API_URL}/api/translate/azure/documents`,
    translateDeeplText: `${API_URL}/translate/deepl/text`,
    // translateDeeplDocuments: `${API_URL}/translate/deepl/documents`,
    translateDeeplDocuments: `https://devaiwebfunctions-evaffrf2behvf8hf.eastus2-01.azurewebsites.net/api/translate/deepl/documents`,

    getAzureDocs: `${API_URL}/api/translate/azure/documents`,
    getAzureDocsStatus: `${API_URL}/api/translate/azure/documents/status`,

    getDeeplDocs: `${API_URL}/api/translate/deepl/documents`,
    getDeeplCheckDocsStatus: `${API_URL}/api/translate/deepl/documents/check/status`,
    getDeeplDocsStatus: `${API_URL}/api/translate/deepl/documents/status`,
  },
  settings: {
    settingsAzureSet: `${API_URL}/api/settings/azure/set`,
    settingsAzureGet: `${API_URL}/api/settings/azure/get`,
    settingsDeeplSet: `${API_URL}/api/settings/deepl/set`,
    settingsDeeplGet: `${API_URL}/api/settings/deepl/get`,
    settingsAzureTestTextDocument: `${API_URL}/settings/azure/test/text_document`,
    settingsAzureTestString: `${API_URL}/settings/azure/test/string`,
    settingsDeeplTest: `${API_URL}/settings/deepl/test`,
  },
  auth: {
    samlLogin: `${API_URL}/saml/login`,
    samlCallback: `${API_URL}/saml/callback`,
    samlTokenExtract: `${API_URL}/saml/token/extract`,
    samlTokenExtractLocal: `https://test-12-h3cgcrgjhmdhhses.centralindia-01.azurewebsites.net/data_from_token`,
    samlLoginLocal: `https://test-12-h3cgcrgjhmdhhses.centralindia-01.azurewebsites.net/saml/login`,
  },
  feedback: {
    feedbackAdd: `${API_URL}/feedback`,
  },
  delete: {
    deleteContainersAzure: `${API_URL}/delete/containers`,
    deleteContainersDeepL: `${API_URL}/delete/files/deepl`,
  },
  log: {
    login: `${API_URL}/log/user/login`,
    textTranslation: `${API_URL}/log/text/translation`,
    docsTranslation: `${API_URL}/log/document/translation`,
  },
};

export default endpoints;

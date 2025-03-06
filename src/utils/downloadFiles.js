// download single azure file

import toast from 'react-hot-toast';
import endpoints from './constants/apiConfigs';
import axios from 'axios';

// download all azure files
export const downloadAllAzureFiles = (translatedFiles, apiMode) => {
  console.log(translatedFiles, apiMode);

  if (apiMode !== 'azure') {
    for (let link of translatedFiles) {
      window.open(link.sas_url, '_blank');
    }
  } else {
    for (let link of translatedFiles) {
      window.open(link.sas_url, '_blank');
    }
  }
  toast.success('Files downloaded');
  deleteContainer(apiMode);
};

const deleteContainer = async (apiMode) => {
  try {
    const apiUrl =
      apiMode === 'azure'
        ? endpoints.delete.deleteContainersAzure
        : endpoints.delete.deleteContainersDeepL;
    const response = await axios.delete(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Returned JSON:', response.data);
  } catch (error) {
    console.error('There was a problem with the axios operation:', error);
  }
};

// download single file
export const downloadDocument = async (document, translatedFiles) => {
  // console.log('DOCUMENT: ', translatedFiles);

  window.open(document, '_blank');

  if (translatedFiles.length === 1) {
    deleteContainer();
  }
};

// download all deepl files
export const downloadAllDeeplDocs = (translatedFiles) => {
  console.log('down:: ', translatedFiles);
  const fileURLs = Object.values(translatedFiles);

  for (let link of fileURLs) {
    window.open(link, '_blank');
  }
  deleteContainer();
};

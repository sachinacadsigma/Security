import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaRegSave, FaRegEdit } from 'react-icons/fa';
import { VscRunCoverage } from 'react-icons/vsc';
import toast from 'react-hot-toast';
import endpoints from '../utils/constants/apiConfigs';
import useAuth from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    resourceKey: '',
    azureRegion: '',
    textTranslationEndpoint: '',
    documentTranslationEndpoint: '',
    storageConnectionString: '',
  });
  const { group } = useAuth();

  if (group !== 'admin') {
    return <Navigate to='/workingui' />;
  }

  const [otherSettingsData, setOtherSettingsData] = useState({
    apiKey: '',
    adminids: '',
  });

  console.log(import.meta.env.MODE);

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('settings');
  const [isEditing, setIsEditing] = useState(false); // To toggle edit mode
  const [isDeepLEditing, setIsDeepLEditing] = useState(false);

  const resourceKeyRef = useRef(null);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeepLEditClick = () => {
    setIsDeepLEditing(true);
  };

  useEffect(() => {
    if (isEditing && resourceKeyRef.current) {
      resourceKeyRef.current.focus(); // Focus on the first input
    }
  }, [isEditing]);

  useEffect(() => {
    const fetchAzureSettings = async () => {
      try {
        const response = await axios.get(endpoints.settings.settingsAzureGet, {
          params: {
            admin_id: '1',
          },
          headers: {
            Authorization: `Bearer A7x!G2p@Q9#L`,
          },
        });
        console.log('Fetched settings:', response.data); // Log fetched data
        setFormData({
          resourceKey: response.data.key,
          azureRegion: response.data.region,
          textTranslationEndpoint: response.data.text_translation_endpoint,
          documentTranslationEndpoint:
            response.data.document_translation_endpoint,
          storageConnectionString: response.data.storage_connection_string,
        });
      } catch (error) {
        console.error(
          'Error fetching settings:',
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchAzureSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSaveAzureSettings = async () => {
    const newErrors = {};
    let isValid = true;

    // Validate settings fields
    for (const field in formData) {
      if (!formData[field]) {
        newErrors[field] = '*This field is required';
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      console.log('Saving settings with:', formData); // Log data being saved
      const {
        resourceKey,
        azureRegion,
        textTranslationEndpoint,
        documentTranslationEndpoint,
        storageConnectionString,
      } = formData;

      const saveFormData = new FormData();

      saveFormData.append('key', resourceKey);
      saveFormData.append('text_translation_endpoint', textTranslationEndpoint);
      saveFormData.append(
        'document_translation_endpoint',
        documentTranslationEndpoint
      );
      saveFormData.append('region', azureRegion);
      saveFormData.append('storage_connection_string', storageConnectionString);

      const response = await axios.post(
        endpoints.settings.settingsAzureSet,
        saveFormData,
        {
          headers: {
            Authorization: `Bearer A7x!G2p@Q9#L`,
          },
        }
      );

      if (response.status === 200) {
        console.log('Settings saved successfully!');
        toast.success('Settings saved successfully!');
        setErrors({});
      } else {
        console.log('Failed to save settings.');
        toast.error('Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error occurred while saving settings.');
    }
    setIsEditing(false);
  };

  //Save FUNCTION ENDS
  const handleAzureTestClick = async () => {
    const {
      resourceKey,
      azureRegion,
      textTranslationEndpoint,
      documentTranslationEndpoint,
      storageConnectionString,
    } = formData;

    // Ensure the parameters are not empty
    if (
      !resourceKey ||
      !azureRegion ||
      !textTranslationEndpoint ||
      !documentTranslationEndpoint
    ) {
      toast.error('Please fill in all fields before testing.');
      return;
    }

    const requestFormData = new FormData();
    requestFormData.append('key', resourceKey);
    requestFormData.append(
      'text_translation_endpoint',
      textTranslationEndpoint
    );
    requestFormData.append(
      'document_translation_endpoint',
      documentTranslationEndpoint
    );
    requestFormData.append('region', azureRegion);

    const connectionStringPayload = new FormData();
    connectionStringPayload.append(
      'connection_string',
      storageConnectionString
    );

    try {
      const [endpointsTestRes, connectionStringTestRes] = await Promise.all([
        axios.post(
          endpoints.settings.settingsAzureTestTextDocument,
          requestFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer A7x!G2p@Q9#L`,
            },
          }
        ),
        axios.post(
          endpoints.settings.settingsAzureTestString,
          connectionStringPayload,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer A7x!G2p@Q9#L`,
            },
          }
        ),
      ]);

      if (
        endpointsTestRes.status === 200 &&
        connectionStringTestRes.status === 200
      ) {
        toast.success('Test successful!');
      } else {
        toast.error('Test failed. Please check your settings and try again.');
      }
    } catch (error) {
      console.error('Error during test:', error);
      toast.error('Test failed. Please check your settings and try again.');
    }
  };

  // fetch deepl settings
  useEffect(() => {
    const fetchDeepLSettings = async () => {
      try {
        const formData = new FormData();
        formData.append('admin_id', '1');

        const response = await axios.post(
          endpoints.settings.settingsDeeplGet,
          formData,
          {
            headers: {
              Authorization: `Bearer A7x!G2p@Q9#L`,
            },
          }
        );
        console.log('Fetched settings:', response.data);
        // Set the retrieved settings into state
        setOtherSettingsData({
          apiKey: response.data.api || response.data.api_key || '', // Use correct key based on API response
          adminids: response.data.admin_id || '',
        });
      } catch (error) {
        console.error('Error fetching DeepL settings:', error);
        toast.error('Error occurred while fetching DeepL settings.');
      }
    };
    if (activeTab === 'otherSettings') {
      fetchDeepLSettings();
    }
  }, [activeTab]);

  // to handle saving DeepL settings
  const handleSaveDeepLSettings = async () => {
    const newErrors = {};
    let isValid = true;

    // Validate DeepL settings fields
    if (!otherSettingsData.apiKey) {
      newErrors.apiKey = '*This field is required';
      isValid = false;
    }
    if (!otherSettingsData.adminids) {
      newErrors.adminids = '*This field is required';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      console.log('Saving DeepL settings with:', otherSettingsData); // Log data being saved
      const { apiKey, adminids } = otherSettingsData;

      const formDataToSend = new FormData();
      formDataToSend.append('admin_id', '1'); // Admin ID
      formDataToSend.append('api_key', apiKey);
      //formDataToSend.append("endpoint_url", adminids);

      const response = await axios.post(
        endpoints.settings.settingsDeeplSet,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer A7x!G2p@Q9#L`,
          },
        }
      );

      if (response.status === 200) {
        console.log('DeepL settings saved successfully!');
        toast.success('DeepL settings saved successfully!');
        setErrors({});
        setIsDeepLEditing(false);
      } else {
        console.log('Failed to save DeepL settings.');
        toast.error('Failed to save DeepL settings.');
      }
    } catch (error) {
      console.error('Error saving DeepL settings:', error);
      toast.error('Error occurred while saving DeepL settings.');
    }
  };

  const handleDeepLTestClick = async () => {
    const { apiKey } = otherSettingsData;

    if (!apiKey) {
      toast.error('Please provide the API Key before testing.');
      return;
    }

    try {
      const response = await axios.post(
        endpoints.settings.settingsDeeplTest,
        { auth_key: apiKey },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer A7x!G2p@Q9#L`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Test successful!');
      } else {
        toast.error('Test failed.');
      }
    } catch (error) {
      console.error('Error during test:', error);
      toast.error('Test failed. Please check your API Key and try again.');
    }
  };

  //UI
  const renderContent = () => {
    if (activeTab === 'settings') {
      return (
        <form className='w-full border max-w-[560px] bg-white shadow-md rounded p-6'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Resource Key:
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                !isEditing ? 'bg-gray-200' : ''
              }`}
              type='password'
              name='resourceKey'
              placeholder='Enter Resource Key'
              value={formData.resourceKey}
              onChange={isEditing ? handleChange : null}
              ref={resourceKeyRef}
              disabled={!isEditing} // Make input read-only if not editing
            />
            {errors.resourceKey && (
              <p className='text-red-500 text-xs italic'>
                {errors.resourceKey}
              </p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Azure Region:
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                !isEditing ? 'bg-gray-200' : ''
              }`}
              type='text'
              name='azureRegion'
              placeholder='eastus2'
              value={formData.azureRegion}
              onChange={isEditing ? handleChange : null}
              disabled={!isEditing}
            />
            {errors.azureRegion && (
              <p className='text-red-500 text-xs italic'>
                {errors.azureRegion}
              </p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Text Translation Endpoint:
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                !isEditing ? 'bg-gray-200' : ''
              }`}
              type='text'
              name='textTranslationEndpoint'
              placeholder='https://api.cognitive.microsofttranslator.com/'
              value={formData.textTranslationEndpoint}
              onChange={isEditing ? handleChange : null}
              disabled={!isEditing}
            />
            {errors.textTranslationEndpoint && (
              <p className='text-red-500 text-xs italic'>
                {errors.textTranslationEndpoint}
              </p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Document Translation Endpoint:
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                !isEditing ? 'bg-gray-200' : ''
              }`}
              type='text'
              name='documentTranslationEndpoint'
              placeholder='https://deviatranslation.cognitiveservices.azure.com/'
              value={formData.documentTranslationEndpoint}
              onChange={isEditing ? handleChange : null}
              disabled={!isEditing}
            />
            {errors.documentTranslationEndpoint && (
              <p className='text-red-500 text-xs italic'>
                {errors.documentTranslationEndpoint}
              </p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Storage Connection String:
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                !isEditing ? 'bg-gray-200' : ''
              }`}
              type='text'
              name='storageConnectionString'
              placeholder='Enter Storage Connection String'
              value={formData.storageConnectionString}
              onChange={isEditing ? handleChange : null}
              disabled={!isEditing}
            />
            {errors.storageConnectionString && (
              <p className='text-red-500 text-xs italic'>
                {errors.storageConnectionString}
              </p>
            )}
          </div>

          <div className='flex justify-end mt-4'>
            {/* Edit */}
            <button
              className={`ml-2 ${
                isEditing ? 'bg-gray-400' : 'bg-blue-500'
              }  text-gray-700 font-bold py-2 px-4 rounded`}
              type='button'
              onClick={isEditing ? undefined : handleEditClick} // Disable click if editing
              title='Edit Configurations'
            >
              <FaRegEdit className='text-black' />
            </button>

            {/* Save */}
            <button
              className={`ml-2 ${
                isEditing
                  ? 'bg-green-500 cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-gray-700 font-bold py-2 px-4 rounded`}
              type='button'
              onClick={isEditing ? handleSaveAzureSettings : undefined}
              disabled={!isEditing}
              title='Save Configurations'
            >
              <FaRegSave className='text-black' />
            </button>

            {/* Test */}
            <button
              className='ml-2 bg-yellow-400  text-white font-bold py-2 px-4 rounded'
              type='button'
              onClick={handleAzureTestClick}
              title='Test Configurations'
            >
              <VscRunCoverage className='text-black' />
            </button>
          </div>
        </form>
      );

      // --------------------DEEPL SETTINGS------------------------------------------------------------------
    } else if (activeTab === 'otherSettings') {
      return (
        <form className='bg-white border shadow-md rounded p-6 w-full max-w-[560px]'>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              API Key:
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                !isDeepLEditing ? 'bg-gray-200' : ''
              }`}
              type='text'
              name='apiKey'
              placeholder='Enter API Key'
              value={otherSettingsData.apiKey}
              onChange={(e) =>
                setOtherSettingsData({
                  ...otherSettingsData,
                  apiKey: e.target.value,
                })
              }
              disabled={!isDeepLEditing} // Disable if not editing
            />
            {errors.apiKey && (
              <p className='text-red-500 text-xs italic'>{errors.apiKey}</p>
            )}
          </div>

          <div className='flex justify-end mt-4'>
            {/* Edit Button */}
            <button
              className={`ml-2 ${
                isDeepLEditing ? 'bg-gray-400' : 'bg-blue-500'
              } text-gray-700 font-bold py-2 px-4 rounded`}
              type='button'
              onClick={isDeepLEditing ? undefined : handleDeepLEditClick} // Disable click if editing
            >
              <FaRegEdit className='text-black' />
            </button>

            {/* Save Button */}
            <button
              className={`ml-2 ${
                isDeepLEditing
                  ? 'bg-green-500 cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              } text-gray-700 font-bold py-2 px-4 rounded`}
              type='button'
              onClick={isDeepLEditing ? handleSaveDeepLSettings : undefined}
              disabled={!isDeepLEditing} // Enable only when editing
            >
              <FaRegSave className='text-black' />
            </button>

            <button
              className='ml-2 bg-[#FCBC19] hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded'
              type='button'
              onClick={handleDeepLTestClick} // Placeholder for other settings test
            >
              <VscRunCoverage className='text-black' />
            </button>
          </div>
        </form>
      );
    }
  };

  return (
    <div className='flex flex-col items-center p-6'>
      <div className='w-full max-w-[560px] mb-2 flex items-center justify-between'>
        <h1 className='text-2xl font-medium'>Settings</h1>
        <div className='mb-4'>
          <button
            title='Switch to Azure Settings'
            className={`py-2 px-4 ${
              activeTab === 'settings'
                ? 'bg-[#FCBC19] font-semibold'
                : 'bg-gray-200  '
            } rounded-l`}
            onClick={() => setActiveTab('settings')}
          >
            Azure
          </button>
          <button
            title='Switch to DeepL Settings'
            className={`py-2 px-4 ${
              activeTab === 'otherSettings'
                ? 'bg-blue-500 text-white font-semibold'
                : 'bg-gray-200 '
            } rounded-r`}
            onClick={() => setActiveTab('otherSettings')}
          >
            DeepL
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default SettingsPage;

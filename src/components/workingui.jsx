import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import {
  FaPaperclip,
  FaBook,
  FaCopy,
  FaArrowRight,
  FaRegTimesCircle,
  FaDownload,
} from 'react-icons/fa';
import { TbBulb } from 'react-icons/tb';
import '../Transpage.css';
import { TiThumbsUp, TiThumbsDown } from 'react-icons/ti';
import AttachedFileItem from './AttachedFileItem';
import useApp from '../hooks/useApp';
import toast from 'react-hot-toast';
import { downloadAllAzureFiles } from '../utils/downloadFiles';
import FeedbackModal from './FeedbackModal';
import TranslatedFilesResult from './TranslatedFilesResult';
import endpoints from '../utils/constants/apiConfigs';
import ResultShimmer from './ResultShimmer';
import useAuth from '../hooks/useAuth';
import {
  deeplSourceLangs,
  deeplTargetLangs,
  deeplTargetLangsGlossary,
} from '../utils/constants/languages';
import allowedFileTypes from '../utils/constants/allowedFileTypes';
import ContextModal from './ContextModal';

const workingui = () => {
  const { apiMode, changeApiMode } = useApp();
  const { name, token } = useAuth();
  const [inputText, setInputText] = useState(``);
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState();
  const [targetLang, setTargetLang] = useState();
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [attachedGlossary, setAttachedGlossary] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [deepLSourceLanguages] = useState(deeplSourceLangs);
  const [deepLTargetLanguages, setDeepLTargetLanguages] =
    useState(deeplTargetLangs);
  const [validationErrors, setValidationErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [formality, setFormality] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // feedback
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);
  const [feedbackOption, setFeedbackOption] = useState('');
  const [customFeedback, setCustomFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [showTranslatedText, setShowTranslatedText] = useState(false);
  const [showTranslatedFiles, setShowTranslatedFiles] = useState(false);
  const [translatedFiles, setTranslatedFiles] = useState([]);

  // States for text translation feedback
  const [thumbsUpClickedText, setThumbsUpClickedText] = useState(false);
  const [thumbsDownClickedText, setThumbsDownClickedText] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [contextText, setContextText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAllDownloaded, setIsAllDownloaded] = useState(false);
  const [fileErrors, setFileErrors] = useState({
    attachFiles: '',
    attachGlossary: '',
  });
  const [controller, setController] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log('data transfer files: ', e.dataTransfer.files);
      const newFiles = Array.from(e.dataTransfer.files); // Get the new files
      const allFiles = [...attachedFiles, ...newFiles]; // Merge existing and new files

      // Define allowed extensions based on the current API mode
      const allowedExtensions =
        apiMode === 'deepl' ? allowedFileTypes.deepl : allowedFileTypes.azure;

      // Separate supported and unsupported files
      const supportedFiles = allFiles.filter((file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        return allowedExtensions.includes(extension);
      });

      const unsupportedFiles = allFiles.filter((file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        return !allowedExtensions.includes(extension);
      });

      // Handle unsupported files
      if (unsupportedFiles.length > 0) {
        setFileErrors((prev) => ({
          ...prev,
          attachFiles: '*Unsupported file format detected',
        }));

        toast.error(
          `Removed files with .${unsupportedFiles
            .map((file) => file.name.split('.').pop().toLowerCase())
            .join(', ')} extensions`
        );
      } else {
        setFileErrors((prev) => ({ ...prev, attachFiles: '' }));
      }

      // Update with only supported files
      setAttachedFiles(supportedFiles);
      setInputText('');
      setTranslatedFiles([]);
      setShowTranslatedText(false);
      setTranslatedText('');
    }
  };

  const openFeedbackModal = (fileName, index) => {
    setSelectedFileName(fileName);
    setIsModalOpen(true);
    setFeedbackSubmitted(false);
  };

  const handleToggle = () => {
    setTranslatedFiles([]);
    setTranslatedText('');
    setThumbsDownClickedText(false);
    setThumbsUpClickedText(false);
    setTargetLang(null);

    if (apiMode === 'azure') {
      changeApiMode('deepl');
    } else {
      changeApiMode('azure');
    }
  };

  //Fetches language from api
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0'
        );
        const languagesData = response.data.translation;
        const languageOptions = Object.entries(languagesData).map(
          ([key, value]) => ({
            value: key,
            label: value.name,
          })
        );
        const sortedLanguages = [
          { value: 'EN', label: 'English' },
          ...languageOptions.filter((lang) => lang.value !== 'en'),
        ];
        setLanguages(sortedLanguages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  // set supported languages when glossary is attached
  useEffect(() => {
    if (attachedGlossary) {
      if (
        !deeplTargetLangsGlossary.some(
          (lang) => lang.value === targetLang?.value
        ) &&
        apiMode !== 'azure'
      ) {
        setTargetLang(null);
      }
      setDeepLTargetLanguages(deeplTargetLangsGlossary);
    } else {
      setDeepLTargetLanguages(deeplTargetLangs);
    }
  }, [attachedGlossary]);

  // Handle text translation
  const handleTranslate = async () => {
    // Reset state and validate inputs
    setValidationErrors([]);
    setShowTranslatedFiles(false);
    setShowTranslatedText(false);
    setThumbsUpClickedText(false);
    setThumbsDownClickedText(false);
    setIsDownloaded(false);
    setIsTranslating(false);
    setIsAllDownloaded(false);

    const errors = {};
    if (!sourceLang) errors.sourceLang = '*Please select a source language.';
    if (!targetLang) errors.targetLang = '*Please select a target language.';
    if (!inputText.trim() && attachedFiles.length === 0)
      errors.inputText = 'Please enter text or attach files.';
    if (apiMode !== 'azure' && !formality) {
      errors.formality = '*Please select a formality level.';
    }

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return; // Stop if there are validation errors

    const sourceLangName = sourceLang?.label;
    const targetLangName = targetLang?.label;

    if (sourceLangName === targetLangName) {
      toast.error('Source and Target Languages should not be the same');
      return;
    }

    if (controller) controller.abort();
    const newController = new AbortController();
    setController(newController);
    const signal = newController.signal;

    // If there is text to translate
    if (inputText.length !== 0) {
      if (attachedGlossary) {
        toast.error('Glossary files are not allowed with text translations');
        return;
      }

      setIsTranslating(true);

      const params = new URLSearchParams();
      if (sourceLangName) params.append('source_language', sourceLangName);
      params.append('target_language', targetLangName);
      params.append('text', inputText);

      try {
        const apiUrl =
          apiMode === 'azure'
            ? endpoints.translations.translateAzureText
            : endpoints.translations.translateDeeplText;
        const requestBody = {
          text: inputText,
          target_language: targetLangName,
          source_language: sourceLangName || undefined,
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer A7x!G2p@Q9#L`,
          },
          body: JSON.stringify(requestBody),
          signal,
        });

        if (response.ok) {
          const responseData = await response.json();
          const translatedText =
            apiMode === 'azure'
              ? responseData[0]?.translations[0]?.text
              : responseData.translated_text;
          if (translatedText) {
            setTranslatedText(translatedText);
            setShowTranslatedText(true);

            // log text translation
            const logFormData = new FormData();
            logFormData.append('user', name);
            logFormData.append('source_text', inputText);
            logFormData.append('translated_text', translatedText);
            logFormData.append('source_language', sourceLangName);
            logFormData.append('target_language', targetLangName);
            logFormData.append('character_count', translatedText.length);
            logFormData.append('vendor', apiMode);

            axios
              .post(endpoints.log.textTranslation, logFormData)
              .then(() => console.log('Text translation logged'))
              .catch((err) => console.log(err));
          } else {
            toast.error('Translation Failed');
          }
        } else {
          const errorResponseText = await response.text();
          toast.error(errorResponseText);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Translation request aborted');
        } else {
          console.error('Request error:', error.message);
          toast.error(error.message);
        }
      } finally {
        setIsTranslating(false);
      }
    }

    // If there are documents to translate
    if (inputText.length === 0 && attachedFiles.length > 0) {
      setIsTranslating(true); // Ensure this runs immediately

      const formData = new FormData();
      let totalFileSize = 0;
      const maxFileSize = 30 * 1024 * 1024; // 30MB in bytes

      if (attachedFiles.length > 1000) {
        toast.error('More than 1000 files are not allowed');
        setIsTranslating(false);
        return;
      }

      for (const file of attachedFiles) {
        if (file.size > maxFileSize) {
          toast.error(`File "${file.name}" exceeds the 30MB size limit`);
          setIsTranslating(false);
          return;
        }
        totalFileSize += file.size;
        if (totalFileSize >= 250 * 1024 * 1024) {
          toast.error('Files should not exceed a total of 250MB');
          setIsTranslating(false);
          return;
        }
        formData.append('file', file);
      }

      if (attachedGlossary) {
        formData.append('glossary_file', attachedGlossary);
      }

      if (apiMode === 'azure') {
        formData.append('source_language', sourceLangName);
        formData.append('target_language', targetLangName);
      }

      if (apiMode !== 'azure') {
        formData.append('source_lang', sourceLangName);
        formData.append('target_lang', targetLangName);
        formData.append('formality', formality.value);
      }

      try {
        if (apiMode === 'azure') {
          try {
            // Submit the job
            const response = await axios.post(
              endpoints.translations.getAzureDocs,
              formData,
              {
                signal,
                headers: {
                  Authorization: `Bearer A7x!G2p@Q9#L`,
                },
              }
            );
            const jobId = response.data.job_id;
            const targetContainerName =
              response.data['destination container name'];

            const formData2 = new FormData();
            formData2.append('job_id', jobId);
            formData2.append('target_container_name', targetContainerName);

            // Start polling for job status
            const intervalId = setInterval(async () => {
              try {
                const statusResponse = await axios.post(
                  endpoints.translations.getAzureDocsStatus,
                  formData2,
                  {
                    signal,
                    headers: {
                      Authorization: `Bearer A7x!G2p@Q9#L`,
                    },
                  }
                );
                const statusData = statusResponse.data;

                if (statusData.status === 'Succeeded') {
                  clearInterval(intervalId);
                  setTranslatedFiles(statusData.sas_data);
                  setShowTranslatedFiles(true);
                  setIsTranslating(false); // Only set false after success

                  statusData?.sas_data.forEach((data) => {
                    // log docs translation
                    const logFormData = new FormData();
                    logFormData.append('user', name);
                    logFormData.append('document_name', data.file_name);
                    logFormData.append('source_language', sourceLangName);
                    logFormData.append('target_language', targetLangName);
                    logFormData.append('character_count', 0);
                    logFormData.append('size_of_the_document', 0);
                    logFormData.append('vendor', apiMode);

                    axios
                      .post(endpoints.log.docsTranslation, logFormData)
                      .then(() => console.log('Docs translation logged'))
                      .catch((err) => console.log(err));
                  });
                } else if (
                  statusData.status === 'Failed' ||
                  statusData.status === 'Cancelled'
                ) {
                  clearInterval(intervalId);
                  toast.error('Translation job failed or was cancelled.');
                  setIsTranslating(false); // Set false only after confirmed failure
                }
              } catch (error) {
                // Keep polling for status unless error specifically ends it
                clearInterval(intervalId);
                toast.error('Error checking translation status');
                setIsTranslating(false); // Only set false if polling encounters an error
              }
            }, 5000); // Poll every 5 seconds
          } catch (error) {
            // Handle initial job submission error
            console.error('Error submitting translation job:', error);
            // toast.error('Something went wrong');
            setIsTranslating(false); // Set false if job submission fails
          }
        } else {
          try {
            const res = await axios.post(
              endpoints.translations.getDeeplDocs,
              formData,
              {
                signal,
                headers: {
                  Authorization: `Bearer A7x!G2p@Q9#L`,
                },
              }
            );

            const docRefs = res.data.documents;
            const results = [];
            let docsProcessed = 0;

            setTranslatedFiles([]);

            // Start polling for job status
            const intervalId = setInterval(async () => {
              try {
                const statusResponse = await axios.post(
                  endpoints.translations.getDeeplCheckDocsStatus,
                  docRefs,
                  {
                    signal,
                    headers: {
                      Authorization: `Bearer A7x!G2p@Q9#L`,
                    },
                  }
                );
                const statusDataArray = statusResponse.data;

                statusDataArray.forEach((statusData) => {
                  console.log('\nTRYING... ', statusData, statusData.status);

                  if (statusData.status === 'done') {
                    // Check if this document has already been processed
                    if (
                      !results.some(
                        (doc) => doc?.document_id === statusData?.document_id
                      )
                    ) {
                      results.push(statusData);
                      docsProcessed++;
                    }
                  } else if (statusData.status === 'queued') {
                    console.log('status -- ', docsProcessed, statusData.status);
                  } else if (statusData.status === 'translating') {
                    console.log('status -- ', docsProcessed, statusData.status);
                  }
                });

                console.log('results: ', results);

                if (docsProcessed === docRefs.length) {
                  console.log('Processing completed');
                  clearInterval(intervalId);

                  for (const result of results) {
                    const docFormData = new FormData();
                    docFormData.append('document_key', result.document_key);
                    docFormData.append('document_id', result.document_id);
                    docFormData.append('file_name', result.file_name);

                    const fileResponse = await axios.post(
                      endpoints.translations.getDeeplDocsStatus,
                      docFormData,
                      {
                        signal,
                        headers: {
                          Authorization: `Bearer A7x!G2p@Q9#L`,
                        },
                      }
                    );

                    // log docs translation
                    const logFormData = new FormData();
                    logFormData.append('user', name);
                    logFormData.append(
                      'document_name',
                      fileResponse.data.sas_data[0].file_name
                    );
                    logFormData.append('source_language', sourceLangName);
                    logFormData.append('target_language', targetLangName);
                    logFormData.append('character_count', 0);
                    logFormData.append('size_of_the_document', 0);
                    logFormData.append('vendor', apiMode);

                    axios
                      .post(endpoints.log.docsTranslation, logFormData)
                      .then(() => console.log('Docs translation logged'))
                      .catch((err) => console.log(err));

                    setTranslatedFiles((prev) => [
                      ...prev,
                      fileResponse.data.sas_data[0],
                    ]);
                  }

                  setShowTranslatedFiles(true);
                  setIsTranslating(false);
                }
              } catch (error) {
                console.log('error: ', error);
                clearInterval(intervalId);
                toast.error('Error checking translation status');
                setIsTranslating(false);
              }
            }, 5000); // Poll every 5 seconds
          } catch (error) {
            console.log('Error: ', error);
            toast.error(error.response.data.error);
            setIsTranslating(false);
          }
        }
      } catch (error) {
        console.error('Error in document translation:', error);
        toast.error('Something went wrong');
        setIsTranslating(false);
      }
    }
  };

  const handleCancel = () => {
    setIsTranslating(false);
    if (controller) {
      controller.abort();
      console.log('Translation aborted');
    }
    toast('Translation Canceled', { icon: 'ℹ️' });
  };

  useEffect(() => {
    return () => {
      if (controller) controller.abort();
    };
  }, [controller]);

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setSourceLang(null);
    setTargetLang(null);
    setFormality(null);
    setAttachedFiles([]);
    setAttachedGlossary(null);
    setCopied(false);
    setThumbsUpClicked(false);
    setThumbsDownClicked(false);
    setFeedbackOption('');
    setCustomFeedback('');
    setFeedbackSubmitted(false);
    setTranslatedFiles([]);
    setIsAllDownloaded(false);

    setValidationErrors({});
    setFileErrors({
      attachFiles: '',
      attachGlossary: '',
    });
  };

  const handleInputTextChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);
    setDeepLTargetLanguages(deeplTargetLangs);

    // Clear the attached files and translated files when switching to text input
    setAttachedFiles([]);
    setAttachedGlossary(null);
    setTranslatedFiles([]);

    if (fileErrors.attachFiles || fileErrors.attachGlossary) {
      setFileErrors({
        attachFiles: '',
        attachGlossary: '',
      });
    }
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files); // Get the new files
    const allFiles = [...attachedFiles, ...newFiles]; // Merge existing and new files

    // Define allowed extensions based on the current API mode
    const allowedExtensions =
      apiMode === 'deepl' ? allowedFileTypes.deepl : allowedFileTypes.azure;

    // Separate supported and unsupported files
    const supportedFiles = allFiles.filter((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      return allowedExtensions.includes(extension);
    });

    const unsupportedFiles = allFiles.filter((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      return !allowedExtensions.includes(extension);
    });

    // Handle unsupported files
    if (unsupportedFiles.length > 0) {
      setFileErrors((prev) => ({
        ...prev,
        attachFiles: '*Unsupported file format detected',
      }));

      toast.error(
        `Removed files with .${unsupportedFiles
          .map((file) => file.name.split('.').pop().toLowerCase())
          .join(', ')} extensions`
      );
    } else {
      setFileErrors((prev) => ({ ...prev, attachFiles: '' }));
    }

    // Update with only supported files
    setAttachedFiles(supportedFiles);
    setInputText('');
    setTranslatedFiles([]);
    setShowTranslatedText(false);
    setTranslatedText('');
    event.target.value = null;
  };

  const handleGlossaryChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!['xls', 'xlsx', 'csv', 'tsv'].includes(extension)) {
        setFileErrors((prev) => ({
          ...prev,
          attachGlossary: '*Unsupported Glossary File',
        }));
      } else {
        setFileErrors((prev) => ({ ...prev, attachGlossary: '' }));
        setAttachedGlossary(file);
        setShowTranslatedText(false);
      }
    }
    event.target.value = null;
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeGlossary = () => {
    setAttachedGlossary(() => null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = (translatedFiles, apiMode) => {
    const result = downloadAllAzureFiles(translatedFiles, apiMode);
    console.log('delete status: ', result);
    setIsAllDownloaded(true);
  };

  const handleThumbsUpText = () => {
    setThumbsUpClickedText(true);
    setThumbsDownClickedText(false);
  };

  const handleThumbsDownText = () => {
    setThumbsDownClickedText(true);
    setThumbsUpClickedText(false);
  };

  const submitFeedback = async ({ type, value }) => {
    let payload =
      type === 'text'
        ? {
            user_name: name,
            feedback_text: value,
            source_language: sourceLang.value,
            target_language: targetLang.value,
            source_text: inputText,
            translated_text: translatedText,
            vendor: `${apiMode} Translator`,
          }
        : {
            user_name: name,
            feedback_text: value,
            source_language: sourceLang.value,
            target_language: targetLang.value,
            document_name: attachedFiles[0].name,
            vendor: `${apiMode} Translator`,
          };

    try {
      const res = await axios.post(endpoints.feedback.feedbackAdd, payload);
      if (res.status === 201) {
        toast.success('Feedback received');
        handleThumbsDownText(true);
      }
    } catch (error) {
      console.log(error.response);
      toast.error('Failed to send feedback');
    }
  };

  const addContext = async () => {
    console.log('context submitted:', contextText);

    try {
      const res = await axios.post(
        `https://f4a7-115-111-223-98.ngrok-free.app/refine`, // change the url with endpoint
        {
          translated_text: translatedText,
          context: contextText,
          translated_language: targetLang?.label,
          context_language: sourceLang?.label,
        }
      );

      console.log('RESPONSE AFTER ADDING CONTEXT: ', res);

      if (res.status === 200) {
        setTranslatedText(res.data);
        toast.success('Translation updated based on context');
      }

      setContextText('');
    } catch (error) {
      console.log(error.response);
    }
  };

  // New function to handle focus
  const handleFocus = (field) => {
    setValidationErrors((prev) => ({ ...prev, [field]: '' }));
  };

  useEffect(() => {
    if (translatedFiles || translatedText) {
      setTranslatedFiles([]);
      setTranslatedText('');
    }

    // if toggled to deepl, input files should be filtered
    if (apiMode === 'deepl') {
      setAttachedFiles(
        attachedFiles.filter((file) => {
          if (
            allowedFileTypes.deepl.indexOf(
              file.name.split('.').pop().toLowerCase()
            ) === -1
          ) {
            return false;
          }
          return true;
        })
      );
    } else {
      setAttachedFiles(
        attachedFiles.filter((file) => {
          if (
            allowedFileTypes.deepl.indexOf(
              file.name.split('.').pop().toLowerCase()
            ) === -1
          ) {
            return false;
          }
          return true;
        })
      );
    }
  }, [apiMode]);

  return (
    <div className='flex items-center justify-center min-h-full'>
      <div className='w-full max-w-[960px] min-h-[500px] p-4 md:px-16 my-[30px] rounded-lg bg-[#ffffff] shadow-md'>
        {/* API Toggle Switch */}
        <div
          title='Change translation service'
          className='flex items-center justify-center p-2 mb-4 mt-4'
        >
          <span className='mr-2 text-left text-xl font-semibold'>Azure AI</span>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              id='modelChecked'
              name='modelChecked'
              type='checkbox'
              className='sr-only'
              checked={apiMode === 'azure'}
              onChange={handleToggle}
            />
            <div className='w-14 h-7 bg-[#FCBC19] rounded-full shadow-inner'></div>
            <div
              className={`dot absolute w-6 h-6 border-2 border-slate-900   bg-white rounded-full shadow transition-transform ${
                apiMode !== 'azure' ? 'translate-x-7' : 'translate-x-0'
              }`}
            ></div>{' '}
            {/* Increased size */}
          </label>
          <span className='ml-2 text-right text-xl font-semibold'>
            DeepL <span className='text-sm text-zinc-400'></span>
          </span>
        </div>

        {/* Text/File input area */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className='relative w-full border border-zinc-400 rounded-md'
        >
          <div
            className='w-full p-4 rounded-md mb-4'
            style={{
              minHeight: '140px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {attachedFiles &&
              attachedFiles.map((file, index) => (
                <AttachedFileItem
                  key={index}
                  file={file}
                  index={index}
                  removeFile={removeFile}
                />
              ))}

            <textarea
              value={inputText}
              onChange={handleInputTextChange}
              placeholder={
                attachedFiles.length > 0
                  ? ''
                  : 'Enter text or attach document(s)'
              }
              className='w-full h-full bg-transparent border-none focus:outline-none resize-none'
              rows={7}
              disabled={attachedFiles.length > 0}
            />
          </div>

          <div className='flex justify-end gap-2 p-4 pt-0'>
            {/* {inputText.length > 0 ? (
              <button
                onClick={() => {
                  console.log('click context bulb');
                  setIsContextModalOpen(true);
                }}
              >
                <TbBulb className='text-gray-600' size={24} />
              </button>
            ) : null} */}
            <div
              title='Attach document for translation'
              className='flex items-center'
            >
              <input
                name='file'
                type='file'
                onChange={handleFileChange}
                multiple
                className='hidden'
                id='attach-files'
              />
              <label
                htmlFor='attach-files'
                className={`cursor-${
                  isTranslating ? 'not-allowed' : 'pointer'
                } ${isTranslating ? 'opacity-50' : ''}`}
              >
                <FaPaperclip className='text-gray-600' size={20} />
              </label>
            </div>

            {attachedFiles.length > 0 ? (
              <div title='Attach glossary file' className='flex items-center'>
                <input
                  type='file'
                  name='file'
                  onChange={handleGlossaryChange}
                  className='hidden'
                  id='attach-glossary'
                  multiple
                />
                <label
                  htmlFor='attach-glossary'
                  className={`cursor-${
                    isTranslating ? 'not-allowed' : 'pointer'
                  } ${isTranslating ? 'opacity-50' : ''}`}
                >
                  <FaBook className='text-gray-600' size={20} />
                </label>
              </div>
            ) : null}
          </div>

          {attachedGlossary && (
            <div className='absolute bottom-8 right-4 flex items-center bg-green-200 rounded-md p-1 mt-2'>
              Glossary:{' '}
              <span className='ml-2 mr-2 font-semibold'>
                {attachedGlossary.name}
              </span>
              <button onClick={removeGlossary} className='text-red-500'>
                <FaRegTimesCircle />
              </button>
            </div>
          )}

          <div className='absolute bottom-12 right-0 mb-4 mr-2'>
            {fileErrors.attachFiles && (
              <div className='text-red-500 text-l'>
                {fileErrors.attachFiles}
              </div>
            )}
            {fileErrors.attachGlossary && (
              <div className='text-red-500 text-l'>
                {fileErrors.attachGlossary}
              </div>
            )}
          </div>
        </div>

        <div className='my-2'>
          {validationErrors.inputText && (
            <div className='text-red-500 text-l'>
              {validationErrors.inputText}
            </div>
          )}
        </div>

        {/* {isContextModalOpen && (
          <ContextModal
            isOpen={isContextModalOpen}
            contextText={contextText}
            setContextText={setContextText}
            setIsModalOpen={setIsContextModalOpen}
            submitContext={addContext}
          />
        )} */}

        {/* Choose languages and Buttons */}
        <div
          className={`md:flex gap-4 items-center mb-4 ${
            apiMode !== 'azure' ? 'flex-col justify-start' : ''
          }`}
        >
          <div
            className={`sm:flex grow md:space-x-2 space-y-4 md:space-y-0 ${
              apiMode !== 'azure' ? 'w-full' : ''
            }`}
          >
            {/* source language */}
            <div className='w-full'>
              <Select
                value={sourceLang}
                onChange={(lang) => {
                  setSourceLang(lang);
                  handleFocus('sourceLang'); // Clear error on focus
                }}
                options={apiMode === 'azure' ? languages : deepLSourceLanguages}
                placeholder='Select source language'
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: 'gray',
                    '&:hover': { borderColor: 'blue' },
                    width: '100%',
                  }),
                  option: (provided) => ({
                    ...provided,
                    textAlign: 'left',
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    textAlign: 'left',
                  }),
                }}
              />
              {validationErrors.sourceLang && (
                <div className='text-red-500 text-l'>
                  {validationErrors.sourceLang}
                </div>
              )}
            </div>
            <div className='hidden md:flex items-center'>
              <FaArrowRight className='h-6 w-6' />
            </div>

            {/* target languages */}
            <div className='w-full'>
              <Select
                value={targetLang}
                onChange={(lang) => {
                  setTargetLang(lang);
                  handleFocus('targetLang'); // Clear error on focus
                }}
                options={apiMode === 'azure' ? languages : deepLTargetLanguages}
                placeholder='Select target language'
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: 'gray',
                    '&:hover': { borderColor: 'blue' },
                    width: '100%',
                  }),
                  option: (provided) => ({
                    ...provided,
                    textAlign: 'left',
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    textAlign: 'left',
                  }),
                }}
              />
              {validationErrors.targetLang && (
                <div className='text-red-500 text-l'>
                  {validationErrors.targetLang}
                </div>
              )}
            </div>

            {apiMode !== 'azure' ? (
              <div className='w-full'>
                <Select
                  value={formality}
                  onChange={(f) => {
                    setFormality(f);
                    setValidationErrors((errors) => {
                      return {
                        ...errors,
                        formality: null,
                      };
                    });
                  }}
                  options={[
                    {
                      value: 'prefer_more',
                      label: 'More Formal',
                    },
                    {
                      value: 'prefer_less',
                      label: 'Less Formal',
                    },
                    {
                      value: 'default',
                      label: 'Default',
                    },
                  ]}
                  placeholder='Select formality'
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: 'gray',
                      '&:hover': { borderColor: 'blue' },
                      width: '100%',
                    }),
                    option: (provided) => ({
                      ...provided,
                      textAlign: 'left',
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      textAlign: 'left',
                    }),
                  }}
                />
                {validationErrors.formality && (
                  <div className='text-red-500 text-l'>
                    {validationErrors.formality}
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/*  action buttons */}
          <div className='flex gap-4 mt-4 md:mt-0'>
            {/* Clear All Button */}
            <button
              title='Clear all fields'
              onClick={handleClear}
              type='button'
              className={`px-4 py-2 rounded-md text-black ${
                inputText ||
                translatedText ||
                attachedFiles.length > 0 ||
                fileErrors.attachFiles ||
                fileErrors.attachGlossary
                  ? 'bg-red-400 text-white'
                  : 'bg-white border border-gray-500'
              } cursor-${isTranslating ? 'not-allowed' : 'pointer'} ${
                isTranslating ? 'opacity-50' : ''
              }`}
            >
              Clear All
            </button>

            {/* Translate Button */}
            <button
              title='Translate text or attached document'
              onClick={handleTranslate}
              className={`px-4 py-2 rounded-md text-white ${
                inputText || attachedFiles.length > 0
                  ? 'bg-blue-500'
                  : 'bg-gray-400'
              } cursor-${isTranslating ? 'not-allowed' : 'pointer'} ${
                isTranslating ? 'opacity-50' : ''
              }`}
              disabled={isTranslating}
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>

            {/* Cancel Translation Button */}
            {isTranslating && (
              <button
                onClick={handleCancel}
                className='px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200'
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {isTranslating ? <ResultShimmer /> : null}

        {/* Text Translation Result */}
        {showTranslatedText && translatedText && (
          <div>
            <textarea
              value={translatedText}
              readOnly
              className='w-full p-3 border rounded-md mb-4 bg-gray-100'
              rows='7'
              onFocus={() => handleFocus('translatedText')} // Clear error on focus
            />
            <div className='flex justify-between items-center mb-4'>
              <div className='flex items-center space-x-2'>
                <span className='mr-2 text-gray-600'>
                  Rate this translation:
                </span>

                {/* like  */}
                <button
                  onClick={handleThumbsUpText}
                  className={`text-black ${
                    thumbsUpClickedText ? 'text-blue-500' : ''
                  }`}
                >
                  <TiThumbsUp size={30} />
                </button>

                {/* dislike */}
                <button
                  onClick={() => setIsModalOpen(true)} // Open modal for feedback
                  className={`text-black ${
                    thumbsDownClickedText ? 'text-red-500' : ''
                  }`}
                >
                  <TiThumbsDown size={30} />
                </button>
              </div>
              <div className='flex items-center p-2 mb-2'>
                {copied && (
                  <span className='text-green-500 font-semibold text-center'>
                    Copied!
                  </span>
                )}
                <button
                  onClick={handleCopy}
                  className='flex flex-col items-center p-2 text-blue-500'
                >
                  <FaCopy size={20} />
                </button>
              </div>
            </div>

            {/* Feedback Modal for Text Translation */}
            {isModalOpen && (
              <FeedbackModal
                mode={'text'}
                submitFeedback={submitFeedback}
                setIsModalOpen={setIsModalOpen}
              />
            )}
          </div>
        )}

        {/* Docs Translation Result */}
        {showTranslatedFiles && translatedFiles.length > 0 && (
          <>
            <TranslatedFilesResult
              isAllDownloaded={isAllDownloaded}
              openFeedbackModal={openFeedbackModal}
              translatedFiles={translatedFiles}
            />
            {translatedFiles.length > 1 ? (
              <div className='my-4 flex justify-center'>
                {/* download for both azure and deepl */}
                <button
                  onClick={() => {
                    handleDownloadAll(translatedFiles, apiMode);
                    setIsDownloaded(true);
                  }}
                  disabled={isDownloaded}
                  className={`bg-green-500 text-white flex items-center w-fit rounded px-4 py-2 ${
                    isDownloaded ? 'opacity-50' : 'opacity-100'
                  } cursor-${isDownloaded ? 'not-allowed' : 'pointer'}`}
                >
                  <FaDownload className='mr-2' />
                  Download All
                </button>
              </div>
            ) : null}

            {/* Feedback Modal for Docs*/}
            {isModalOpen && (
              <FeedbackModal
                mode={'docs'}
                setIsModalOpen={setIsModalOpen}
                submitFeedback={submitFeedback}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default workingui;

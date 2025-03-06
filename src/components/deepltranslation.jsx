import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import WorldFlag from 'react-world-flags';
import {
  FaPaperclip,
  FaBook,
  FaThumbsUp,
  FaThumbsDown,
  FaCopy,
  FaTimes,
  FaArrowRight,
  FaRegTimesCircle,
  FaDownload,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import '../Transpage.css';
import { CheckIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { TiThumbsUp, TiThumbsDown } from 'react-icons/ti';
import WordImg from '../assets/wordimg.png';
import PdfImg from '../assets/pdfimg.png';
import ExcelImg from '../assets/excelimg.png';
import PptImg from '../assets/pptimg.png';

const Deepltranslation = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState(null);
  const [targetLang, setTargetLang] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [attachedGlossary, setAttachedGlossary] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);
  const [feedbackOption, setFeedbackOption] = useState('');
  const [customFeedback, setCustomFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [showTranslatedText, setShowTranslatedText] = useState(true);
  const [showTranslatedFiles, setShowTranslatedFiles] = useState(true);
  const [translatedFiles, setTranslatedFiles] = useState([]);

  // States for text translation feedback
  const [thumbsUpClickedText, setThumbsUpClickedText] = useState(false);
  const [thumbsDownClickedText, setThumbsDownClickedText] = useState(false);
  const [feedbackOptionText, setFeedbackOptionText] = useState('');
  const [customFeedbackText, setCustomFeedbackText] = useState('');
  const [feedbackSubmittedText, setFeedbackSubmittedText] = useState(false);

  // States for document translation feedback
  const [thumbsUpClickedDoc, setThumbsUpClickedDoc] = useState(false);
  const [thumbsDownClickedDoc, setThumbsDownClickedDoc] = useState(false);
  const [feedbackOptionDoc, setFeedbackOptionDoc] = useState('');
  const [customFeedbackDoc, setCustomFeedbackDoc] = useState('');
  const [feedbackSubmittedDoc, setFeedbackSubmittedDoc] = useState(false);
  const [toggle, setToggle] = useState(true); // true for Text1, false for Text2
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [thumbsDownClickedState, setThumbsDownClickedState] = useState(
    Array(translatedFiles.length).fill(false)
  );
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const openFeedbackModal = (fileName, index) => {
    setSelectedFileName(fileName);
    setIsModalOpen(true);

    setFeedbackSubmitted(false); // Reset feedback submitted state
    setSelectedIndex(index); // Store the index for thumbs down state
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFeedbackOption('');
    setCustomFeedback('');
    setFeedbackSubmitted(false);
  };

  const handleToggle = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const [fileErrors, setFileErrors] = useState({
    attachFiles: '',
    attachGlossary: '',
  });
  // const [translatedFiles, setTranslatedFiles] = useState([]);

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
          ...languageOptions.filter((lang) => lang.value !== 'EN'),
        ];
        setLanguages(sortedLanguages);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };
    fetchLanguages();
  }, []);

  // Handle text translation
  const handleTranslate = async () => {
    const errors = {};

    if (!targetLang) errors.targetLang = '*Please select a target language.';
    if (!inputText.trim() && attachedFiles.length === 0)
      errors.inputText = 'Please enter text or attach files.';

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return; // Stop if there are validation errors

    const sourceLangName = sourceLang?.label;
    const targetLangName = targetLang?.label;

    console.log('Source Language Name:', sourceLangName);
    console.log('Target Language Name:', targetLangName);

    setIsTranslating(true);

    const newTranslatedFiles = attachedFiles.map((file) => ({
      source: file.name,
      translated: `Translated content for ${file.name}`, // Simulated translation result
      status: 'completed',
    }));
    setTranslatedFiles(newTranslatedFiles);

    if (inputText) {
      // Prepare request body for DeepL API
      const requestBody = {
        text: inputText,
        target_language: targetLangName,
        source_language: sourceLangName || undefined, // Send undefined if sourceLangName is not set
      };

      console.log('Request Body for DeepL:', requestBody);

      try {
        const response = await fetch(
          'https://devaiwebfunctions-evaffrf2behvf8hf.eastus2-01.azurewebsites.net/translate',
          {
            method: 'POST', // Change method to POST
            headers: {
              'Content-Type': 'application/json', // Set content type to JSON
              Accept: 'application/json',
            },
            body: JSON.stringify(requestBody), // Send the request body
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          console.log('Full DeepL API response:', responseData);
          const translatedText = responseData.translated_text; // Adjust according to your response structure

          if (translatedText) {
            console.log('Translated text:', translatedText);
            setTranslatedText(translatedText);
          } else {
            console.error('Translation failed, no text returned.');
          }
        } else {
          const errorResponseText = await response.text();
          console.error(
            'Error in response:',
            response.status,
            response.statusText,
            errorResponseText
          );
        }
      } catch (error) {
        console.error('Request error:', error.message);
      }
    } else {
      console.error('No input text provided for translation.');
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setSourceLang(null);
    setTargetLang(null);
    setAttachedFiles([]);
    setAttachedGlossary(null);
    setCopied(false);
    setThumbsUpClicked(false);
    setThumbsDownClicked(false);
    setFeedbackOption('');
    setCustomFeedback('');
    setFeedbackSubmitted(false);
    setTranslatedFiles([]);

    setValidationErrors({});
    setFileErrors({
      attachFiles: '',
      attachGlossary: '',
    });

    setShowTranslatedText(true);
    setShowTranslatedFiles(true);
  };

  const handleInputTextChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);

    // Clear the attached files and translated files when switching to text input
    setAttachedFiles([]);
    setAttachedGlossary(null);
    setTranslatedFiles([]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const unsupportedFiles = files.filter((file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      return ![
        'pdf',
        'ppt',
        'pptx',
        'xls',
        'xlsx',
        'csv',
        'doc',
        'docx',
      ].includes(extension);
    });

    if (unsupportedFiles.length > 0) {
      setFileErrors((prev) => ({
        ...prev,
        attachFiles: '*Unsupported File format',
      }));
    } else {
      setFileErrors((prev) => ({ ...prev, attachFiles: '' }));
      setAttachedFiles(files);
      setInputText('');
      setTranslatedFiles([]);
      setShowTranslatedText(false);
      setTranslatedText('');
    }
  };

  const handleGlossaryChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!['xls', 'xlsx', 'csv'].includes(extension)) {
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
  };

  const handleInputTextFocus = () => {
    setShowTranslatedFiles(false); // Hide the translated files table when input text area is focused
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeGlossary = () => {
    setAttachedGlossary(null);
  };

  const getDisplayText = () => {
    const allFiles = [...attachedFiles];
    return allFiles.map((file) => file.name).join(', ');
  };

  const customOption = (option) => (
    <div className='flex items-center'>
      <WorldFlag
        code={option.value}
        style={{ width: '20px', height: '15px', marginRight: '8px' }}
      />
      {option.label}
    </div>
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThumbsUp = () => {
    setThumbsUpClicked(true);
    setThumbsDownClicked(false);
    setFeedbackOption('');
    setCustomFeedback('');
  };

  const handleThumbsDown = () => {
    setThumbsDownClicked(true);
    setThumbsUpClicked(false);
  };

  const handleFeedbackChange = (event) => {
    setFeedbackOption(event.target.value);
    if (event.target.value !== 'Other') {
      setCustomFeedback('');
    }
  };

  const handleCustomFeedbackChange = (event) => {
    setCustomFeedback(event.target.value);
  };

  const submitFeedback = async () => {
    try {
      const feedbackData = {
        option: feedbackOption,
        custom: customFeedback,
      };
      // await axios.post("YOUR_BACKEND_API_URL/feedback", feedbackData);

      setFeedbackSubmitted(true);
      setTimeout(() => {
        setFeedbackSubmitted(false);
        setThumbsDownClickedState((prev) => {
          const newClicked = [...prev];
          newClicked[selectedIndex] = true; // Set thumbs down for the specific file
          return newClicked;
        });
      }, 2000);

      setFeedbackOption('');
      setCustomFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  const downloadAllFiles = () => {
    translatedFiles.forEach((file) => {
      if (file.status === 'completed') {
        downloadFile(file.translated);
      }
    });
  };

  // New function to handle focus
  const handleFocus = (field) => {
    setValidationErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'pdf':
        return PdfImg;
      case 'doc':
      case 'docx':
        return WordImg;
      case 'ppt':
      case 'pptx':
        return PptImg;
      case 'xls':
      case 'xlsx':
        return ExcelImg;
      default:
        return 'path/to/unknown-icon.png';
    }
  };

  //Text & Doc seprate
  // Handlers for text translation feedback
  const handleThumbsUpText = () => {
    setThumbsUpClickedText(true);
    setThumbsDownClickedText(false);
  };

  const handleThumbsDownText = () => {
    setThumbsUpClickedText(false);
    setThumbsDownClickedText(true);
  };

  const handleFeedbackChangeText = (e) => {
    setFeedbackOptionText(e.target.value);
  };

  const handleCustomFeedbackChangeText = (e) => {
    setCustomFeedbackText(e.target.value);
  };

  const submitFeedbackText = () => {
    setFeedbackSubmittedText(true);
  };

  // Handlers for document translation feedback
  const handleThumbsUpDoc = () => {
    setThumbsUpClickedDoc(true);
    setThumbsDownClickedDoc(false);
  };

  const handleThumbsDownDoc = () => {
    setThumbsUpClickedDoc(false);
    setThumbsDownClickedDoc(true);
  };

  const handleFeedbackChangeDoc = (e) => {
    setFeedbackOptionDoc(e.target.value);
  };

  const handleCustomFeedbackChangeDoc = (e) => {
    setCustomFeedbackDoc(e.target.value);
  };

  const submitFeedbackDoc = () => {
    setFeedbackSubmittedDoc(true);
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='w-[800px] h-[500px] p-2 mt-[30px] bg-white'>
        {/* Toggle Switch */}
        <div className='flex items-center justify-center p-2 mb-4 mt-4'>
          <span className='mr-2 text-left text-xl font-semibold'>Azure</span>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only'
              checked={toggle}
              onChange={handleToggle}
            />
            <div className='w-14 h-7 bg-[#FCBC19] rounded-full shadow-inner'></div>
            <div
              className={`dot absolute w-6 h-6 border-2 border-slate-900   bg-white rounded-full shadow transition-transform ${
                toggle ? 'translate-x-7' : 'translate-x-0'
              }`}
            ></div>{' '}
            {/* Increased size */}
          </label>
          <span className='ml-2 text-right text-xl font-semibold'>Deepl</span>
        </div>

        <div className='relative'>
          <div
            className='w-full p-4 border border-gray-400 rounded-md mb-4'
            style={{
              minHeight: '140px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className='flex items-center bg-gray-200 rounded-md m-1 p-2'
              >
                <img
                  src={getFileIcon(file.name)}
                  alt={`${file.name} icon`}
                  className='h-[21px] '
                />
                <span className='mr-2 ml-1'>{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className='text-red-500'
                >
                  <FaRegTimesCircle />
                </button>
              </div>
            ))}

            <textarea
              value={inputText}
              // onChange={(e) => setInputText(e.target.value)}
              // onFocus={() => handleFocus("inputText")}
              onChange={handleInputTextChange}
              onFocus={handleInputTextFocus}
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

          <input
            type='file'
            onChange={handleFileChange}
            multiple
            className='hidden'
            id='attach-files'
          />
          <label
            htmlFor='attach-files'
            className='absolute bottom-3 right-12 cursor-pointer'
          >
            <FaPaperclip className='text-gray-600' size={20} />
          </label>

          <input
            type='file'
            onChange={handleGlossaryChange}
            className='hidden'
            id='attach-glossary'
          />
          <label
            htmlFor='attach-glossary'
            className='absolute bottom-3 right-4 cursor-pointer'
          >
            <FaBook className='text-gray-600' size={20} />
          </label>

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

        <div className='flex justify-between items-center mb-4'>
          <button
            onClick={handleClear}
            className={`px-4 py-2 rounded-md text-white ${
              inputText ||
              translatedText ||
              attachedFiles.length > 0 ||
              fileErrors.attachFiles ||
              fileErrors.attachGlossary
                ? 'bg-[#FCBC19] cursor-pointer'
                : 'bg-gray-400 cursor-default'
            }`}
          >
            Clear All
          </button>

          <div className='flex space-x-2'>
            <div className='w-15'>
              <Select
                value={sourceLang}
                onChange={(lang) => {
                  setSourceLang(lang);
                  handleFocus('sourceLang'); // Clear error on focus
                }}
                options={languages}
                placeholder='Select source language'
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: 'gray',
                    '&:hover': { borderColor: 'blue' },
                    width: '230px',
                  }),
                  option: (provided) => ({
                    ...provided,
                    textAlign: 'center',
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    textAlign: 'center',
                  }),
                }}
                formatOptionLabel={customOption}
              />
              {validationErrors.sourceLang && (
                <div className='text-red-500 text-l'>
                  {validationErrors.sourceLang}
                </div>
              )}
            </div>
            <div className='flex items-center'>
              <FaArrowRight className='h-6 w-6' />
            </div>
            <div className='w-15'>
              <Select
                value={targetLang}
                onChange={(lang) => {
                  setTargetLang(lang);
                  handleFocus('targetLang'); // Clear error on focus
                }}
                options={languages}
                placeholder='Select target language'
                styles={{
                  control: (provided) => ({
                    ...provided,
                    borderColor: 'gray',
                    '&:hover': { borderColor: 'blue' },
                    width: '230px',
                  }),
                  option: (provided) => ({
                    ...provided,
                    textAlign: 'center',
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    textAlign: 'center',
                  }),
                }}
                formatOptionLabel={customOption}
              />
              {validationErrors.targetLang && (
                <div className='text-red-500 text-l'>
                  {validationErrors.targetLang}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleTranslate}
            className={`px-4 py-2 rounded-md text-white ${
              inputText || attachedFiles.length > 0
                ? 'bg-blue-500'
                : 'bg-gray-400'
            }`}
            disabled={!inputText && attachedFiles.length === 0}
          >
            Translate
          </button>
        </div>

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
                <button
                  onClick={handleThumbsUpText}
                  className={`text-black ${
                    thumbsUpClickedText ? 'text-blue-500' : ''
                  }`}
                >
                  <TiThumbsUp size={30} />
                </button>
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

            <div className='mt-4'>
              {thumbsDownClickedText && (
                <div className='mt-4 border p-2 rounded'>
                  <h3 className='font-bold'>What went wrong?</h3>
                  <select
                    value={feedbackOptionText}
                    onChange={handleFeedbackChangeText}
                    className='my-2 block w-full'
                  >
                    <option value=''>Select feedback option</option>
                    <option value='Translation was incorrect'>
                      Translation was incorrect
                    </option>
                    <option value='Not accurate enough'>
                      Not accurate enough
                    </option>
                    <option value='Too literal'>Too literal</option>
                    <option value='Other'>Other</option>
                  </select>
                  {feedbackOptionText === 'Other' && (
                    <div>
                      <input
                        type='text'
                        placeholder='Please specify'
                        className='border border-gray-400 rounded-md p-1 mt-2 w-full'
                        value={customFeedbackText}
                        onChange={(e) => setCustomFeedbackText(e.target.value)}
                      />
                      <button
                        onClick={submitFeedback}
                        className='mt-2 bg-blue-500 text-white p-1 rounded'
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  {feedbackSubmittedText && (
                    <span className='text-green-500'>Feedback submitted!</span>
                  )}
                </div>
              )}
            </div>

            {/* Feedback Modal */}
            {isModalOpen && (
              <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <div className='bg-white p-4 rounded shadow-lg mt-20 border border-gray-300'>
                  <h3>Feedback for Translation</h3>
                  <select
                    value={feedbackOptionText}
                    onChange={(e) => setFeedbackOptionText(e.target.value)}
                    className='my-2 block w-full'
                  >
                    <option value=''>Select feedback option</option>
                    <option value='Translation was incorrect'>
                      Translation was incorrect
                    </option>
                    <option value='Not accurate enough'>
                      Not accurate enough
                    </option>
                    <option value='Too literal'>Too literal</option>
                    <option value='Other'>Other</option>
                  </select>
                  {feedbackOptionText === 'Other' && (
                    <div>
                      <input
                        type='text'
                        placeholder='Please specify'
                        className='border border-gray-400 rounded-md p-1 mt-2 w-full'
                        value={customFeedbackText}
                        onChange={(e) => setCustomFeedbackText(e.target.value)}
                      />
                      <button
                        onClick={submitFeedback}
                        className='mt-2 bg-blue-500 text-white p-1 rounded'
                      >
                        Submit
                      </button>
                    </div>
                  )}
                  {feedbackSubmittedText && (
                    <span className='text-green-500'>Feedback submitted!</span>
                  )}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className='mt-4 ml-2 mr-2 text-red-500'
                  >
                    X
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Render the table if there are translated files */}
        {showTranslatedFiles && translatedFiles.length > 0 && (
          <>
            <table className='min-w-full border-collapse border border-gray-300 mt-4'>
              <thead>
                <tr>
                  <th className='border border-gray-300 p-2'>File Name</th>
                  <th className='border border-gray-300 p-2'>Translated?</th>
                  <th className='border border-gray-300 p-2'>Action</th>
                  <th className='border border-gray-300 p-2'>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {translatedFiles.map((file, index) => (
                  <tr key={index}>
                    <td className='border border-gray-300 p-2'>
                      {file.source}
                    </td>
                    <td className='border border-gray-300 p-2'>
                      {file.status === 'completed' ? (
                        <CheckIcon className='h-6 w-6 text-green-600 mx-auto' />
                      ) : (
                        <FaTimes className='h-6 w-6 text-red-600 mx-auto' />
                      )}
                    </td>
                    <td className='border border-gray-300 p-2 flex justify-center space-x-2'>
                      <button
                        title='Download the translated document'
                        onClick={() => downloadFile(file.translated)} // Define downloadFile function
                        className='bg-blue-500 text-white rounded px-2 py-1'
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => downloadFile(file.translated)} // Define downloadFile function
                        className='bg-blue-500 text-white rounded px-2 py-1'
                      >
                        <FaExternalLinkAlt />
                      </button>
                    </td>
                    <td className='border border-gray-300 p-2'>
                      <div className='flex flex-col'>
                        <div className='flex justify-between items-center mb-4'>
                          <div className='flex items-center space-x-2'>
                            <span className='mr-2 text-gray-600'>
                              Rate this translation:
                            </span>
                            <button
                              onClick={() => handleThumbsUp(index)}
                              className={`text-black ${
                                thumbsUpClicked ? 'text-blue-500' : ''
                              }`}
                            >
                              <TiThumbsUp size={30} />
                            </button>
                            <button
                              onClick={() =>
                                openFeedbackModal(file.source, index)
                              }
                              className={`text-black ${
                                thumbsDownClickedState[index]
                                  ? 'text-red-500'
                                  : ''
                              }`}
                            >
                              <TiThumbsDown size={30} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='mt-4 flex justify-center'>
              <button
                title='Download All Files'
                onClick={downloadAllFiles} // Define downloadAllFiles function
                className='bg-green-500 text-white flex items-center w-48 rounded px-4 py-2'
              >
                <FaDownload className='mr-2' />
                Download All
              </button>
            </div>

            {/* Feedback Modal */}
            {isModalOpen && (
              <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                <div className='bg-white border border-gray-400 p-4 rounded shadow-lg mt-20'>
                  <h3>
                    Feedback for{' '}
                    <span className='text-green-800 font-bold'>
                      {selectedFileName}
                    </span>
                  </h3>
                  <select
                    value={feedbackOption}
                    onChange={(e) => setFeedbackOption(e.target.value)}
                    className='my-2 block w-full'
                  >
                    <option value=''>Select feedback option</option>
                    <option value='Translation was incorrect'>
                      Translation was incorrect
                    </option>
                    <option value='Not accurate enough'>
                      Not accurate enough
                    </option>
                    <option value='Too literal'>Too literal</option>
                    <option value='Other'>Other</option>
                  </select>
                  {feedbackOption === 'Other' && (
                    <div>
                      <input
                        type='text'
                        placeholder='Please specify'
                        className='border border-gray-400 rounded-md p-1 mt-2 w-full'
                        value={customFeedback}
                        onChange={(e) => setCustomFeedback(e.target.value)}
                      />
                    </div>
                  )}
                  <button
                    onClick={submitFeedback}
                    className='mt-2 bg-blue-500 text-white p-1 rounded'
                  >
                    Submit
                  </button>
                  {feedbackSubmitted && (
                    <span className='text-green-500 mt-2 block'>
                      Feedback submitted!
                    </span>
                  )}
                  <button
                    onClick={closeModal}
                    className='mt-4 mr-2 ml-2 text-red-500'
                  >
                    {' '}
                    <FaTimes />{' '}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* MIANDIVS */}
      </div>
    </div>
  );
};

export default Deepltranslation;

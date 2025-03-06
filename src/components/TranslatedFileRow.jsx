import { CheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { TiThumbsDown, TiThumbsUp } from 'react-icons/ti';
import { downloadDocument } from '../utils/downloadFiles';
import useApp from '../hooks/useApp';

const TranslatedFileRow = ({
  file,
  openFeedbackModal,
  translatedFiles,
  downloadLink,
  isAllDownloaded,
}) => {
  const [liked, setLiked] = useState(false);
  const { apiMode } = useApp();
  const [disliked, setDisliked] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const isAzure = apiMode === 'azure';

  const handleThumbsUp = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleThumbsDown = () => {
    setDisliked(true);
    if (liked) setLiked(false);
    openFeedbackModal(file);
  };

  const handleDownloadDeepL = () => {
    downloadDocument(file.sas_url, translatedFiles);
    setIsDownload(true);
  };

  const handleDownloadAzure = () => {
    downloadDocument(file.sas_url, translatedFiles);
    setIsDownload(true);
  };

  return (
    <tr>
      <td className='border border-gray-300 p-2'>
        {apiMode === 'azure'
          ? file?.file_name
          : file?.file_name.replace(/-\d+\./, '.')}
      </td>
      <td className='border border-gray-300 p-2'>
        <CheckIcon className='h-6 w-6 text-green-600 mx-auto' />
      </td>
      <td className='border border-gray-300 p-2 flex justify-center items-center space-x-2'>
        {isAzure ? (
          <button
            title='Download the translated document'
            onClick={handleDownloadAzure}
            disabled={isDownload || isAllDownloaded}
            className={`bg-blue-600 p-2 rounded-md text-white cursor-${
              isDownload || isAllDownloaded ? 'not-allowed' : 'pointer'
            } ${isDownload || isAllDownloaded ? 'opacity-50' : 'opacity-100'}`}
          >
            <FaDownload />
          </button>
        ) : (
          <button
            title='Download the translated document'
            onClick={handleDownloadDeepL}
            disabled={isDownload || isAllDownloaded}
            className={`bg-blue-600 p-2 rounded-md text-white cursor-${
              isDownload || isAllDownloaded ? 'not-allowed' : 'pointer'
            } ${isDownload || isAllDownloaded ? 'opacity-50' : 'opacity-100'}`}
          >
            <FaDownload />
          </button>
        )}
      </td>
      <td className='border border-gray-300 p-2'>
        <div className='flex flex-col'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex items-center space-x-2'>
              <span className='mr-2 text-gray-600'>Rate this translation:</span>
              <button
                title='This translation is good'
                onClick={handleThumbsUp}
                className={`text-black ${liked ? 'text-blue-500' : ''}`}
              >
                <TiThumbsUp size={30} />
              </button>
              <button
                title='This translation needs improvement'
                onClick={handleThumbsDown}
                className={`text-black ${disliked ? 'text-red-500' : ''}`}
              >
                <TiThumbsDown size={30} />
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

export default TranslatedFileRow;

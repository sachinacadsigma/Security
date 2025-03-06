import useApp from '../hooks/useApp';
import TranslatedFileRow from './TranslatedFileRow';

const TranslatedFilesResult = ({
  isAllDownloaded,
  translatedFiles,
  openFeedbackModal,
}) => {
  const { apiMode } = useApp();

  return (
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
        {apiMode === 'azure'
          ? translatedFiles.map((file) => (
              <TranslatedFileRow
                key={file}
                file={file}
                downloadLink={translatedFiles.sas_url}
                translatedFiles={translatedFiles}
                openFeedbackModal={openFeedbackModal}
                isAllDownloaded={isAllDownloaded}
              />
            ))
          : translatedFiles.map((file) => (
              <TranslatedFileRow
                key={file?.file_name}
                translatedFiles={translatedFiles}
                file={file}
                openFeedbackModal={openFeedbackModal}
                isAllDownloaded={isAllDownloaded}
              />
            ))}
      </tbody>
    </table>
  );
};

export default TranslatedFilesResult;

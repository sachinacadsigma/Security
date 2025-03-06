import { FaRegTimesCircle } from 'react-icons/fa';
import getFileIcon from '../utils/getFileIcon';

const AttachedFileItem = ({ file, index, removeFile }) => {
  return (
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
        title='Remove the attached document'
        onClick={() => removeFile(index)}
        className='text-red-500'
      >
        <FaRegTimesCircle />
      </button>
    </div>
  );
};

export default AttachedFileItem;

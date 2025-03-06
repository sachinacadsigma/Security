import { useState } from 'react';
import toast from 'react-hot-toast';

const FeedbackModal = ({ mode, submitFeedback, setIsModalOpen }) => {
  const [feedbackOptionText, setFeedbackOptionText] = useState('');
  const [customFeedbackText, setCustomFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleSubmit = () => {
    let feedbackValue = feedbackOptionText;

    if (feedbackOptionText === 'Other') {
      feedbackValue = customFeedbackText;
    }

    if (feedbackValue === '') {
      toast.error('Please select an option');
    } else {
      submitFeedback({
        type: mode,
        value: feedbackValue,
      });

      setFeedbackSubmitted(true);

      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='relative bg-white p-6 rounded-lg shadow-lg mt-20 border border-gray-300 w-full max-w-md mx-4'>
        {/* Close button at the top right */}
        <button
          onClick={() => setIsModalOpen(false)}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-200'
        >
          &#x2715; {/* Cross icon */}
        </button>

        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
          Feedback for Translation
        </h3>

        <select
          value={feedbackOptionText}
          onChange={(e) => setFeedbackOptionText(e.target.value)}
          className='my-2 block w-full border border-gray-300 rounded-md p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        >
          <option value=''>Select feedback option</option>
          <option value='Translation was incorrect'>
            Translation was incorrect
          </option>
          <option value='Not accurate enough'>Not accurate enough</option>
          <option value='Too literal'>Too literal</option>
          <option value='Other'>Other</option>
        </select>

        {feedbackOptionText === 'Other' && (
          <div className='mt-3'>
            <input
              id='custom-feedback'
              name='custom-feedback'
              type='text'
              placeholder='Please specify'
              className='border border-gray-300 rounded-md p-2 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={customFeedbackText}
              onChange={(e) => setCustomFeedbackText(e.target.value)}
            />
          </div>
        )}

        {feedbackSubmitted ? (
          <span className='text-green-500 block mt-4'>Feedback submitted!</span>
        ) : (
          <button
            onClick={handleSubmit}
            className='mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-md w-full transition duration-200'
          >
            Submit Feedback
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;

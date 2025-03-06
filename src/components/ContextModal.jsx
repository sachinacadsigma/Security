import { useState } from 'react';
import toast from 'react-hot-toast';

const ContextModal = ({
  isOpen,
  contextText,
  setContextText,
  setIsModalOpen,
  submitContext,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedContext, setSelectedContext] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('');
  const [domain, setDomain] = useState('');
  const [coherence, setCoherence] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const contextOptions = [
    'Casual conversation',
    'Business communication',
    'Legal/Official',
    'Marketing/Sales',
    'IT Technical',
    'Storytelling/Literary',
    'Financial',
    'Medical/Healthcare',
    'Other',
  ];

  const audienceOptions = [
    'Middle Schooler',
    'Job seeking applicants',
    'Other',
  ];

  const toneOptions = [
    'Formal (Professional, Corporate, Diplomatic)',
    'Neutral (Standard, Plain, Objective)',
    'Casual (Friendly, Conversational)',
    'Humorous (Playful, Witty)',
    'Persuasive (Marketing, Convincing)',
    'Serious (Strict, No-Nonsense)',
    'Other',
  ];

  const domainOptions = [
    'General',
    'Legal',
    'Medical',
    'Finance',
    'Technology/IT',
    'Education',
    'Engineering',
    'Marketing/Advertising',
    'Other',
  ];

  const coherenceOptions = [
    'Keep it the same (Literal translation)',
    'Make it more natural (Smooth and flowing)',
    'Make it shorter (Concise, to the point)',
    'Make it longer (More detailed, explanatory)',
    'Other',
  ];

  const isNextDisabled = () => {
    return (
      (activeTab === 0 &&
        (!selectedContext ||
          (selectedContext === 'Other' && !contextText.trim()))) ||
      (activeTab === 1 &&
        (!targetAudience ||
          (targetAudience === 'Other' && !contextText.trim()))) ||
      (activeTab === 2 &&
        (!tone || (tone === 'Other' && !contextText.trim()))) ||
      (activeTab === 3 &&
        (!domain || (domain === 'Other' && !contextText.trim()))) ||
      (activeTab === 4 &&
        (!coherence || (coherence === 'Other' && !contextText.trim())))
    );
  };

  const handleSubmit = () => {
    submitContext({
      context: selectedContext === 'Other' ? contextText : selectedContext,
      audience:
        targetAudience === 'Other'
          ? contextText
          : targetAudience || 'Not Specified',
      tone: tone === 'Other' ? contextText : tone || 'Not Specified',
      domain: domain === 'Other' ? contextText : domain || 'Not Specified',
      coherence:
        coherence === 'Other' ? contextText : coherence || 'Not Specified',
    });

    setSubmitted(true);

    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitted(false);
      setContextText('');
      setSelectedContext('');
      setTargetAudience('');
      setTone('');
      setDomain('');
      setCoherence('');
      setActiveTab(0);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='relative bg-white p-6 rounded-lg shadow-lg mt-20 border border-gray-300 w-full max-w-[480px] mx-4'>
        <button
          onClick={() => setIsModalOpen(false)}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-200'
        >
          &#x2715;
        </button>
        <h3 className='text-xl font-semibold text-gray-800 mb-4'>
          Add Context
        </h3>
        <div className='flex border-b mb-4'>
          {['Context', 'Audience', 'Tone', 'Domain', 'Coherence'].map(
            (tab, i) => (
              <button
                key={tab}
                type='button'
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-2 text-center ${
                  activeTab === i
                    ? 'border-b-2 border-blue-500 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {[
          contextOptions,
          audienceOptions,
          toneOptions,
          domainOptions,
          coherenceOptions,
        ].map(
          (options, i) =>
            activeTab === i && (
              <div key={i}>
                <label className='block text-gray-700 font-medium mb-1'>
                  {['Context', 'Audience', 'Tone', 'Domain', 'Coherence'][i]}
                </label>
                <select
                  value={
                    [selectedContext, targetAudience, tone, domain, coherence][
                      i
                    ]
                  }
                  onChange={(e) =>
                    [
                      setSelectedContext,
                      setTargetAudience,
                      setTone,
                      setDomain,
                      setCoherence,
                    ][i](e.target.value)
                  }
                  className='w-full border border-gray-300 rounded-md p-2'
                >
                  <option value=''>Select option</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {[selectedContext, targetAudience, tone, domain, coherence][
                  i
                ] === 'Other' && (
                  <textarea
                    value={contextText}
                    placeholder={`Type custom ${[
                      'Context',
                      'Audience',
                      'Tone',
                      'Domain',
                      'Coherence',
                    ][i].toLowerCase()}`}
                    onChange={(e) => setContextText(e.target.value)}
                    className='w-full border border-gray-300 rounded-md p-2 mt-2'
                    rows={4}
                  />
                )}
              </div>
            )
        )}

        <div className='flex justify-between mt-4'>
          {activeTab > 0 && (
            <button
              onClick={() => setActiveTab(activeTab - 1)}
              className='px-4 py-2 bg-gray-400 text-white rounded-md'
            >
              Back
            </button>
          )}
          {activeTab < 4 ? (
            <button
              onClick={() => setActiveTab(activeTab + 1)}
              disabled={isNextDisabled()}
              className={`px-4 py-2 rounded-md ${
                isNextDisabled() ? 'bg-gray-400' : 'bg-blue-500 text-white'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md'
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextModal;

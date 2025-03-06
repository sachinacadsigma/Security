import { CircleNotch } from 'phosphor-react';

const ResultShimmer = () => {
  return (
    <div className=' w-full flex justify-center items-center min-h-12'>
      <CircleNotch size={60} className='text-blue-600 animate-spin' />
    </div>
  );
};

export default ResultShimmer;

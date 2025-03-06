import { useLocation, useParams } from 'react-router-dom';

const PreviewTranslatedDoc = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const url = queryParams.get('url');
  return (
    <div>
      <iframe src={url} className='rounded-md w-full h-full' />
    </div>
  );
};

export default PreviewTranslatedDoc;

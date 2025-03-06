function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className='min-h-screen flex justify-center items-center flex-col text-center p-4'>
      <h2 className='text-red-600 text-3xl mb-4 font-bold'>
        Something went wrong!
      </h2>
      <p className='text-gray-700'>{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'
      >
        Try Again
      </button>
    </div>
  );
}

export default ErrorFallback;

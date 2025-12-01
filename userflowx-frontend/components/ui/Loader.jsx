'use client';

export const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex items-center justify-center">
      <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return <div className="py-8">{content}</div>;
};

export default Loader;

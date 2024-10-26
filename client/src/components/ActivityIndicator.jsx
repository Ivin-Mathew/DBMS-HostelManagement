import React from 'react';

const ActivityIndicator = () => {
  return (
    <div className="flex flex-1 justify-center items-center bg-surface h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default ActivityIndicator;

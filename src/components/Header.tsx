import React, { memo, useMemo } from 'react';

const Header: React.FC = memo(() => {
  return (
    <header className='bg-white pt-12 border-b'>
      <div className='container mx-auto px-3 sm:px-4 py-3 sm:py-6 flex flex-col items-center max-w-5xl'>
        <div className='flex flex-col items-center mb-4'>
          <img 
            src="/Untitled-1.png" 
            alt="by Ali und Mesut Logo" 
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-lg mb-3 object-cover border-4 border-orange-200"
          />
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tighter text-gray-900 relative animate-fade-in text-center'>
            <span className='relative'>
              <span>by Ali und Mesut</span>
              <span className='absolute -bottom-1 left-0 w-full h-1 bg-yellow-200 transform -skew-x-12' aria-hidden="true" />
            </span>
            <span className='text-yellow-500 relative ml-2'>
              <span>🚕</span>
            </span>
          </h1>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
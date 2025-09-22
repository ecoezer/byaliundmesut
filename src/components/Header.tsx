import React, { memo, useMemo } from 'react';

const Header: React.FC = memo(() => {
  return (
    <header className='bg-white pt-12 border-b'>
      <div className='container mx-auto px-3 sm:px-4 py-3 sm:py-6 flex flex-col items-center max-w-5xl'>
        {/* Header content removed - moved to search bar section */}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
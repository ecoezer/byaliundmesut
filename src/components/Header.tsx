import React, { memo, useMemo } from 'react';

const Header: React.FC = memo(() => {
  return (
    <header className='bg-white pt-12 border-b'>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
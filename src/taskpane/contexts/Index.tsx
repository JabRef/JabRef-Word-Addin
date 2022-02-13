import React, { ReactNode } from 'react';
import { CitationStoreProvider } from './CitationStoreContext';
import { CiteSupportProvider } from './CiteSupportContext';

interface indexProps {
  children: ReactNode;
}

const Context: React.FC<indexProps> = ({ children }) => {
  return (
    <CiteSupportProvider>
      <CitationStoreProvider>{children}</CitationStoreProvider>
    </CiteSupportProvider>
  );
};

export default Context;

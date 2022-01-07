import React, { ReactElement, ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
}

function ContentWrapper({ children }: ContentWrapperProps): ReactElement {
  return (
    <div
      style={{
        width: '90%',
        height: '100%',
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
}

export default ContentWrapper;

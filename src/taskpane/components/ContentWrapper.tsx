import React, { ReactElement, ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
}

function ContentWrapper({ children }: ContentWrapperProps): ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      }}
    >
      {children}
    </div>
  );
}

export default ContentWrapper;

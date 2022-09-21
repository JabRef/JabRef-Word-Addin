import { IStackStyles, IImageProps, ImageFit, IStackTokens } from '@fluentui/react';

// Styles definition
export const stackStylesHeader: IStackStyles = {
  root: {
    height: '100%',
    width: '80%',
    margin: 'auto',
    overflow: 'auto',
  },
};

// Logo
export const imageProps: IImageProps = {
  imageFit: ImageFit.contain,
  src: '../../assets/jabref.svg',
};

// Tokens definition
export const verticalGapStackTokens: IStackTokens = {
  childrenGap: 8,
};

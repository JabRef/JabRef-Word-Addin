import {
  IButtonStyles,
  IStackStyles,
  DefaultPalette,
  IIconProps,
  IImageProps,
  ImageFit,
} from '@fluentui/react';

export const footerIconOnlyButton: IButtonStyles = {
  icon: {
    color: 'rgba(255,255,255,.8)',
  },
  iconHovered: {
    color: 'rgba(255, 255, 255,.9)',
    transform: 'scale(1.05)',
  },
  iconPressed: {
    transform: 'scale(0.95)',
    color: 'rgba(255, 255, 255,.9)',
  },
  root: {
    paddingRight: 0,
  },
};

export const footerStackStyle: IStackStyles = {
  root: {
    height: '2.8rem',
    background: DefaultPalette.neutralPrimary,
  },
};

export const contentWrapper: IStackStyles = {
  root: {
    flex: 1,
    margin: '0 0.8rem',
  },
};

export const Signout: IIconProps = { iconName: 'SignOut' };
export const SyncBib: IIconProps = { iconName: 'InsertSignatureLine' };
export const light: IIconProps = { iconName: 'Brightness' };
export const dark: IIconProps = { iconName: 'LowerBrightness' };

export const imageProps: IImageProps = {
  imageFit: ImageFit.center,
  src: '../../../assets/svgs/logo.svg',
  width: '110rem',
  height: '40rem',
};

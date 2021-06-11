import React from 'react';
import { ButtonComponent, DivComponent, ImgComponent } from '../templates';

interface AvailableElement {
  component: React.ReactNode;
  replaceName: string;
}
export const AVAILABLE_REACT_ELEMENTS: Record<string, AvailableElement> = {
  // NOTE: Temp
  div: {
    component: DivComponent,
    replaceName: 'DivComponent',
  },
  button: {
    component: ButtonComponent,
    replaceName: 'ButtonComponent',
  },
  img: {
    component: ImgComponent,
    replaceName: 'ImgComponent',
  },
};

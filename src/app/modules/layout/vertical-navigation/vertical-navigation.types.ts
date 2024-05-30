// import { IsActiveMatchOptions } from '@angular/router';
export type NavigationItemTitle = string | { text:string,disableTransform?:boolean }
export interface NavigationItem {
  id?: string;
  title?: NavigationItemTitle;
  subtitle?: string;
  type: 'basic' | 'collapsable';
  hidden?: (item: NavigationItem) => boolean;
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  link?: string;
  externalLink?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top' | string;
  exactMatch?: boolean;
  // isActiveMatchOptions?: IsActiveMatchOptions;
  function?: (item: NavigationItem) => void;
  classes?: {
    title?: string;
    subtitle?: string;
    icon?: string;
    wrapper?: string;
  };
  icon?: string;
  isSvgIcon?: boolean;
  badge?: {
    title?: string;
    classes?: string;
  };
  children?: NavigationItem[];
}

export type VerticalNavigationMode = 'over' | 'side';

export type VerticalNavigationPosition = 'left' | 'right';

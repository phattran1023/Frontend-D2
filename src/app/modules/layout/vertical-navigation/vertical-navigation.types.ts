export interface NavigationItem {
  id?: string;
  title?: string;
  subtitle?: string;
  type: 'basic' | 'collapsable'; // Nếu type = 'collapsable' thì sẽ group những item trong children 
  hidden?: (item: NavigationItem) => boolean; 
  active?: boolean;
  disabled?: boolean;
  tooltip?: string;
  link?: string;
  externalLink?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top' | string;
  function?: (item: NavigationItem) => void;
  classes?: {
    title?: string;
    subtitle?: string;
    icon?: string;
    wrapper?: string;
  };
  icon?: string;
  isSvgIcon?: boolean; // Nếu sử dụng icon là svgIcon thì set isSvgIcon = true 
  badge?: {
    title?: string;
    classes?: string;
  };
  children?: NavigationItem[];
}

export type VerticalNavigationMode = 'over' | 'side';

export type VerticalNavigationPosition = 'left' | 'right';

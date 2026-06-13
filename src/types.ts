export type PageRoute = 
  | 'landing'
  | 'menu'
  | 'cafes'
  | 'login'
  | 'register'
  | 'reset-password'
  | 'checkout'
  | 'admin';

export interface BaseProps {
  onNavigate: (route: PageRoute) => void;
}

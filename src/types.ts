import React from 'react';

export type PageRoute = 
  | 'landing'
  | 'menu'
  | 'cafes'
  | 'login'
  | 'register'
  | 'reset-password'
  | 'checkout'
  | 'admin'
  | 'user-dashboard'
  | 'orders'
  | 'sustainability'
  | 'wholesale'
  | 'careers'
  | 'privacy'
  | 'terms';


export interface CartItem {
  id: string;
  title: string;
  price: number;
  desc: string;
  img: string;
  quantity: number;
  grindOption?: string;
  subscriptionOption?: string;
}

export interface BaseProps {
  onNavigate: (route: PageRoute) => void;
  cart?: CartItem[];
  setCart?: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

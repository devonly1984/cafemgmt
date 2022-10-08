import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

const MENU_ITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    role: '',
  },
  {
    state: 'category',
    name: 'Manage Category',
    icon: 'category',
    role: 'admin',
  },
  {
    state: 'product',
    name: 'Manage Product',
    icon: 'inventory_2',
    role: 'admin',
  },
];
@Injectable()
export class MenuItems {
  constructor() {}
  getMenuitem(): Menu[] {
    return MENU_ITEMS;
  }
}

import { Routes } from '@angular/router';
import { Shop } from './shop/shop';
import { Cart } from './cart/cart';
import { Main } from './main/main';

export const routes: Routes = [
    { path: '', 
        component: Main,
        title: 'Accueil'
    },
    { path: 'FullShop', 
        component: Shop,
        title: 'Shop'
    },
    { path: 'cart', 
        component: Cart,
        title: 'Panier'
    }
];



import { Routes } from '@angular/router';
import { Shop } from './shop/shop';
import { Cart } from './cart/cart';
import { Main } from './main/main';
import { Success } from './success/success';
import { CGV } from './cgv/cgv';

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
    },
    { path: 'success', 
        component: Success,
        title: 'success'
    },
    { path: 'CGV', 
        component: CGV,
        title: 'CGV'
    }
];



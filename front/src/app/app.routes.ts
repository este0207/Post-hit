import { Routes } from '@angular/router';
import { Shop } from './shop/shop';
import { Cart } from './cart/cart';
import { Main } from './main/main';
import { Success } from './success/success';
import { CGV } from './cgv/cgv';
import { Contact } from './contact/contact';
import { Payement } from './payement/payement';
import { UserProfil } from './user-profil/user-profil';
import { AboutUs } from './about-us/about-us';
import { Test3D } from './test3-d/test3-d';

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
    },
    { path: 'contact', 
        component: Contact,
        title: 'contact'
    },
    { path: 'payement', 
        component: Payement,
        title: 'payement'
    },
    { path: 'user-profil', 
        component: UserProfil,
        title: 'user-profil'
    },
    { path: 'about', 
        component: AboutUs,
        title: 'about'
    },
    { path: 'test3D', 
        component: Test3D,
        title: 'test3D'
    }
];



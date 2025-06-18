import { Routes } from '@angular/router';
import { Shop } from './shop/shop';


export const routes: Routes = [
    { path: 'FullShop', 
        component: Shop,
        title: 'Shop'
    },
    { path: '', 
        redirectTo: '/', 
        pathMatch: 'full' 
    }
];



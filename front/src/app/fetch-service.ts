import {Injectable, EventEmitter } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  public productSelected = new EventEmitter<number>();

  // constructor() { }

  async loadproducts(){
    const apiURL = environment.apiURL;

    return fetch(apiURL + "/products")
      .then(res => res.json())
      .then((data) => {
        console.log('Données reçues de l\'API:', data);
        const fullShop = document.querySelector('.fullShop') as HTMLElement;

        data.forEach((element: any) => {
         console.log(element)

         const ShopProductDiv = document.createElement('div');
         ShopProductDiv.className = 'ShopProducDiv';
          
          // Créer l'image du produit
          const productImage = document.createElement('img');
          productImage.crossOrigin = 'anonymous';
          productImage.src = element.product_name ? `${apiURL}/images/${element.product_name}${environment.format}` : `${apiURL}/images/placeholder${environment.format}`;
          productImage.alt = element.product_name || 'Produit';
          productImage.className = 'product-image';
          
          // Gestion d'erreur pour les images
          productImage.onerror = () => {
            productImage.src = `${apiURL}/placeholder.png`;
          };
          
          const paragraph = document.createElement('p');
          paragraph.innerText = element.product_name || 'Sans nom';
          paragraph.className = 'product-name';
          
          ShopProductDiv.appendChild(productImage);
          ShopProductDiv.appendChild(paragraph);
          fullShop.appendChild(ShopProductDiv);

          ShopProductDiv.addEventListener("click", () => {
            console.log(element.product_name);
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
            this.productSelected.emit(element.id);
            setTimeout(() => {
              document.body.style.overflow = "hidden";
            }, 500);
        });
        
        })
        return data;
      })
      .catch(error => {
        console.error('Erreur lors du chargement des produits:', error);
        throw error;
      });
    }
}
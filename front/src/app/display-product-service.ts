import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisplayProductService {

  async displayProductDetails(product: any) {
    const apiURL = environment.apiURL;
    
    // Vider le contenu existant
    const ProductDesc = document.querySelector('.ProductDesc') as HTMLElement;
    const ProductImg = document.querySelector(".ProductImg") as HTMLElement;
    
    if (ProductDesc) ProductDesc.innerHTML = '';
    if (ProductImg) ProductImg.innerHTML = '';
    
    // Créer l'image du produit
    const productImage = document.createElement('img');
    productImage.src = product.product_name ? `${apiURL}/images/${product.product_name}${environment.format}` : `${apiURL}/images/placeholder${environment.format}`;
    productImage.alt = product.product_name+'IMG' || 'ProduitIMG';
    productImage.className = 'product-image2';
    
    // Gestion d'erreur pour les images
    productImage.onerror = () => {
      productImage.src = `${apiURL}/placeholder.png`;
    };
    
    const productTitle = document.createElement('p');
    productTitle.innerText = product.product_name || 'Sans nom';
    productTitle.className = 'product-name';

    const productDesc = document.createElement('p');
    productDesc.innerText = product.product_desc || 'Aucune description disponible';
    productDesc.className = 'product-desc';

    const productPrice = document.createElement('p');
    productPrice.innerText = product.product_price ? product.product_price+'€' : 'Prix non disponible';
    productPrice.className = 'product-price';

    const BuyBtn = document.createElement('button');
    BuyBtn.innerText = 'ADD to Cart';
    BuyBtn.className = 'BuyBtn';
    
    if (ProductImg) ProductImg.appendChild(productImage);
    if (ProductDesc) {
      ProductDesc.appendChild(productTitle);
      ProductDesc.appendChild(productDesc);
      ProductDesc.appendChild(productPrice);
      ProductDesc.appendChild(BuyBtn);
    }



    BuyBtn.addEventListener('click', ()=>{
      console.log(product);
    })
  }
}

import { Injectable } from '@angular/core';
import { UserService } from './user-service';
import { CartService } from './cart-service';
import { environment } from '../environments/environment';
import { NotificationService } from './notification';

@Injectable({
  providedIn: 'root'
})
export class DisplayProductService {
  constructor(
    private userService: UserService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

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

    BuyBtn.addEventListener('click', async () => {
      document.body.style.overflow = "scroll";
      try {
        // Récupérer l'utilisateur connecté
        const currentUser = this.userService.currentUser();
        if (!currentUser || !currentUser.id) {
          this.notificationService.showNotification(
            'Veuillez vous connecter pour ajouter des produits au panier',
            'error'
          );
          return;
        }
        await this.cartService.addToCart(currentUser.id, product.id, 1);
        // Afficher une notification de succès
        this.notificationService.showNotification(
          'Produit ajouté au panier !',
          'success'
        );
        const productPage = document.querySelector('.productContainer') as HTMLElement;
        if (productPage) {
          productPage.classList.remove('active');
        }
        console.log('Produit ajouté au panier:', product);
      } catch (error) {
        console.error("Erreur lors de l'ajout au panier:", error);
        this.notificationService.showNotification(
          "Erreur lors de l'ajout au panier",
          'error'
        );
      }
    });
  }
}

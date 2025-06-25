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

  // Nouvelle méthode pour créer les éléments de la liste des produits
  createProductElement(element: any, container: HTMLElement, onProductClick?: (productId: number) => void) {
    const apiURL = environment.apiURL;
    
    const ProductDiv = document.createElement('div');
    ProductDiv.className = 'ProducDiv';
      
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
    
    ProductDiv.appendChild(productImage);
    ProductDiv.appendChild(paragraph);
    container.appendChild(ProductDiv);

    // Ajouter l'événement de clic si une fonction est fournie
    if (onProductClick) {
      ProductDiv.addEventListener("click", () => {
        console.log(element.product_name);
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        onProductClick(element.id);
        setTimeout(() => {
          document.body.style.overflow = "hidden";
        }, 500);
      });
    }
  }

  // Méthode pour charger et afficher une liste de produits
  async displayProductList(apiEndpoint: string, container: HTMLElement, onProductClick?: (productId: number) => void) {
    const apiURL = environment.apiURL;
    
    try {
      const response = await fetch(`${apiURL}${apiEndpoint}`);
      const data = await response.json();
      
      console.log('Données reçues de l\'API:', data);
      
      // Vider le conteneur
      container.innerHTML = '';
      
      // Créer les éléments pour chaque produit
      data.forEach((element: any) => {
        this.createProductElement(element, container, onProductClick);
      });
      
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      throw error;
    }
  }

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

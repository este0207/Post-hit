import { Injectable } from '@angular/core';
import { UserService } from './user-service';
import { CartService } from './cart-service';
import { environment } from '../environments/environment';
import { NotificationService } from './notification';
import { Poster3DService } from './poster3-d-service';

@Injectable({
  providedIn: 'root'
})
export class DisplayProductService {
  constructor(
    private userService: UserService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private poster3DService: Poster3DService
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
        this.poster3DService.setImageName(element.product_name);
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
    
    if (ProductDesc) ProductDesc.innerHTML = '';

    
    const productTitle = document.createElement('p');
    productTitle.innerText = product.product_name || 'Sans nom';
    productTitle.className = 'product-name';

    const productDesc = document.createElement('p');
    productDesc.innerText = product.product_desc || 'Aucune description disponible';
    productDesc.className = 'product-desc';

    const colorDiv = document.createElement('div');
    colorDiv.className = 'colorDiv';

    const colorP = document.createElement('p');
    colorP.innerText = 'Change Color :'
    
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#ffffff';
    colorInput.className = 'color-picker';

    colorInput.addEventListener('input', (event) => {
      const color = (event.target as HTMLInputElement).value;
      this.poster3DService.setOutlineColor(color);
    });
    
    if(colorDiv){
      colorDiv.appendChild(colorP);
      colorDiv.appendChild(colorInput);
    }
    const productPrice = document.createElement('p');
    productPrice.innerText = product.product_price ? product.product_price+'€' : 'Prix non disponible';
    productPrice.className = 'product-price';

    const BuyBtn = document.createElement('button');
    BuyBtn.innerText = 'ADD to Cart';
    BuyBtn.className = 'BuyBtn';
    
    if (ProductDesc) {
      ProductDesc.appendChild(productTitle);
      ProductDesc.appendChild(colorDiv);
      ProductDesc.appendChild(productDesc);
      ProductDesc.appendChild(productPrice);
      ProductDesc.appendChild(BuyBtn);
    }

    BuyBtn.addEventListener('click', async () => {
      document.body.style.overflowY = "scroll";
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

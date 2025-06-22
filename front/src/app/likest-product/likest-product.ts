import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart-service';
import { UserService } from '../user-service';

@Component({
  selector: 'app-likest-product',
  imports: [CommonModule],
  templateUrl: './likest-product.html',
  styleUrl: './likest-product.css',
  encapsulation: ViewEncapsulation.None
})
export class LikestProduct implements OnInit, OnDestroy{

  private routerSubscription: Subscription | undefined;
  isVisible: boolean = true;

  constructor(
    private router: Router, 
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    this.activateContainer();

    // Écouter les changements de route
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.handleRouteChange();
    });

    this.handleRouteChange();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private handleRouteChange(): void {
    if (this.router.url === '/FullShop' || this.router.url === '/cart') {
      this.isVisible = false;
    } else {
      this.isVisible = true;
      this.activateContainer();
      this.loadProducts();
    }
  }

  private activateContainer(): void {
    setTimeout(() => {
      const likesproductsContainer = document.querySelector('.likesproductsContainer') as HTMLElement;
      if (likesproductsContainer) {
        likesproductsContainer.classList.add("active");
      }
    }, 700);
  }

  private loadProducts() {
    const apiURL = environment.apiURL;

    fetch(apiURL + "/bestselling")
      .then(res => res.json())
      .then((data) => {
        console.log('Données reçues de l\'API:', data);
        const likesproductsContainer = document.querySelector('.likesproductsContainer') as HTMLElement;

        data.forEach((element: any) => {
         console.log(element)

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
          likesproductsContainer.appendChild(ProductDiv);

          ProductDiv.addEventListener("click", () => {
            console.log(element.product_name);
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
            this.loadProductDetails(element.id);
            setTimeout(() => {
              document.body.style.overflow = "hidden";
            }, 500);
        });
        
      })
    })
      .catch(error => {
        console.error('Erreur lors du chargement des produits:', error);
      });
    }

  private loadProductDetails(productId: number) {
    const apiURL = environment.apiURL;
    
    fetch(apiURL + `/bestselling/${productId}`)
      .then(res => res.json())
      .then((data) => {
        console.log('Détails du produit reçus:', data);
        
        // Afficher la page produit
        const productPage = document.querySelector(".productContainer") as HTMLElement;
        if (productPage) {
          productPage.classList.add("active");
        }
        
        // Charger les détails du produit dans la page
        this.displayProductDetails(data);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des détails du produit:', error);
      });
  }

  private displayProductDetails(product: any) {
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
      try {
        // Récupérer l'utilisateur connecté
        const currentUser = this.userService.currentUser();
        
        if (!currentUser || !currentUser.id) {
          this.showNotification('Veuillez vous connecter pour ajouter des produits au panier', 'error');
          return;
        }
        
        await this.cartService.addToCart(currentUser.id, product.id, 1);
        
        // Afficher une notification de succès
        this.showNotification('Produit ajouté au panier !', 'success');
        
        console.log('Produit ajouté au panier:', product);
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        this.showNotification('Erreur lors de l\'ajout au panier', 'error');
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error') {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      ${type === 'success' ? 'background: #27ae60;' : 'background: #e74c3c;'}
    `;

    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Supprimer la notification après 3 secondes
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
        document.head.removeChild(style);
      }, 300);
    }, 3000);
  }
}


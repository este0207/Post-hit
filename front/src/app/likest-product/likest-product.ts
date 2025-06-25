import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart-service';
import { UserService } from '../user-service';
import { NotificationService } from '../notification';
import { DisplayProductService } from '../display-product-service';

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
    private userService: UserService,
    private notificationService: NotificationService,
    private displayProductService: DisplayProductService
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
      setTimeout(() => {
        this.loadProducts();
      }, 50);
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
    const likesproductsContainer = document.querySelector('.likesproductsContainer') as HTMLElement;
    if (!likesproductsContainer) {
      console.error('Container likesproductsContainer non trouvé');
      return;
    }
    
    // Utiliser le DisplayProductService pour charger et afficher les produits
    this.displayProductService.displayProductList(
      '/bestselling', 
      likesproductsContainer,
      (productId: number) => this.loadProductDetails(productId)
    ).catch(error => {
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
    this.displayProductService.displayProductDetails(product);
  }
}


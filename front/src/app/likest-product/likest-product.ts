import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart-service';
import { UserService } from '../user-service';
import { NotificationService } from '../notification';
import { DisplayProductService } from '../display-product-service';
import { ThemeSelectionService } from '../theme-selection.service';

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
    private displayProductService: DisplayProductService,
    private themeSelectionService: ThemeSelectionService
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

    this.themeSelectionService.selectedTheme$.subscribe(theme => {
      if (theme && this.isVisible) {
        this.loadProducts(theme);
      } else if (this.isVisible) {
        this.loadProducts();
      }
    });

  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private handleRouteChange(): void {
    if (this.router.url === '/') {
      this.isVisible = true;
      this.activateContainer();
      setTimeout(() => {
        this.loadProducts();
      }, 50);
    } else {
      this.isVisible = false
      ;
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

  private loadProducts(theme?: string) {
    const likesproductsContainer = document.querySelector('.likesproductsContainer') as HTMLElement;
    if (!likesproductsContainer) {
      console.error('Container likesproductsContainer non trouvé');
      return;
    }
    let endpoint = '/bestselling';
    if (theme) {
      endpoint += `?theme=${encodeURIComponent(theme)}`;
    }
    this.displayProductService.displayProductList(
      endpoint,
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


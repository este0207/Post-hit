import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../environments/environment';
import { FetchService } from '../fetch-service';
import { DisplayProductService } from '../display-product-service';
import { Theme } from "../theme/theme";

@Component({
  selector: 'app-shop',
  imports: [Theme],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
  encapsulation: ViewEncapsulation.None
})
export class Shop implements OnInit {
  private fetchService = inject(FetchService);
  private displayProductService = inject(DisplayProductService);

  private products: any[] = [];

  ngOnInit(): void {
    setTimeout(() => {
      const fullShop = document.querySelector('.fullShop') as HTMLElement;
      if (fullShop) {
        fullShop.classList.add("active");
      }
    }, 600);

    this.loadProducts();
    this.setupProductSelection();
    this.setupSortButtons();
  }

  private setupSortButtons() {
    const sortPriceAsc = document.getElementById('sort-price-asc');
    const sortPriceDesc = document.getElementById('sort-price-desc');
    const sortNameAsc = document.getElementById('sort-name-asc');
    const sortNameDesc = document.getElementById('sort-name-desc');

    if (sortPriceAsc) {
      sortPriceAsc.addEventListener('click', () => this.sortProducts('price-asc'));
    }
    if (sortPriceDesc) {
      sortPriceDesc.addEventListener('click', () => this.sortProducts('price-desc'));
    }
    if (sortNameAsc) {
      sortNameAsc.addEventListener('click', () => this.sortProducts('name-asc'));
    }
    if (sortNameDesc) {
      sortNameDesc.addEventListener('click', () => this.sortProducts('name-desc'));
    }
  }

  private sortProducts(type: string) {
    if (!this.products.length) return;
    let sorted = [...this.products];
    switch (type) {
      case 'price-asc':
        sorted.sort((a, b) => (a.product_price || 0) - (b.product_price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.product_price || 0) - (a.product_price || 0));
        break;
      case 'name-asc':
        sorted.sort((a, b) => (a.product_name || '').localeCompare(b.product_name || ''));
        break;
      case 'name-desc':
        sorted.sort((a, b) => (b.product_name || '').localeCompare(a.product_name || ''));
        break;
    }
    this.displayProducts(sorted);
  }

  private setupProductSelection() {
    this.fetchService.productSelected.subscribe((productId: number) => {
      this.loadProductDetails(productId);
    });
  }

  private async loadProducts() {
    const fullshop = document.querySelector('.fullShop') as HTMLElement;
    if (!fullshop) {
      console.error('Container fullshop non trouvé');
      return;
    }

    try {
      // Utiliser le DisplayProductService pour charger et afficher les produits
      const data = await this.displayProductService.displayProductList(
        '/products',
        fullshop,
        (productId: number) => this.loadProductDetails(productId)
      );
      this.products = data;
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  }

  private displayProducts(products: any[]) {
    const fullshop = document.querySelector('.fullShop') as HTMLElement;
    if (!fullshop) return;
    fullshop.innerHTML = '';
    products.forEach((element: any) => {
      this.displayProductService.createProductElement(
        element,
        fullshop,
        (productId: number) => this.loadProductDetails(productId)
      );
    });
  }

  private loadProductDetails(productId: number) {
    const apiURL = environment.apiURL;
    
    fetch(apiURL + `/product/${productId}`)
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

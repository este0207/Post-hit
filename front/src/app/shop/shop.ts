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

  ngOnInit(): void {
    setTimeout(() => {
      const fullShop = document.querySelector('.fullShop') as HTMLElement;
      if (fullShop) {
        fullShop.classList.add("active");
      }
    }, 600);

    this.loadProducts();
    this.setupProductSelection();
  }

  private setupProductSelection() {
    this.fetchService.productSelected.subscribe((productId: number) => {
      this.loadProductDetails(productId);
    });
  }

  private loadProducts() {
    this.fetchService.loadproducts()
      .then((data) => {
        console.log('Produits chargés avec succès:', data);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des produits:', error);
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
        this.displayProductService.displayProductDetails(data);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des détails du produit:', error);
      });
  }
}

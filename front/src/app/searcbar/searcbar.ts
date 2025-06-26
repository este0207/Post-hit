import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DisplayProductService } from '../display-product-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-searcbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './searcbar.html',
  styleUrl: './searcbar.css'
})
export class Searcbar implements OnInit {
  searchText: string = '';
  products: any[] = [];

  constructor(private displayProductService: DisplayProductService) {}

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    const apiURL = environment.apiURL;
    try {
      const response = await fetch(`${apiURL}/products`);
      this.products = await response.json();
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  }

  onSearch() {
    const fullShop = document.querySelector('.fullShop') as HTMLElement;
    if (!fullShop) return;
    let filtered = this.products;
    if (this.searchText && this.searchText.trim() !== '') {
      const search = this.searchText.trim().toLowerCase();
      filtered = this.products.filter(p =>
        (p.product_name && p.product_name.toLowerCase().includes(search)) ||
        (p.product_theme && p.product_theme.toLowerCase().includes(search))
      );
    }
    fullShop.innerHTML = '';
    filtered.forEach(element => {
      this.displayProductService.createProductElement(element, fullShop, (productId: number) => {
        // Optionnel : charger les détails du produit si besoin
      });
    });
  }
}

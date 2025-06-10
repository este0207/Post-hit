import { Component, OnInit } from '@angular/core';

interface Product {
  id: number;
  product_name: string;
  product_price: number;
  product_desc: string;
  product_theme: string
}

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  products: Product[] = [];

  ngOnInit() {
    this.loadProducts();
  }

  private loadProducts() {
    fetch("http://localhost:8090/products")
      .then(res => res.json())
      .then((data: Product[]) => {
        console.log('Données reçues de l\'API:', data);
        this.products = data;
        this.createProductElements();
      })
      .catch(error => {
        console.error('Erreur lors du chargement des produits:', error);
      });
  }

  private createProductElements() {
    const navbarContainer = document.querySelector('.navbar-container');
    if (!navbarContainer) return;

    this.products.forEach((product: Product) => {
      const productElement = document.createElement('div');
      productElement.className = 'product-item';
      productElement.innerHTML = `
        <span class="product-name">${product.product_name}</span>
        <span class="product-price">${product.product_price}€</span>
        <span class="product-desc">${product.product_desc}€</span>
        <span class="product-theme">${product.product_theme}€</span>
      `;
      navbarContainer.appendChild(productElement);
    });
  }
}

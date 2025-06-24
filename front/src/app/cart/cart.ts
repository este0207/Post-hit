import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../cart-service';
import { UserService } from '../user-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  totalItems: number = 0;
  loading: boolean = false;
  error: string = '';
  private apiURL = environment.apiURL;

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  async loadCart(): Promise<void> {
    this.loading = true;
    this.error = '';
    
    try {
      const currentUser = this.userService.currentUser();
      if (!currentUser || !currentUser.id) {
        this.error = 'Veuillez vous connecter pour voir votre panier';
        return;
      }
      
      this.cartItems = await this.cartService.getCart(currentUser.id);
      this.calculateTotals();
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      this.error = 'Erreur lors du chargement du panier';
    } finally {
      this.loading = false;
    }
  }

  async addToCart(productId: number): Promise<void> {
    try {
      const currentUser = this.userService.currentUser();
      if (!currentUser || !currentUser.id) {
        this.error = 'Veuillez vous connecter pour ajouter des produits au panier';
        return;
      }
      
      await this.cartService.addToCart(currentUser.id, productId, 1);
      await this.loadCart(); // Recharger le panier
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      this.error = 'Erreur lors de l\'ajout au panier';
    }
  }

  async removeFromCart(productId: number): Promise<void> {
    try {
      const currentUser = this.userService.currentUser();
      if (!currentUser || !currentUser.id) {
        this.error = 'Veuillez vous connecter pour modifier votre panier';
        return;
      }
      
      await this.cartService.removeFromCart(currentUser.id, productId);
      await this.loadCart(); // Recharger le panier
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      this.error = 'Erreur lors de la suppression du panier';
    }
  }

  async updateQuantity(productId: number, newQuantity: number): Promise<void> {
    if (newQuantity < 1) {
      await this.removeFromCart(productId);
      return;
    }

    try {
      const currentUser = this.userService.currentUser();
      if (!currentUser || !currentUser.id) {
        this.error = 'Veuillez vous connecter pour modifier votre panier';
        return;
      }
      
      await this.cartService.updateQuantity(currentUser.id, productId, newQuantity);
      await this.loadCart(); // Recharger le panier
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
      this.error = 'Erreur lors de la mise à jour de la quantité';
    }
  }

  async clearCart(): Promise<void> {
    try {
      const currentUser = this.userService.currentUser();
      if (!currentUser || !currentUser.id) {
        this.error = 'Veuillez vous connecter pour modifier votre panier';
        return;
      }
      
      await this.cartService.clearCart(currentUser.id);
      this.cartItems = [];
      this.calculateTotals();
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      this.error = 'Erreur lors du vidage du panier';
    }
  }

  private calculateTotals(): void {
    this.total = this.cartService.calculateTotal(this.cartItems);
    this.totalItems = this.cartService.calculateTotalItems(this.cartItems);
  }

  getProductImageUrl(productName: string): string {
    return `${this.apiURL}/images/${productName}${environment.format}`;
  }

  onImageError(event: any): void {
    event.target.src = `${this.apiURL}/images/placeholder${environment.format}`;
  }

  async checkout(): Promise<void> {
    try {
      const response = await fetch(`${this.apiURL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: this.cartItems })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        this.error = 'Erreur lors de la création de la session de paiement.';
      }
    } catch (error) {
      this.error = 'Erreur lors de la création de la session de paiement.';
    }
  }
} 
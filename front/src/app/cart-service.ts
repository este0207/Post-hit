import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product_name: string;
  product_price: number;
  product_desc: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiURL = environment.apiURL;

  constructor() { }

  // Récupérer le panier d'un utilisateur
  async getCart(userId: number): Promise<CartItem[]> {
    try {
      const response = await fetch(`${this.apiURL}/cart/${userId}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du panier');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur getCart:', error);
      throw error;
    }
  }

  // Ajouter un produit au panier
  async addToCart(userId: number, productId: number, quantity: number = 1): Promise<any> {
    try {
      const response = await fetch(`${this.apiURL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, quantity })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout au panier');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur addToCart:', error);
      throw error;
    }
  }

  // Supprimer un produit du panier
  async removeFromCart(userId: number, productId: number): Promise<any> {
    try {
      const response = await fetch(`${this.apiURL}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du panier');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur removeFromCart:', error);
      throw error;
    }
  }

  // Mettre à jour la quantité d'un produit
  async updateQuantity(userId: number, productId: number, quantity: number): Promise<any> {
    try {
      const response = await fetch(`${this.apiURL}/cart/update-quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, productId, quantity })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la quantité');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur updateQuantity:', error);
      throw error;
    }
  }

  // Vider le panier
  async clearCart(userId: number): Promise<any> {
    try {
      const response = await fetch(`${this.apiURL}/cart/clear/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors du vidage du panier');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur clearCart:', error);
      throw error;
    }
  }

  // Calculer le total du panier
  calculateTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      return total + (item.product_price * item.quantity);
    }, 0);
  }

  // Calculer le nombre total d'articles
  calculateTotalItems(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }
} 
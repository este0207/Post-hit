import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Main } from "./main/main";
import { Form } from "./form/form";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Main, Form],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected title = 'front';


  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts() {
    fetch("http://localhost:8090/products")
      .then(res => res.json())
      .then((data) => {
        console.log('Données reçues de l\'API:', data);
        
      })
      .catch(error => {
        console.error('Erreur lors du chargement des produits:', error);
      });
    }

}

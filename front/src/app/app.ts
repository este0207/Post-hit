import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Main } from "./main/main";
import { Form } from "./form/form";
import { Theme } from "./theme/theme";
import { LikestProduct } from "./likest-product/likest-product";
import { ProductPage } from "./product-page/product-page";
import { BurgerMenu } from "./burger-menu/burger-menu";
import { Shop } from "./shop/shop";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Main, Form, Theme, LikestProduct, BurgerMenu, ProductPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected title = 'front';


  ngOnInit(): void {
    window.scrollTo(0,0);
  }
}

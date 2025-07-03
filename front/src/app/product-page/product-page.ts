import { Component } from '@angular/core';
import { ReturnBtn } from "../return-btn/return-btn";
import { Test3D } from "../test3-d/test3-d";

@Component({
  selector: 'app-product-page',
  imports: [ReturnBtn, Test3D],
  standalone: true,
  templateUrl: './product-page.html',
  styleUrl: './product-page.css'
})
export class ProductPage {
}

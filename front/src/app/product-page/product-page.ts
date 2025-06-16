import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css'
})
export class ProductPage implements OnInit {


  ngOnInit(): void {
    this.loadProducts()
  }


  private loadProducts() {
    fetch("http://localhost:8090/product/10")
      .then(res => res.json())
      .then((data) => {
        console.log('Données reçues ekznfek de l\'API:', data);

        const productName = document.querySelector('.productName') as HTMLElement;
        const productPrice = document.querySelector('.productPrice') as HTMLElement;
        const productDescription = document.querySelector('.productDescription') as HTMLElement;

        productName.innerText = data.product_name;
        productPrice.innerText = data.product_price;
        productDescription.innerText = data.product_desc;

        
    })

}
}

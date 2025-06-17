import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-likest-product',
  imports: [],
  templateUrl: './likest-product.html',
  styleUrl: './likest-product.css',
  encapsulation: ViewEncapsulation.None
})
export class LikestProduct implements OnInit{

  ngOnInit(): void {
    this.loadProducts()
      const likesproductsContainer = document.querySelector(".likesproductsContainer") as HTMLElement;
      if(likesproductsContainer){
        setTimeout(() => {
          likesproductsContainer.classList.add("active");
        }, 600);
      }
  }


  private loadProducts() {

    const apiURL = environment.apiURL;

    fetch(apiURL + "/products")
      .then(res => res.json())
      .then((data) => {
        console.log('Données reçues de l\'API:', data);
        const likesproductsContainer = document.querySelector('.likesproductsContainer') as HTMLElement;

        data.forEach((element: any) => {
         console.log(element)

         const ProductDiv = document.createElement('div');
         ProductDiv.className = 'ProducDiv';
          
          const paragraph = document.createElement('p');
          paragraph.innerText = element.product_name || 'Sans nom';
          
          ProductDiv.appendChild(paragraph);
          likesproductsContainer.appendChild(ProductDiv);

          ProductDiv.addEventListener("click", () => {
            console.log(element.product_name);
        });
        
      })
    })
      .catch(error => {
        console.error('Erreur lors du chargement des produits:', error);
      });
    }

}


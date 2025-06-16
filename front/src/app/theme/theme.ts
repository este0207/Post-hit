import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-theme',
  imports: [],
  templateUrl: './theme.html',
  styleUrl: './theme.css',
  encapsulation: ViewEncapsulation.None
})
export class Theme implements OnInit{


  ngOnInit(): void {
    this.loadProducts()
  }

  private loadProducts() {
    fetch("http://localhost:8090/categories")
      .then(res => res.json())
      .then((data) => {
        console.log('Données reçues de l\'API:', data);
        const themecontainer = document.querySelector('.themecontainer') as HTMLElement;

        data.forEach((element: any) => {
          const themeDiv = document.createElement('div');
          themeDiv.className = 'theme';
          
          const paragraph = document.createElement('p');
          paragraph.innerText = element.categorie_name || 'Sans nom';
          
          themeDiv.appendChild(paragraph);
          themecontainer.appendChild(themeDiv);

          themeDiv.addEventListener("click", () => {
            console.log(element.categorie_name);
          });
        });
        
      })
      .catch(error => {
        console.error('Erreur lors du chargement des produits:', error);
      });
    }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme',
  imports: [CommonModule],
  templateUrl: './theme.html',
  styleUrl: './theme.css',
  encapsulation: ViewEncapsulation.None
})
export class Theme implements OnInit{

  isVisible: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Vérifier la route actuelle
    this.handleRouteChange();
    
    // Écouter les changements de route
    this.router.events.subscribe(() => {
      this.handleRouteChange();
    });

    this.loadProducts()
    this.activateContainer()

  }

  private handleRouteChange(): void {
    if (this.router.url === '/cart') {
      this.isVisible = false;
    } else {
      this.isVisible = true;
      // this.loadProducts()
      this.activateContainer()
    }
}

private activateContainer(): void {
  const themecontainer = document.querySelector(".themecontainer") as HTMLElement;
    if(themecontainer){
      setTimeout(() => {
        themecontainer.classList.add("active");
      }, 600);
    }
}

  private loadProducts() {
    const apiURL = environment.apiURL;

    fetch(apiURL + "/categories")
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

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
  
  categories: any[] = [];
  ngOnInit(): void {
    // Vérifier la route actuelle
    this.handleRouteChange();
    
    // Écouter les changements de route
    this.router.events.subscribe(() => {
      this.handleRouteChange();
    });

  }

  private handleRouteChange(): void {
    if (this.router.url === '/' || this.router.url === '/FullShop') {
      this.isVisible = true;
      this.loadProducts()
    } else {
      this.isVisible = false;
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
        this.categories = data;
        this.activateContainer();
      })
      .catch(error => {
        console.error('Erreur lors du chargement des produits:', error);
      });
  }

  onCategoryClick(element: any) {
    console.log(element.categorie_name);
  }

}

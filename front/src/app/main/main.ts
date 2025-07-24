import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Theme } from "../theme/theme";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, Theme],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit{

  private routerSubscription: Subscription | undefined;
  isVisible: boolean = true;

  constructor(private router: Router) {}


  ngOnInit(): void {

    setTimeout(() => {
      const main = document.querySelector('.main') as HTMLElement;
      if (main) {
        main.classList.add("active");
      }
    }, 700);


    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.handleRouteChange();
    });

    this.handleRouteChange();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private handleRouteChange(): void {
    if (this.router.url === '/FullShop' || this.router.url === '/cart') {
      this.isVisible = false;
    } else {
      this.isVisible = true;
    }
}
}

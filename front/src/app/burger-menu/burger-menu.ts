import { Component } from '@angular/core';
import { Link } from "../link/link";

@Component({
  selector: 'app-burger-menu',
  imports: [Link],
  templateUrl: './burger-menu.html',
  styleUrl: './burger-menu.css'
})
export class BurgerMenu {

  closeMenu(){
    const burgerMenu = document.querySelector(".burgerMenu")
    if (burgerMenu) {
      burgerMenu.classList.remove("active");
    }
  }
}

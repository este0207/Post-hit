import { Component, input, OnInit, computed, effect } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Link } from "../link/link";
import { Searcbar } from "../searcbar/searcbar";
import { UserService } from '../user-service';

@Component({
  selector: 'app-navbar',
  imports: [Link, Searcbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  constructor(private userService: UserService, private router: Router) {
    effect(() => {
      const user = this.userService.currentUser();
    });
  }

  username = computed(() => {
    const user = this.userService.currentUser();
    return user?.username ?? '';
  });

  ngOnInit() : void{
    setTimeout(() => {
      const navbar = document.querySelector(".nav") as HTMLElement;
      if (navbar) {
        navbar.classList.add("active");
        setTimeout(()=>{
          navbar.style.position = "sticky";
        },500);
      }
    }, 100);
  }

  userForm(){
    const form = document.querySelector(".formcontainer") as HTMLElement;
    if (form) {
      form.classList.toggle("active");
    }
  }

  useSearch(){
    const input = document.querySelector(".searchbar") as HTMLElement;
    if (input) {
      input.classList.toggle("active");
    }
  }

  ShowMenu(){
    const BurgerMenu = document.querySelector(".burgerMenu") as HTMLElement;
    if (BurgerMenu) {
      BurgerMenu.classList.toggle("active");
    }
  }

  ViewFullShop(){
    this.router.navigate(['FullShop']);
  }
}

import { Component, OnInit, computed, effect } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UserService } from '../user-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  constructor(private userService: UserService, private router: Router) {

    // Surveiller les changements d'état de connexion
    effect(() => {
      const user = this.userService.currentUser();
      console.log('État de connexion dans navbar:', user ? 'Connecté' : 'Déconnecté');
    });
  }

  username = computed(() => {
    const user = this.userService.currentUser();
    return user?.username ?? '';
  });

  isLoggedIn = computed(() => {
    return this.userService.isAuthenticated();
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
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setTimeout(() => {
        document.body.style.overflow = "hidden";
      }, 500);
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

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }

}

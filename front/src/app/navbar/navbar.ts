import { Component, input, OnInit, computed, effect } from '@angular/core';
import { Link } from "../link/link";
import { Searcbar } from "../searcbar/searcbar";
import { UserService } from '../user-service';
import { Form } from '../form/form';

@Component({
  selector: 'app-navbar',
  imports: [Link, Searcbar, Form],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  constructor(private userService: UserService) {
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
}

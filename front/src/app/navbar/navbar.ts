import { Component, OnInit } from '@angular/core';
import { Link } from "../link/link";
import { Searcbar } from "../searcbar/searcbar";

@Component({
  selector: 'app-navbar',
  imports: [Link, Searcbar],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

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

}

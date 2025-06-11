import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main implements OnInit{

  ngOnInit(): void {
    const main = document.querySelector(".main") as HTMLElement;
    if(main){
      setTimeout(() => {
        main.classList.add("active")
      }, 600);
    }
  }

}

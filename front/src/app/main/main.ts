import { Component, OnInit} from '@angular/core';
import { Button } from '../button/button';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Button],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main{

  ngOnInit(): void {
    const main = document.querySelector(".main") as HTMLElement;
    if(main){
      setTimeout(() => {
        main.classList.add("active");
      }, 600);
    }
  }
}

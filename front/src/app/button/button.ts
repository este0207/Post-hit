import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {

  onClick(){
    console.log("click")
    window.scrollTo({
      top: 750,
      behavior: 'smooth',
    });
  }

}

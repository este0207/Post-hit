import { Component } from '@angular/core';

@Component({
  selector: 'app-return-btn',
  imports: [],
  templateUrl: './return-btn.html',
  styleUrl: './return-btn.css'
})
export class ReturnBtn {

  CloseProjectDisplay(){
    const productContainer = document.querySelector(".productContainer") as HTMLElement;
    if (productContainer) {
      productContainer.classList.remove("active");
    }
    setTimeout(() => {
      document.body.style.overflowY = "scroll";
    }, 100);
  }

}

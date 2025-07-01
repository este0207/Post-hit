import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit{

  ngOnInit(): void {
    setTimeout(() => {
      const footerContainer = document.querySelector('.footerContainer') as HTMLElement;
      if (footerContainer) {
        footerContainer.classList.toggle("active");
      }
    }, 700);
  }
}

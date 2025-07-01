import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit{

  ngOnInit(): void {
    setTimeout(() => {
      const contactContainer = document.querySelector('.contactContainer') as HTMLElement;
      if (contactContainer) {
        contactContainer.classList.add("active");
      }
    }, 700);
  }
}

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-link',
  imports: [],
  templateUrl: './link.html',
  styleUrl: './link.css'
})
export class Link {

  link_url = input("#");
  link_text = input("defaul link");
  link_icon = input("");
}

import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-link',
  imports: [RouterLink],
  templateUrl: './link.html',
  styleUrl: './link.css'
})
export class Link {

  link_url = input("#");
  link_text = input("");
  link_icon = input("");
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Main } from "./main/main";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Main],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'front';
}

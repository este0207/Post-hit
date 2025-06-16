import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Main } from "./main/main";
import { Form } from "./form/form";
import { Theme } from "./theme/theme";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Main, Form, Theme],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected title = 'front';

}

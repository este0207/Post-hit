import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.html',
  styleUrl: './success.css'
})
export class Success {
  constructor(private router: Router) {}

  redirectHome() {
    this.router.navigate(['/']);
  }
}

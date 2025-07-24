import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    // Simuler une requête de connexion
    setTimeout(() => {
      this.loading = false;
      // Logique de connexion à compléter
    }, 1200);
  }

  onForgotPassword() {
    // Logique de récupération de mot de passe à compléter
    alert('Lien de réinitialisation envoyé (simulation)');
  }
}

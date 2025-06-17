import { Component, OnInit, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../user-service';
import { Router } from '@angular/router';
import { ReturnBtn } from "../return-btn/return-btn";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReturnBtn],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {

  closeForm(){
    const formcontainer = document.querySelector(".formcontainer") as HTMLElement;
    if (formcontainer) {
      formcontainer.classList.remove("active");
    }
  }

  @ViewChild('flipper') flipper!: ElementRef;
  isFlipped: boolean = false;

  // Formulaires
  loginForm = {
    email: '',
    password: ''
  };

  registerForm = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    // Utiliser effect pour réagir aux changements du signal
    effect(() => {
      const user = this.userService.currentUser();
      if (user) {
        this.successMessage = 'Connexion réussie !';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      }
    });
  }

  ngOnInit(): void {}

  flipCard(target: 'front' | 'back'): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (target === 'back') {
      this.isFlipped = true;
    } else {
      this.isFlipped = false;
    }
  }

  onLoginSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.userService.login(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: () => {
          this.successMessage = 'Connexion réussie !';
          this.loginForm = { email: '', password: '' };
          console.log("user connect")
          const form = document.querySelector(".formcontainer") as HTMLElement;
          setTimeout(() => {
            if(form){
              form.classList.remove("active")
            }
          }, 500);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la connexion';
        }
      });
  }

  onRegisterSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.registerForm.username || !this.registerForm.email || 
        !this.registerForm.password || !this.registerForm.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.userService.register(
      this.registerForm.username,
      this.registerForm.email,
      this.registerForm.password
    ).subscribe({
      next: () => {
        this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        this.registerForm = {
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        };
        setTimeout(() => {
          this.flipCard('front');
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
}

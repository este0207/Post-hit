import { Component, OnInit, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../user-service';
import { Router } from '@angular/router';


declare global {
  interface Window {
    handleCredentialResponse: (response: any) => void;
  }
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {

  closeForm(){
    const formcontainer = document.querySelector(".formcontainer") as HTMLElement;
    if (formcontainer) {
      formcontainer.classList.remove("active");
      document.body.style.overflowY = "scroll";
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
        // Ne pas rediriger si on est déjà sur /success
        if (this.router.url !== '/success') {
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        }
      }
    });
  }

  ngOnInit(): void {
    window.handleCredentialResponse = (response: any) => {
      this.onGoogleSignIn(response);
    };
  }

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
              document.body.style.overflowY = "scroll";
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
        this.userService.sendMail(this.registerForm.email).subscribe({
          next: () => {
            console.log('Mail de confirmation envoyé');
          },
          error: (error) => {
            console.error('Erreur lors de l\'envoi du mail', error);
          }
        });
        setTimeout(() => {
          this.flipCard('front');
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }

  onGoogleSignIn(response: any) {
    // response.credential contient le JWT Google
    this.errorMessage = '';
    this.successMessage = '';
    if (!response.credential) {
      this.errorMessage = 'Erreur Google : token manquant.';
      return;
    }
    this.userService.loginWithGoogle(response.credential)
      .subscribe({
        next: (user) => {
          this.successMessage = 'Connexion Google réussie !';
          // Envoi du mail de confirmation si email présent
          if (user && user.email) {
            this.userService.sendMail(user.email).subscribe({
              next: () => {
                console.log('Mail de confirmation envoyé');
              },
              error: (error) => {
                console.error('Erreur lors de l\'envoi du mail', error);
              }
            });
          }
          const form = document.querySelector('.formcontainer') as HTMLElement;
          setTimeout(() => {
            if (form) {
              form.classList.remove('active');
            }
          }, 500);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la connexion Google';
        }
      });
  }
}

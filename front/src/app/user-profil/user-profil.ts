import { Component, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user-service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrbitControls } from 'three-stdlib';

@Component({
  selector: 'app-user-profil',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profil.html',
  styleUrl: './user-profil.css'
})
export class UserProfil implements OnInit{
  profilForm: FormGroup;
  message: string = '';

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.profilForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      const profilContainer = document.querySelector(".profilContainer") as HTMLElement;
      if (profilContainer) {
        profilContainer.classList.toggle("active");
      }
    }, 700);
    // Pré-remplir le formulaire avec les infos actuelles
    const user = this.userService.currentUser();
    if (user) {
      this.profilForm.patchValue({
        username: user.username,
        email: user.email
      });
    }
  }

  username = computed(() => {
    const user = this.userService.currentUser();
    return user?.username ?? '';
  });

  email = computed(() => {
    const user = this.userService.currentUser();
    return user?.email ?? '';
  });

  userId = computed(() => {
    const user = this.userService.currentUser();
    return user?.id ?? '';
  });

  onSubmit() {
    if (this.profilForm.invalid) {
      this.message = 'Veuillez remplir correctement le formulaire.';
      return;
    }
    const { username, email, password, confirmPassword } = this.profilForm.value;
    if (password && password !== confirmPassword) {
      this.message = 'Les mots de passe ne correspondent pas.';
      return;
    }
    const user = this.userService.currentUser();
    if (user && user.id) {
      this.userService.updateUser(user.id, username, email, password || undefined).subscribe({
        next: () => {
          this.message = 'Profil mis à jour avec succès !';
        },
        error: () => {
          this.message = 'Erreur lors de la mise à jour.';
        }
      });
    }
  }
}

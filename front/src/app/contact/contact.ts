import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user-service';
import { NotificationService } from '../notification';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit{
  contactForm: FormGroup;
  sending: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      const contactContainer = document.querySelector('.contactContainer') as HTMLElement;
      if (contactContainer) {
        contactContainer.classList.add("active");
      }
    }, 700);
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.notificationService.showNotification('Veuillez remplir tous les champs correctement.', 'error');
      return;
    }
    this.sending = true;
    const { email, message } = this.contactForm.value;
    this.userService.sendMailContact(email, message).subscribe({
      next: () => {
        this.notificationService.showNotification('Message envoyé avec succès !', 'success');
        this.contactForm.reset();
        this.sending = false;
      },
      error: () => {
        this.notificationService.showNotification("Erreur lors de l'envoi du message.", 'error');
        this.sending = false;
      }
    });
  }
}

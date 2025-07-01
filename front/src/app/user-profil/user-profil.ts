import { Component, computed, OnInit } from '@angular/core';
import { UserService } from '../user-service';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-user-profil',
  imports: [Navbar],
  templateUrl: './user-profil.html',
  styleUrl: './user-profil.css'
})
export class UserProfil implements OnInit{
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    setTimeout(() => {
      const profilContainer = document.querySelector(".profilContainer") as HTMLElement;
      if (profilContainer) {
        profilContainer.classList.toggle("active");
      }
    }, 700);
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
}

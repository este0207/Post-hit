import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiURL; 
  private userSignal = signal<User | null>(null);
  private usersSignal = signal<User[]>([]);

  constructor(private http: HttpClient) {
    // Vérifier l'état de connexion au démarrage
    this.checkAuthState();
  }

  // Getters pour les signaux
  get currentUser() {
    return this.userSignal.asReadonly();
  }

  get allUsers() {
    return this.usersSignal.asReadonly();
  }

  // Vérifier et restaurer l'état de connexion
  private checkAuthState(): void {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Vérifier la validité du token avec le serveur
      this.http.post<{message: string, user: User, token: string}>(`${this.apiUrl}/users/login`, { token })
        .pipe(
          tap(response => {
            if (response.user) {
              this.userSignal.set(response.user);
              console.log('État de connexion restauré:', response.user);
            }
          })
        )
        .subscribe({
          error: (error) => {
            console.log('Token invalide, suppression du localStorage');
            localStorage.removeItem('jwt_token');
            this.userSignal.set(null);
          }
        });
    }
  }

  // Méthode publique pour vérifier l'état de connexion
  public isAuthenticated(): boolean {
    return this.userSignal() !== null;
  }

  // Méthode pour forcer la vérification de l'état de connexion
  public refreshAuthState(): void {
    this.checkAuthState();
  }

  // Méthodes pour interagir avec l'API
  login(email: string, password: string): Observable<User> {
    interface LoginResponse {
      message: string;
      user: User;
      token: string;
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          if (response.token) {
            localStorage.setItem('jwt_token', response.token);
          }
          this.userSignal.set(response.user);
          console.log('Signal utilisateur mis à jour:', this.userSignal());
        }),
        map(response => response.user)
      );
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/signup`, { username, email, password })
      .pipe(
        tap(user => this.userSignal.set(user))
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
      .pipe(
        tap(users => this.usersSignal.set(users))
      );
  }

  updateUser(id: number, username: string, email: string, password?: string): Observable<User> {
    const body: any = { username, email };
    if (password) body.password = password;
    return this.http.put<User>(`${this.apiUrl}/update-user/${id}`, body)
      .pipe(
        tap(user => {
          this.userSignal.set(user);
          // Mettre à jour la liste des utilisateurs
          const currentUsers = this.usersSignal();
          const index = currentUsers.findIndex(u => u.id === user.id);
          if (index !== -1) {
            currentUsers[index] = user;
            this.usersSignal.set([...currentUsers]);
          }
        })
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`)
      .pipe(
        tap(() => {
          const currentUsers = this.usersSignal();
          this.usersSignal.set(currentUsers.filter(user => user.id !== id));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.userSignal.set(null);
  }

  loginWithGoogle(credential: string): Observable<User> {
    interface GoogleLoginResponse {
      message: string;
      user: User;
      token: string;
    }
    return this.http.post<GoogleLoginResponse>(`${this.apiUrl}/google-login`, { credential })
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('jwt_token', response.token);
          }
          this.userSignal.set(response.user);
        }),
        map(response => response.user)
      );
  }

  sendMail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-mail`, { email });
  }

  sendMailContact(email: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-mail-contact`, { email, message });
  }
}

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

  constructor(private http: HttpClient) { }

  // Getters pour les signaux
  get currentUser() {
    return this.userSignal.asReadonly();
  }

  get allUsers() {
    return this.usersSignal.asReadonly();
  }

  // Méthodes pour interagir avec l'API
  login(email: string, password: string): Observable<User> {
    interface LoginResponse {
      message: string;
      user: User;
      token: string;
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
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
    return this.http.post<User>(`${this.apiUrl}/signup`, { username, email, password })
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

  updateUser(id: number, username: string, email: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, { username, email })
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
          // Mettre à jour la liste des utilisateurs
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
}

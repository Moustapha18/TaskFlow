import { computed, inject, Service, signal } from '@angular/core';
import { User } from './user.model';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

interface StoredSession {
  token: string;
  user: User;
  expiresAt: number
}

const STORAGE_KEY = 'taskflow.session';
// Une session utilisateur doit durer raisonnablement longtemps.
// 30 min est un bon compromis pour une démo/projet pédagogique.
const SESSION_TTL_MS = 30 * 60_000;   // 30 minutes

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly usersUrl = `${environment.apiUrl}/users`;
  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  private expiresAt: number | null = null;

  //Exposition du signal en lecture seule pour
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._token() != null);

  constructor() {
    const session = this.readStoredSession();
    if(!session) return;
    this._currentUser.set(session.user);
    this._token.set(session.token);
    this.expiresAt = session.expiresAt;
  }

  login(email: string, password: string): Observable<User> {
    return this.http
    .get<Array<User & { password : string}>>(this.usersUrl, {
      params: {email: email.trim().toLocaleLowerCase(), password}
    })
    .pipe(
      map(matches => {
        if(matches.length === 0) throw new Error('Identifiants invalides');
        const {password: _password, ...user} = matches[0];
        return user;
      }),
      tap(user => this.startSession(user))
    );
  }
 register(input: { name: string; email: string; password: string }): Observable<User> {
  const payload = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
  };

  return this.http
    .post<User & { password: string }>(this.usersUrl, payload)
    .pipe(map(({ password: _password, ...user }) => user));
}

  logout(): void {
    this._currentUser.set(null);
    this._token.set(null);
    this.expiresAt = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  getValidToken(): string | null {
    const token = this._token();
    if(!token || !this.expiresAt) return null;
    if(Date.now() > this.expiresAt) {
      this.logout();
      return null;
    }

    return token;
  }

  private startSession(user: User): void {
    const token = crypto.randomUUID();
    const expiresAt = Date.now() + SESSION_TTL_MS;
    this._currentUser.set(user);
    this._token.set(token);
    this.expiresAt = expiresAt;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({token, user, expiresAt} satisfies StoredSession))
  }

  private readStoredSession(): StoredSession | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;

    const session: StoredSession = JSON.parse(raw);
    if(Date.now() > session.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  }

}

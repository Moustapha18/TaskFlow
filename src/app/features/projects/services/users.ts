import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../../core/auth/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal(true);

  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly usersCount = computed(() => this._users().length);

  constructor() {
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => {
        this._users.set(users);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  getById(id: number): User | undefined {
    return this._users().find((u) => u.id === id);
  }
}

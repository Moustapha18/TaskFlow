import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../auth/auth';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';

// Seules les requêtes qui modifient une ressource exigent un jeton,
// SAUF l'inscription (POST /users) qui est publique.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isWriteApiCall = req.url.startsWith(environment.apiUrl) && req.method !== 'GET';
  const isPublicRegister = req.method === 'POST' && req.url === `${environment.apiUrl}/users`;

  if (!isWriteApiCall || isPublicRegister) {
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.getValidToken();

  if (!token) {
    return throwError(
      () => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized', url: req.url })
    );
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

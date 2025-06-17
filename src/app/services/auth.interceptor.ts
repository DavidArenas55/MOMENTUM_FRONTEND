// src/app/interceptors/auth.interceptor.ts
import { inject } from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpHandlerFn} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  // Obtenemos el access token del localStorage
  const token = authService.getAccessToken();
  // Clonamos la petición si tenemos token, para añadir el header Authorization
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Procesamos la petición
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 y no es una petición a la ruta /refresh (para evitar loops)
      if (error.status === 401 && !req.url.includes('/users/refresh')) {
        // Intentamos refrescar el token
        return authService.refreshToken().pipe(
          switchMap((res: any) => {
            const newToken = res.accessToken;
            if (newToken) {
              // Guardamos el nuevo token
              localStorage.setItem('accessToken', newToken);
              // Reintentamos la petición original con el nuevo token
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(retryReq);
            } else {
              // Si no se obtuvo un token, redirige a login
              handleAuthError();
              return throwError(() => error);
            }
          }),
          catchError((refreshError) => {
            // Si refresh falla, redirige a login
            handleAuthError();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
}

function handleAuthError() {
  const toastr = inject(ToastrService);
  const router = inject(Router);

  // Elimina el token y notifica al usuario
  localStorage.removeItem('accessToken');
  toastr.error(
    'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
    'Sesión Expirada',
    { timeOut: 3000, closeButton: true }
  );
  router.navigate(['/login']);
}

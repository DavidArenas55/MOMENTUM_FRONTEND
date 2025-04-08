// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtenemos el access token del localStorage
    const token = this.authService.getAccessToken();
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
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el error es 401 y no es una petición a la ruta /refresh (para evitar loops)
        if (error.status === 401 && !req.url.includes('/users/refresh')) {
          // Intentamos refrescar el token
          return this.authService.refreshToken().pipe(
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
                return next.handle(retryReq);
              } else {
                // Si no se obtuvo un token, redirige a login
                this.handleAuthError();
                return throwError(() => error);
              }
            }),
            catchError((refreshError) => {
              // Si refresh falla, redirige a login
              this.handleAuthError();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  private handleAuthError() {
    // Elimina el token y notifica al usuario
    localStorage.removeItem('accessToken');
    this.toastr.error(
      'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
      'Sesión Expirada',
      { timeOut: 3000, closeButton: true }
    );
    this.router.navigate(['/login']);
  }
}

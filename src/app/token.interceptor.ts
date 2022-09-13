import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const newRequest = request.clone({
      // params: request.params.append('token', 'hi-there'),
      url: `https://pendo-api.herokuapp.com/${request.url}`,
    });
    return next.handle(newRequest).pipe(
      // Handle error of all http requests
      // Simply show it for now
      catchError((error) => {
        console.log('😎 ~ error', error);
        this.snackBar.open(
          error.error?.message ?? 'Something went wrong',
          undefined,
          {
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );
        return throwError(() => error);
      })
    );
  }
}

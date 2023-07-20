import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map, tap } from 'rxjs';
import { User } from 'src/app/models/user.models';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged())

  public isAuthenticated = this.currentUser.pipe(map((user) => !!user));

  apiUrl = 'http://localhost:3000';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router
  ) { }

  login(data: {
    email: string;
    password: string;
  }): Observable<any> {
    return this.httpClient
    .post<{ user: User }>("auth/sign_in", { user: data }, { observe: 'response' })
    .pipe(
      tap(response => {
        const user: User | undefined = response.body?.user;
        const token: string | null = response.headers.get('Authorization') || null;

        if (user && token) {
          user.token = token;
          this.setAuth(user);
        }
      })
    );
  }

  register(data: {
    username: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.httpClient
    .post<{ user: User }>("auth", { user: data }, { observe: 'response' })
    .pipe(
      tap(response => {
        const user: User | undefined = response.body?.user;
        const token: string | null = response.headers.get('Authorization') || null;

        if (user && token) {
          user.token = token;
          this.setAuth(user);
        }
      })
    );
  }

  logout(): void {
    this.purgeAuth();
    void this.router.navigate(["/welcome"]);
  }

  setAuth(user: User): void {
    this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
  }
}

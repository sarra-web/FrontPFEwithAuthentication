import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8082/api/auth/';
const AUTH_API2 = 'http://localhost:8082/api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
      }, httpOptions
      );
    }
    update(data: any): Observable<any> {
      return this.http.put(`${AUTH_API2}`, data);
    }
    logout(): Observable<any> {
      return this.http.post(AUTH_API + 'signout', { }, httpOptions);
    }
    deleteAll(): Observable<any> {
      return this.http.delete(`${AUTH_API}`);
    }
  }

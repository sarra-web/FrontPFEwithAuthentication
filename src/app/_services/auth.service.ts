import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../model/User';
import { Router } from '@angular/router';

const AUTH_API = 'http://localhost:8082/api/auth/';
const AUTH_API2 = 'http://localhost:8082/api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  constructor(private router: Router,private http: HttpClient) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    )
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    /*.pipe(map(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
      return user;
  }));*/;
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
      return this.http.put(AUTH_API2+"/a", data, httpOptions);
    }
    logout(): Observable<any> {
      //localStorage.removeItem('user');
     // this.userSubject.next(null);
      return this.http.post(AUTH_API + 'signout', { }, httpOptions);


    }
    deleteAll(): Observable<any> {
      return this.http.delete(`${AUTH_API}`);
    }
  }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { Observable } from 'rxjs';
import { ApiResponse } from '../model/api-response';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class BoardAdminService {

  constructor(private http: HttpClient) {  }
  apiurl = 'http://localhost:8082/api/auth';

  users$ = (page: number = 0, size: number = 10): Observable<ApiResponse<Page>> =>    this.http.get<any>(`${this.apiurl}/users?page=${page}&size=${size}`);

  GetAllUser():Observable<User[]> {
    return this.http.get<User[]>(this.apiurl+'/AllUsers');
  }
  GetUsers():Observable<any> {
    return this.http.get<any>(this.apiurl+'/users');
  }

  GetUserbyId(UserId: any) {
    return this.http.get(this.apiurl +'/' + UserId);
  }

  RemoveUser(UserId: any) {
    return this.http.delete(this.apiurl +'/'+ UserId);
  }


  UpdateUser(inputdata: any) {
    return this.http.put(this.apiurl , inputdata);
  }

  GetAllRoles(){
    return this.http.get(this.apiurl+'/AllRoles');
  }





}

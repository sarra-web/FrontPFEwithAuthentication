import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../model/Project';
import { ApiResponse } from '../model/api-response';
import { Page } from '../model/page';


const baseUrl = 'http://localhost:8080/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectServiceService {

  constructor(private http: HttpClient) { }


  projects$ = (page: number = 0, size: number = 10): Observable<ApiResponse<Page>> =>    this.http.get<any>(`${baseUrl}/projects?name=${name}&?page=${page}&size=${size}`);

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(baseUrl);
  }

  get(id: any): Observable<Project> {
    return this.http.get<Project>(`${baseUrl}/${id}`);//pas encore en backend
  }


  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}`, data);
  }
  updateProx(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/pushToProxem`, data);
  }

  appelerAPIAvecMethodePersonnalisee(data:any): Observable<any> {

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const request = new HttpRequest('CUSTOM', baseUrl+'/pushToProxem', { data }, { headers: headers });

    return this.http.request(request);
  }



  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(`${baseUrl}/projects`);
  }

  findByName(name: any): Observable<Project[]> {
    return this.http.get<Project[]>(`${baseUrl}?name=${name}`);
  }
  findByName2(name: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/${name}`);
  }
}


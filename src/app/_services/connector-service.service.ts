import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConnectorCSV } from '../model/ConnectorCSV copy';
import { ApiResponse } from '../model/api-response';
import { Page } from '../model/page';
import { Connector } from '../model/Connector';



const baseUrl = 'http://localhost:8080/configuration';

@Injectable({
  providedIn: 'root'
})
export class ConnectorServiceService {

  constructor(private http: HttpClient) { }


  connectors$ = (page: number = 0, size: number = 10): Observable<ApiResponse<Page>> =>    this.http.get<any>(`${baseUrl}/connectors?page=${page}&size=${size}`);

  getAll(): Observable<ConnectorCSV[]> {
    return this.http.get<ConnectorCSV[]>(baseUrl);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/findById/${id}`);
  }
  get2(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/findById2/${id}`);
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

  getAllConnectors(params: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/connectors`, { params });
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(`${baseUrl}/connectors`);
  }

  findByName(name: any): Observable<ConnectorCSV> {
    return this.http.get<ConnectorCSV>(`${baseUrl}/${name}`);
  }
  findByNameIgnoreCase(name: any): Observable<ConnectorCSV[]> {
    return this.http.get<ConnectorCSV[]>(`${baseUrl}/NameContainsIgnoreCase/${name}`);
  }
  findByNameContaining(params: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/connectors`,{params});
  }
  findByProjectName(params: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/connectorsByProjectName`,{params});
  }

}


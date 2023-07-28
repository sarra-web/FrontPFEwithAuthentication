import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../model/api-response';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { ConnectorJDBC } from '../model/ConnectorJDBC';

const baseUrl = 'http://localhost:8080/configurationJDBC';

@Injectable({
  providedIn: 'root'
})
export class ConnectorJDBCService {
  constructor(private http: HttpClient) { }


  connectors$ = (page: number = 0, size: number = 10): Observable<ApiResponse<Page>> =>    this.http.get<any>(`${baseUrl}/connectors?page=${page}&size=${size}`);

  getAll(): Observable<ConnectorJDBC[]> {
    return this.http.get<ConnectorJDBC[]>(baseUrl);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/findById/${id}`);
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
  updateProxPlusCheck(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/pushToProxemFromcheckPoint`, data);
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

  findByName(name: any): Observable<ConnectorJDBC> {
    return this.http.get<ConnectorJDBC>(`${baseUrl}/${name}`);
  }
  findByNameIgnoreCase(name: any): Observable<ConnectorJDBC[]> {
    return this.http.get<ConnectorJDBC[]>(`${baseUrl}/NameContainsIgnoreCase/${name}`);
  }
  findByNameContaining(params: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/connectors`,{params});
  }
extract(con:any): Observable<any> {
    return this.http.post(`${baseUrl}/extract`,con);
  }
}



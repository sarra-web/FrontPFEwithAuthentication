
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../model/api-response';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { ConnectorNoSQL } from '../model/ConnectorNoSQL';

const baseUrl = 'http://localhost:8080/configurationNoSQL';
const baseUrl2 = 'http://localhost:8080/configurationNoSQL/testConnection';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class ConnectorNoSQLService  {
  constructor(private http: HttpClient) { }


  connectors$ = (page: number = 0, size: number = 10): Observable<ApiResponse<Page>> =>    this.http.get<any>(`${baseUrl}/connectors?page=${page}&size=${size}`);

  getAll(): Observable<ConnectorNoSQL[]> {
    return this.http.get<ConnectorNoSQL[]>(baseUrl);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/findById/${id}`);
  }


  create(data: any): Observable<any> {
    return this.http.post(baseUrl+"/CreateNoSQLConnector", data);
  }
  testConnection(data:any): Observable<any> {
    return this.http.post(baseUrl2,data);
  }
  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/UpadateNoSQLconnector`, data);
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

  findByName(name: any): Observable<ConnectorNoSQL> {
    return this.http.get<ConnectorNoSQL>(`${baseUrl}/${name}`);
  }
  findByNameIgnoreCase(name: any): Observable<ConnectorNoSQL[]> {
    return this.http.get<ConnectorNoSQL[]>(`${baseUrl}/NameContainsIgnoreCase/${name}`);
  }
  findByNameContaining(params: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/connectors`,{params});
  }
extract(con:any): Observable<any> {
    return this.http.post(`${baseUrl}/extract`,con);
  }
}



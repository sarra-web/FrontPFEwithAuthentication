import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../model/api-response';
import { Observable } from 'rxjs';
import { Page } from '../model/page';
import { ConnectorXML } from '../model/ConnectorXML';

const baseUrl = 'http://localhost:8080/configurationXML';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class XmlConnectorService {
  constructor(private http: HttpClient) { }


  connectors$ = (page: number = 0, size: number = 10): Observable<ApiResponse<Page>> =>    this.http.get<any>(`${baseUrl}/connectors?page=${page}&size=${size}`);

  getAll(): Observable<ConnectorXML[]> {
    return this.http.get<ConnectorXML[]>(baseUrl);
  }

  get(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/findById/${id}`);
  }
  

  create(data: any): Observable<any> {
    return this.http.post(baseUrl+"/CreateXMLConnector", data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/UpadateXMLconnector`, data);
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

  findByName(name: any): Observable<ConnectorXML> {
    return this.http.get<ConnectorXML>(`${baseUrl}/${name}`);
  }
  findByNameIgnoreCase(name: any): Observable<ConnectorXML[]> {
    return this.http.get<ConnectorXML[]>(`${baseUrl}/NameContainsIgnoreCase/${name}`);
  }
  findByNameContaining(params: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/connectors`,{params});
  }
extract(con:any): Observable<any> {
    return this.http.post(`${baseUrl}/extract`,con);
  }
}



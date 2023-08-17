import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Scheduler } from '../../model/Scheduler';
import { ApiResponse } from '../../model/api-response';
import { Page } from '../../model/page';

const baseUrl = 'http://localhost:8080/squeduler';
const baseUrl2 = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  planifierCSV(data:any) {
    return this.http.post(`${baseUrl2}/ScheduleScanCSV`, data);
  }
  planifierJDBC(data:any) {
    return this.http.post(`${baseUrl2}/ScheduleScanJDBC`, data);
  }

  constructor(private http: HttpClient) { }
  getAllByConnectorDAOId(idConnector:any): Observable<Scheduler[]> {
    return this.http.get<Scheduler[]>(`${baseUrl}/ConnectorDAOs/${idConnector}/SquedulerDAOs`);
  }

  getAllByConnectorDAOIdWithPagination(params:any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/pagination/ConnectorDAOs/${params.id}/SquedulerDAOs`);
  }
  schedulers$ = (id:string,page: number = 0, size: number = 10): Observable<ApiResponse<Page>> =>    this.http.get<any>(`${baseUrl}/pagination/ConnectorDAOs/${id}/SquedulerDAOs?page=${page}&size=${size}`);

  getById(id: any): Observable<Scheduler> {
    return this.http.get<Scheduler>(`${baseUrl}/SquedulerDAOs/${id}`);
  }

  create(data: any,idConnector:any): Observable<any> {
    return this.http.post(`${baseUrl}/ConnectorDAOs/${idConnector}/SquedulerDAOs`, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/SquedulerDAOs/${id}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/SquedulerDAOs/${id}`);
  }
  deleteAll(idConnector:any): Observable<any> {
    return this.http.delete(`${baseUrl}/ConnectorDAOs/${idConnector}/SquedulerDAOs`);
  }

  findByName(name: any): Observable<Scheduler[]> {
    return this.http.get<Scheduler[]>(`${baseUrl}?name=${name}`);
  }



}

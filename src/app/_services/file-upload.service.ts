import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:8080';
  private baseUrl2 = 'http://localhost:8080/configuration';

  //private filename:any;
  private filename:any;

  constructor(private http: HttpClient) { }

  removeAll():void{
    this.http.delete(`${this.baseUrl}/filess`)
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    this.filename=file.name;
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'

    });

    return this.http.request(req);
  }
 /* upload(file: File):void  {
    const formData: FormData = new FormData();

    formData.append('file', file);
    this.filename=file.name;
    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'

    });
  }*/


  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
  ExtactData(name:any):Observable<any>{
    return this.http.get(`${this.baseUrl}/csv/${name}`);
}
create(data: any): Observable<any> {
  return this.http.post(this.baseUrl2, data);
}


}

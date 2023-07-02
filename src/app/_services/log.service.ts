import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private backendUrl = 'http://localhost:8080/configuration/log'; // Remplacez l'URL par celle de votre backend
  constructor(private http: HttpClient) { }

  getFile(filename: string): Promise<Blob> {
    return this.http.get(`${this.backendUrl}/${filename}`, { responseType: 'blob' })
      .toPromise().then((response: any) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        return blob;
      });
  }

  private extractFile(response: HttpResponse<Blob>): Blob {
    const contentDispositionHeader: string = response.headers.get('content-disposition');
    const filename: string = contentDispositionHeader.split(';')[1].split('filename=')[1].trim();
    const blob: Blob = response.body;
    const file = new Blob([blob], { type: blob.type });

    return file;
}
getFile2(filename: string): Promise<string> {
  return this.http.get(`${this.backendUrl}/${filename}`, { responseType: 'text' })
    .toPromise();
}
}

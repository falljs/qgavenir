import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LigneDevisService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private updated = `${this.url}/lignedevi/update`;
  private deleted = `${this.url}/lignedevi/delete`;
  private ligneDevis = `${this.url}/lignedevi/lignedevis`;
  private ligneDevi = `${this.url}/lignedevi/lignedevi`;

  listLigneDevis: any[] = [];
  constructor(private http: HttpClient) { }


  update(data: Object): Observable<Object> {
    return this.http.post(`${this.updated}`, data);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  delete(id: number): Observable<Object> {
    return this.http.get(`${this.deleted}/${id}`);
  }

  getLigneDevi(id: number): Observable<Object> {
    return this.http.get(`${this.ligneDevi}/${id}`);
  }

  getLigneDevis(data: number): Observable<Object> {
    return this.http.get(`${this.ligneDevi}/${data}`);
  }

}

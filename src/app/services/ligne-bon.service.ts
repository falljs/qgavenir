import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LigneBonService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private updated = `${this.url}/lignebon/update`;
  private deleted = `${this.url}/lignebon/delete`;
  private lignebons = `${this.url}/lignebon/lignebons`;
  private lignebon = `${this.url}/lignebon/lignebon`;

  listLigneBon: any = [];
  constructor(private http: HttpClient) { }

  update(data: Object): Observable<Object> {
    return this.http.post(`${this.updated}`, data);
  }

  delete(id: number): Observable<Object> {
    return this.http.get(`${this.deleted}/${id}`);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  getLigneBon(id: number): Observable<Object> {
    return this.http.get(`${this.lignebon}/${id}`);
  }

  getLigneBons(data: number): Observable<Object> {
    return this.http.get(`${this.lignebons}/${data}`);
  }

}

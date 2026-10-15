import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FraisService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private frais = `${this.url}/frais/frais`;
  private created = `${this.url}/frais/create`;
  private deleted = `${this.url}/frais/delete`;
  private searchByDate = `${this.url}/frais/searchByDate`;
  private fraisBy2Date = `${this.url}/frais/fraisBy2Date`;

  listFrais!: any[];

  constructor(private http: HttpClient) { }

  getAllFrais(): Observable<any> {
    return this.http.get(this.frais);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  create(data: any) {
    return this.http.post(`${this.created}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/${id}`, { responseType: 'text' });
  }

  getFaisByDate(date: any): Observable<any> {
    return this.http.get(`${this.searchByDate}/${date}`);
  }

  getFraisBy2Date(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.fraisBy2Date}/${date1}/${date2}`);
  }

}

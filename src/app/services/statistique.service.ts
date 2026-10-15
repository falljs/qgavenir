import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatistiqueService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private index = `${this.url}/statistique/index`;
  private lignestock = `${this.url}/lignestock/lignestock`;
  private lstByDate = `${this.url}/lignestock/lignestockByDate`;
  private lstBy2Date = `${this.url}/lignestock/lignestockByTwoDate`;
  private clientEndetter = `${this.url}/statistique/clientEndetter`;
  private benefice = `${this.url}/statistique/benefice`;
  private allbenefice = `${this.url}/statistique/allbenefice`;
  private beneficeByDate = `${this.url}/statistique/beneficeByDate`;
  private beneficeBy2Date = `${this.url}/statistique/beneficeBy2Date`;

  constructor(private http: HttpClient) { }

  getVentesParJour(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/statistique/ventes`);
  }

  getVentesParJourFexible(start?: string, end?: string) {
    let params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;

    return this.http.get<any[]>(`${this.url}/statistique/ventes_flex`, { params });
  }

  getInfo(): Observable<Object> {
    return this.http.get(`${this.index}`);
  }

  getMostSeller(): Observable<Object> {
    return this.http.get(`${this.lignestock}`);
  }

  getBenefice(): Observable<Object> {
    return this.http.get(`${this.benefice}`);
  }

  getAllBenefice(): Observable<Object> {
    return this.http.get(`${this.allbenefice}`);
  }

  getBeneficeByDate(date: any): Observable<any> {
    return this.http.get(`${this.beneficeByDate}/${date}`);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  getBeneficeBy2Date(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.beneficeBy2Date}/${date1}/${date2}`);
  }

  getMostSellerByDate(date: any): Observable<any> {
    return this.http.get(`${this.lstByDate}/${date}`);
  }

  getMostSellerBy2Date(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.lstBy2Date}/${date1}/${date2}`);
  }

  getCommandesClientEndette(): Observable<Object> {
    return this.http.get(`${this.clientEndetter}`);
  }
}
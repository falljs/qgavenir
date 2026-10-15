import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BonService {
  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private created = `${this.url}/bon/create`;
  private updated = `${this.url}/bon/update`;
  private updatedInfo = `${this.url}/bon/updateInfo`;
  private deleted = `${this.url}/bon/delete`;
  private annuler = `${this.url}/bon/annuler`;
  private reduce = `${this.url}/bon/reduction`;
  private bons = `${this.url}/bon/bons`;
  private bn = `${this.url}/bon/bon`;
  private maxid = `${this.url}/bon/maxId`;
  private searchByClient = `${this.url}/bon/searchByClient`;
  private bonsToDay = `${this.url}/bon/bonsToDay`;
  private convertBon = `${this.url}/bon/bonsToCommande`;

  listBon!: any[];
  bon!: any;
  maxId!: any;
  nbrBon: number = 0;
  totalVente: number = 0;

  constructor(private http: HttpClient, public router: Router) { }

  getBonsDay() {
    this.totalVente = 0
    this.getBonsToDay().subscribe(
      data => {
        this.listBon = data.bons;
        this.nbrBon = this.listBon.length;

        let totalVente = 0;

        for (var i = 0; i < this.nbrBon; i++) {

          if (this.listBon[i].net) {
            totalVente += this.listBon[i].net;
            this.totalVente = totalVente;
          } else {
            totalVente += this.listBon[i].net;
            this.totalVente = totalVente;
          }
        }
      });
  }

  create(data: Object): Observable<Object> {
    return this.http.post(`${this.created}`, data);
  }

  update(data: Object): Observable<Object> {
    return this.http.post(`${this.updated}`, data);
  }

  updateInfo(data: Object): Observable<Object> {
    return this.http.post(`${this.updatedInfo}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/${id}`, { responseType: 'text' });
  }

  cancel(id: number): Observable<any> {
    return this.http.get(`${this.annuler}/${id}`, { responseType: 'text' });
  }

  reduction(data: Object): Observable<Object> {
    return this.http.post(`${this.reduce}`, data);
  }

  getBon(id: number): Observable<Object> {
    return this.http.get(`${this.bn}/${id}`);
  }

  getBonsToDay(): Observable<any> {
    return this.http.get(`${this.bonsToDay}`);
  }

  getBons(): Observable<any> {
    return this.http.get(`${this.bons}`);
  }

  getMaxId(): Observable<any> {
    return this.http.get(`${this.maxid}`);
  }

  bonToCommande(data: Object): Observable<Object> {
    return this.http.post(`${this.convertBon}`, data);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  detail(bon: any) {
    this.getBon(bon.id).subscribe((data) => {
      let response: any = data;
      this.bon = response.bon;
      localStorage.removeItem('bon');
      localStorage.removeItem('client');
      localStorage.removeItem('listLigneBon');
      localStorage.setItem('bon', JSON.stringify(this.bon));
      localStorage.setItem('listLigneBonDetail', JSON.stringify(response.ligneBons));
      localStorage.setItem('client', JSON.stringify(response.client));
      this.router.navigate(['/bon-detail']);
    });
  }

  edit(bon: any) {
    this.getBon(bon.id).subscribe((data) => {
      let response: any = data;
      this.bon = response.bon;
      localStorage.removeItem('bon');
      localStorage.removeItem('client');
      localStorage.removeItem('listLigneBon');
      localStorage.setItem('bon', JSON.stringify(this.bon));
      localStorage.setItem('listLigneBon', JSON.stringify(response.ligneBons));
      localStorage.setItem('client', JSON.stringify(response.client));
      this.router.navigate(['/bon-edit']);
    });
  }

  getBonByCodeClient(code: string): Observable<any> {
    return this.http.get(`${this.searchByClient}/${code}`);
  }

  sendFactureWhatsApp(numero: string) {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/send/bon/whatsapp/${numero}`);
  }

}

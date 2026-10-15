import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DevisService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private created = `${this.url}/devi/create`;
  private updated = `${this.url}/devi/update`;
  private updatedInfo = `${this.url}/devi/updateInfo`;
  private deleted = `${this.url}/devi/delete`;
  private lesdevis = `${this.url}/devi/devis`;
  private devi = `${this.url}/devi/devi`;
  private maxid = `${this.url}/devi/maxId`;
  private search = `${this.url}/devi/search`;
  private searchByDate = `${this.url}/devi/searchByDate`;
  private searchByClient = `${this.url}/devi/searchByClient`;
  private searchByTwoDate = `${this.url}/devi/searchByTwoDate`;
  private devisToDay = `${this.url}/devi/devisToDay`;
  private devisToCommande = `${this.url}/devi/devisToCommande`;
  private devisToBon = `${this.url}/devi/devisToBon`;


  listDevis!: any[];
  devis!: any;
  maxId!: any;
  nbrDvs: number = 0;

  constructor(private http: HttpClient, public router: Router) { }

  getDevisDay() {
    this.getDevisToDay().subscribe(
      data => {
        this.listDevis = data;
        this.nbrDvs = this.listDevis.length;
      });
  }

  create(data: Object): Observable<Object> {
    return this.http.post(`${this.created}`, data);
  }

  setDevisToCommande(data: Object): Observable<Object> {
    return this.http.post(`${this.devisToCommande}`, data);
  }

  setDevisToBon(data: Object): Observable<Object> {
    return this.http.post(`${this.devisToBon}`, data);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
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

  getDevi(id: number): Observable<Object> {
    return this.http.get(`${this.devi}/${id}`);
  }

  getDevisToDay(): Observable<any> {
    return this.http.get(`${this.devisToDay}`);
  }

  getDevis(): Observable<any> {
    return this.http.get(`${this.lesdevis}`);
  }

  getMaxId(): Observable<any> {
    return this.http.get(`${this.maxid}`);
  }

  detail(devis: any) {
    this.getDevi(devis.id).subscribe((data) => {
      let response: any = data;
      this.devis = response.devis;
      localStorage.removeItem('devis');
      localStorage.removeItem('listLigneCommande');
      localStorage.removeItem('client');
      localStorage.removeItem('listLigneDevis');
      localStorage.setItem('devis', JSON.stringify(this.devis));
      localStorage.setItem('listLigneDevisDetail', JSON.stringify(response.listLigneDevis));
      if (response.client) {
        localStorage.setItem('client', JSON.stringify(response.client));
      } else {
        localStorage.setItem('client', JSON.stringify(devis.nom_client));
      }
      this.router.navigate(['/devis-detail']);
    });
  }

  edit(devis: any) {
    this.getDevi(devis.id).subscribe((data) => {
      let response: any = data;
      this.devis = response.devis;
      localStorage.removeItem('devis');
      localStorage.removeItem('client');
      localStorage.removeItem('listLigneDevis');
      localStorage.setItem('devis', JSON.stringify(this.devis));
      localStorage.setItem('listLigneDevis', JSON.stringify(response.listLigneDevis));
      if (response.client) {
        localStorage.setItem('client', JSON.stringify(response.client));
      } else {
        localStorage.setItem('client', JSON.stringify(devis.nom_client));
      }
      this.router.navigate(['/devis-edit']);
    });
  }

  searchDevis(search: any): Observable<any> {
    return this.http.get(`${this.search}/${search}`);
  }

  getDevisByDate(date: any): Observable<any> {
    return this.http.get(`${this.searchByDate}/${date}`);
  }

  getDevisByCodeClient(code: string): Observable<any> {
    return this.http.get(`${this.searchByClient}/${code}`);
  }

  getDevisBy2Dates(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.searchByTwoDate}/${date1}/${date2}`);
  }

  sendFactureWhatsApp(numero: string) {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/send/devis/whatsapp/${numero}`);
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AchatService {
  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private created = `${this.url}/achat/create`;
  private updated = `${this.url}/achat/update`;
  private deleted = `${this.url}/achat/delete`;
  private annuler = `${this.url}/achat/annuler`;
  private achats = `${this.url}/achat/achats`;
  private acht = `${this.url}/achat/achat`;
  private reduce = `${this.url}/achat/reduction`;
  private maxid = `${this.url}/achat/maxId`;
  private search = `${this.url}/achat/search`;

  private searchByDate = `${this.url}/achat/searchByDate`;
  private searchByFn = `${this.url}/achat/searchByFn`;
  private searchByTwoDate = `${this.url}/achat/searchByTwoDate`;
  private achatsToDay = `${this.url}/achat/achatsToDay`;

  private nbrAchatPayer = `${this.url}/achat/nombreAchatsPayer`;
  private nbrAchatEncrs = `${this.url}/achat/nombreAchatsEncours`;
  private nbrAchatRest = `${this.url}/achat/nombreAchatsRestant`;

  private createdRecu = `${this.url}/achat/createRecu`;
  private updatedRecu = `${this.url}/achat/updateRecu`;
  private deletedRecu = `${this.url}/achat/deleteRecu`;
  private recus = `${this.url}/achat/recus`;


  listAchat!: any[];
  listRecu!: any[];
  achat!: any;
  recu!: any;
  maxId!: any;
  nbrAchat: number = 0;

  totalVente: number = 0;
  totalAvance: number = 0;
  totalRestant: number = 0;

  constructor(private http: HttpClient, public router: Router) { }

  getAchatsDay() {
    this.totalVente = 0; this.totalAvance = 0; this.totalRestant = 0;
    this.getAchatsToDay().subscribe(
      data => {
        let response: any = data;
        this.listAchat = response.achats;
        this.nbrAchat = this.listAchat.length;
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.nbrAchat; i++) {

          if (this.listAchat[i].net) {
            totalVente += this.listAchat[i].net;
            this.totalVente = totalVente;
          } else {
            totalVente += this.listAchat[i].net;
            this.totalVente = totalVente;
          }

          if (this.listAchat[i].versement) {
            totalAvance += this.listAchat[i].versement;
            this.totalAvance = totalAvance;
          } else {
            totalAvance += this.listAchat[i].versement;
            this.totalAvance = totalAvance;
          }

          if (this.listAchat[i].restant) {
            totalRestant += this.listAchat[i].restant;
            this.totalRestant = totalRestant;
          } else {
            totalRestant += this.listAchat[i].restant;
            this.totalRestant = totalRestant;
          }
        }
      });
  }

  edit(achat: any) {
    this.getAchat(achat.id).subscribe((data) => {
      let response: any = data;
      this.achat = response.achat;
      localStorage.removeItem('achat')
      localStorage.removeItem('fournisseur')
      localStorage.removeItem('listLigneAchats')
      localStorage.setItem('achat', JSON.stringify(this.achat));
      localStorage.setItem('listLigneAchats', JSON.stringify(response.ligneAchats));
      localStorage.setItem('fournisseur', JSON.stringify(response.fournisseur));
      this.router.navigate(['/achat-edit']);
    });
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  create(data: Object): Observable<Object> {
    return this.http.post(`${this.created}`, data);
  }

  update(data: Object): Observable<Object> {
    return this.http.post(`${this.updated}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/${id}`, { responseType: 'text' });
  }

  cancel(id: number): Observable<any> {
    return this.http.get(`${this.annuler}/${id}`, { responseType: 'text' });
  }

  getAchat(id: number): Observable<Object> {
    return this.http.get(`${this.acht}/${id}`);
  }

  getAchatsToDay(): Observable<any> {
    return this.http.get(`${this.achatsToDay}`);
  }

  getAchats(): Observable<any> {
    return this.http.get(`${this.achats}`);
  }

  getMaxId(): Observable<any> {
    return this.http.get(`${this.maxid}`);
  }

  reduction(data: Object): Observable<Object> {
    return this.http.post(`${this.reduce}`, data);
  }

  detail(achat: any) {
    this.getAchat(achat.id).subscribe((data) => {
      let response: any = data;
      this.achat = response.achat;
      localStorage.removeItem('achat');
      localStorage.removeItem('fournisseur');
      localStorage.removeItem('listLigneAchats');
      localStorage.removeItem('listReglementAchat');
      localStorage.removeItem('is_editable')
      localStorage.setItem('is_editable', JSON.stringify(response.is_editable));
      localStorage.setItem('achat', JSON.stringify(this.achat));
      localStorage.setItem('fournisseur', JSON.stringify(response.fournisseur));
      localStorage.setItem('listLigneAchatDetail', JSON.stringify(response.ligneAchats));
      localStorage.setItem('listReglementAchatDetail', JSON.stringify(response.ligneReglementAchats));
      this.router.navigate(['/achat-detail']);
    });
  }

  searchAchat(search: any): Observable<any> {
    return this.http.get(`${this.search}/${search}`);
  }

  getAchatByDate(date: any): Observable<any> {
    return this.http.get(`${this.searchByDate}/${date}`);
  }

  getAchatByCodeFn(code: string): Observable<any> {
    return this.http.get(`${this.searchByFn}/${code}`);
  }

  getAchatBy2Dates(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.searchByTwoDate}/${date1}/${date2}`);
  }

  getNbrAchatsPayer(): Observable<any> {
    return this.http.get(`${this.nbrAchatPayer}`);
  }

  getNbrAchatsEncours(): Observable<any> {
    return this.http.get(`${this.nbrAchatEncrs}`);
  }

  getNbrAchatsRestant(): Observable<any> {
    return this.http.get(`${this.nbrAchatRest}`);
  }

  createRecu(data: Object): Observable<Object> {
    return this.http.post(`${this.createdRecu}`, data);
  }

  updateRecu(data: Object): Observable<Object> {
    return this.http.post(`${this.updatedRecu}`, data);
  }

  deleteRecu(id: number): Observable<any> {
    return this.http.get(`${this.deletedRecu}/${id}`);
  }

  getRecusAchat(id: number): Observable<any> {
    return this.http.get(`${this.recus}/${id}`);
  }

}

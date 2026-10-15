import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BonAchatService {
  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private created = `${this.url}/bonAchat/create`;
  private updated = `${this.url}/bonAchat/update`;
  private deleted = `${this.url}/bonAchat/delete`;
  private annuler = `${this.url}/bonAchat/annuler`;
  private achats = `${this.url}/bonAchat/bonAchats`;
  private acht = `${this.url}/bonAchat/bonAchat`;
  private maxid = `${this.url}/bonAchat/maxId`;
  private search = `${this.url}/bonAchat/search`;

  private searchByDate = `${this.url}/bonAchat/searchByDate`;
  private searchByFn = `${this.url}/bonAchat/searchByFn`;
  private searchByTwoDate = `${this.url}/bonAchat/searchByTwoDate`;
  private achatsToDay = `${this.url}/bonAchat/bonAchatsToDay`;
  private bonAchatToAchat = `${this.url}/bonAchat/bonAchatToAchat`;


  listAchat!: any[];
  listRecu!: any[];
  achat!: any;
  recu!: any;
  maxId!: any;
  nbrAchat: number = 0;

  constructor(private http: HttpClient, public router: Router) { }

  getBonAchatsDay() {
    this.getBonAchatsToDay().subscribe(
      data => {
        let response: any = data;
        this.listAchat = response.bonAchats;
        this.nbrAchat = this.listAchat.length;
      });
  }

  edit(achat: any) {
    this.getBonAchat(achat.id).subscribe((data) => {
      let response: any = data;
      this.achat = response.bonAchat;
      localStorage.removeItem('bonAchat')
      localStorage.removeItem('fournisseur')
      localStorage.removeItem('listLigneBonAchats')
      localStorage.setItem('bonAchat', JSON.stringify(this.achat));
      localStorage.setItem('listLigneBonAchats', JSON.stringify(response.ligneBonAchats));
      localStorage.setItem('fournisseur', JSON.stringify(response.fournisseur));
      this.router.navigate(['/bon-achat-edit']);
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

  getBonAchat(id: number): Observable<Object> {
    return this.http.get(`${this.acht}/${id}`);
  }

  getBonAchatsToDay(): Observable<any> {
    return this.http.get(`${this.achatsToDay}`);
  }

  getBonAchats(): Observable<any> {
    return this.http.get(`${this.achats}`);
  }

  getMaxId(): Observable<any> {
    return this.http.get(`${this.maxid}`);
  }

  detail(achat: any) {
    this.getBonAchat(achat.id).subscribe((data) => {
      let response: any = data;
      this.achat = response.bonAchat;
      localStorage.removeItem('bonAchat');
      localStorage.removeItem('fournisseur');
      localStorage.removeItem('listLigneAchats');
      localStorage.removeItem('listLigneBonAchat');
      localStorage.removeItem('listLigneBonAchats');
      localStorage.setItem('bonAchat', JSON.stringify(this.achat));
      localStorage.setItem('fournisseur', JSON.stringify(response.fournisseur));
      localStorage.setItem('listLigneBonAchatDetail', JSON.stringify(response.ligneBonAchats));
      this.router.navigate(['/bon-achat-detail']);
    });
  }



  searchBonAchat(search: any): Observable<any> {
    return this.http.get(`${this.search}/${search}`);
  }

  getBonAchatByDate(date: any): Observable<any> {
    return this.http.get(`${this.searchByDate}/${date}`);
  }

  getBonAchatByCodeFn(code: string): Observable<any> {
    return this.http.get(`${this.searchByFn}/${code}`);
  }

  getBonAchatBy2Dates(date1: any, date2: any): Observable<any> {
    return this.http.get(`${this.searchByTwoDate}/${date1}/${date2}`);
  }

  setBonAchatToAchat(data: Object): Observable<Object> {
    return this.http.post(`${this.bonAchatToAchat}`, data);
  }

}

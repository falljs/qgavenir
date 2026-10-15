import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LigneReglementAchatService {
  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private created = `${this.url}/lignereglementachat/create`;
  private updated = `${this.url}/lignereglementachat/update`;
  private deleted = `${this.url}/lignereglementachat/delete`;
  private achats = `${this.url}/lignereglementachat/lignereglementachats`;
  private achat = `${this.url}/lignereglementachat/lignereglementachat`;

  private rembourser = `${this.url}/lignereglementachat/rembourser`;


  private createdFournisseurReglement = `${this.url}/lignereglementachat/createdFournisseurReglement`;
  private reglementsFournisseur = `${this.url}/lignereglementachat/reglementsFournisseur`;
  private reglementsFournisseurByMonth = `${this.url}/lignereglementachat/reglementsFournisseurByMonth`;

  listLigneReglementFournisseur: any = [];

  listLigneReglementAchat: any = [];
  constructor(private http: HttpClient) { }

  create(data: Object): Observable<Object> {
    return this.http.post(`${this.created}`, data);
  }

  remboursement(data: Object): Observable<Object> {
    return this.http.post(`${this.rembourser}`, data);
  }

  update(data: Object): Observable<Object> {
    return this.http.post(`${this.updated}`, data);
  }

  delete(id: number): Observable<Object> {
    return this.http.get(`${this.deleted}/${id}`);
  }

  getLigneReglement(id: number): Observable<Object> {
    return this.http.get(`${this.achat}/${id}`);
  }

  getLigneReglements(data: number): Observable<Object> {
    return this.http.get(`${this.achats}/${data}`);
  }

  // For Client

  setcreatedFournisseurReglement(data: Object): Observable<Object> {
    return this.http.post(`${this.createdFournisseurReglement}`, data);
  }

  getReglementsClient(code: string): Observable<Object> {
    return this.http.get(`${this.reglementsFournisseur}/${code}`);
  }

  getReglementsClientByMonth(code: any, month: any): Observable<any> {
    return this.http.get(`${this.reglementsFournisseurByMonth}/${code}/${month}`);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

}

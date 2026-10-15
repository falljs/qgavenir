import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LigneReglementService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private created = `${this.url}/lignereglement/create`;
  private updated = `${this.url}/lignereglement/update`;
  private deleted = `${this.url}/lignereglement/delete`;
  private commandes = `${this.url}/lignereglement/lignereglements`;
  private commande = `${this.url}/lignereglement/lignereglement`;

  private rembourser = `${this.url}/lignereglement/rembourser`;


  private createdClientReglement = `${this.url}/lignereglement/createdClientReglement`;
  private reglementsClient = `${this.url}/lignereglement/reglementsClient`;
  private reglementsClientByMonth = `${this.url}/lignereglement/reglementsClientByMonth`;

  listLigneReglementClient: any = [];

  listLigneReglement: any = [];
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
    return this.http.get(`${this.commande}/${id}`);
  }

  getLigneReglements(data: number): Observable<Object> {
    return this.http.get(`${this.commandes}/${data}`);
  }

  // For Client

  setCreatedClientReglement(data: Object): Observable<Object> {
    return this.http.post(`${this.createdClientReglement}`, data);
  }

  getReglementsClient(code: string): Observable<Object> {
    return this.http.get(`${this.reglementsClient}/${code}`);
  }

  getReglementsClientByMonth(code: any, month: any): Observable<any> {
    return this.http.get(`${this.reglementsClientByMonth}/${code}/${month}`);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

}

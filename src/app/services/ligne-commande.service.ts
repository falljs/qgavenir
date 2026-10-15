import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LigneCommandeService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private updated = `${this.url}/lignecommande/update`;
  private deleted = `${this.url}/lignecommande/delete`;
  private commandes = `${this.url}/lignecommande/lignecommandes`;
  private commande = `${this.url}/lignecommande/lignecommande`;

  listLigneCommande: any = [];
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

  getLigneCommande(id: number): Observable<Object> {
    return this.http.get(`${this.commande}/${id}`);
  }

  getLigneCommandes(data: number): Observable<Object> {
    return this.http.get(`${this.commandes}/${data}`);
  }

}

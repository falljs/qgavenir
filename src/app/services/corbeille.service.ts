import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorbeilleService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api/corbeille";

  private corbeilles = `${this.url}/corbeille`;
  private deleted = `${this.url}/delete`;
  private vider = `${this.url}/vider`;
  private restored = `${this.url}/restore`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.corbeilles}`);
  }

  /* Service pour corbeille commande */

  deleteCommande(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/commande/${id}`, { responseType: 'text' });
  }

  viderCommande(): Observable<any> {
    return this.http.get(`${this.vider}/commande`, { responseType: 'text' });
  }

  restoreCommande(id: number): Observable<any> {
    return this.http.get(`${this.restored}/commande/${id}`, { responseType: 'text' });
  }

  /* Service pour corbeille devis */

  deleteDevis(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/devis/${id}`, { responseType: 'text' });
  }

  viderDevis(): Observable<any> {
    return this.http.get(`${this.vider}/devis`, { responseType: 'text' });
  }

  restoreDevis(id: number): Observable<any> {
    return this.http.get(`${this.restored}/devis/${id}`, { responseType: 'text' });
  }

  /* Service pour corbeille bon */

  deleteBon(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/bon/${id}`, { responseType: 'text' });
  }

  viderBon(): Observable<any> {
    return this.http.get(`${this.vider}/bon`, { responseType: 'text' });
  }

  restoreBon(id: number): Observable<any> {
    return this.http.get(`${this.restored}/bon/${id}`, { responseType: 'text' });
  }

  /* Service pour corbeille achat */

  deleteAchat(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/achat/${id}`, { responseType: 'text' });
  }

  viderAchat(): Observable<any> {
    return this.http.get(`${this.vider}/achat`, { responseType: 'text' });
  }

  restoreAchat(id: number): Observable<any> {
    return this.http.get(`${this.restored}/achat/${id}`, { responseType: 'text' });
  }

  /* Service pour corbeille bon achat */

  deleteBonAchat(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/bonAchat/${id}`, { responseType: 'text' });
  }

  viderBonAchat(): Observable<any> {
    return this.http.get(`${this.vider}/bonAchat`, { responseType: 'text' });
  }

  restoreBonAchat(id: number): Observable<any> {
    return this.http.get(`${this.restored}/bonAchat/${id}`, { responseType: 'text' });
  }

  /* Service pour corbeille produit */

  deleteProduit(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/produit/${id}`, { responseType: 'text' });
  }

  viderProduit(): Observable<any> {
    return this.http.get(`${this.vider}/produit`, { responseType: 'text' });
  }

  restoreProduit(id: number): Observable<any> {
    return this.http.get(`${this.restored}/produit/${id}`, { responseType: 'text' });
  }

  /* Service pour corbeille mouvement */

  deleteMouvement(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/mouvement/${id}`, { responseType: 'text' });
  }

  viderMouvement(): Observable<any> {
    return this.http.get(`${this.vider}/mouvement`, { responseType: 'text' });
  }

  restoreMouvement(id: number): Observable<any> {
    return this.http.get(`${this.restored}/mouvement/${id}`, { responseType: 'text' });
  }

  /* Service pour corbeille inventaire */

  deleteInventaire(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/inventaire/${id}`, { responseType: 'text' });
  }

  viderInventaire(): Observable<any> {
    return this.http.get(`${this.vider}/inventaire`, { responseType: 'text' });
  }

  restoreInventaire(id: number): Observable<any> {
    return this.http.get(`${this.restored}/inventaire/${id}`, { responseType: 'text' });
  }

  /* Service pour corbeille compte */

  deleteCompte(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/compte/${id}`, { responseType: 'text' });
  }

  viderCompte(): Observable<any> {
    return this.http.get(`${this.vider}/compte`, { responseType: 'text' });
  }

  restoreCompte(id: number): Observable<any> {
    return this.http.get(`${this.restored}/compte/${id}`, { responseType: 'text' });
  }

  /* Service pour corbeille compte */

  deleteUser(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/utilisateur/${id}`, { responseType: 'text' });
  }

  viderUser(): Observable<any> {
    return this.http.get(`${this.vider}/utilisateur`, { responseType: 'text' });
  }

  restoreUser(id: number): Observable<any> {
    return this.http.get(`${this.restored}/utilisateur/${id}`, { responseType: 'text' });
  }

}

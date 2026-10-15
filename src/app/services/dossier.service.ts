import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DossierService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private created = `${this.url}/dossier/create`;
  private updated = `${this.url}/dossier/update`;
  private deleted = `${this.url}/dossier/delete`;
  private gets = `${this.url}/dossier/dossiers`;
  private get = `${this.url}/dossier/dossier`;
  private updatedEtat = `${this.url}/dossier/updateEtat`;
  private search = `${this.url}/dossier/search`;
  private nbrCommDos = `${this.url}/dossier/nombreCommandesDos`;
  private nbrCommDosPay = `${this.url}/dossier/nombreCommandesDosPayer`;
  private nbrCommDosNonPay = `${this.url}/dossier/nombreCommandesDosNonPayer`;

  public listDossiers!: any[];

  constructor(private http: HttpClient) { }

  whatsappRappel(id: number) {
    return this.http.post(`${this.url}/dossier/whatsapp-rappel`, { id });
  }

  /**
  * Mettre à jour le numéro du client/fournisseur
  */
  updatePhone(id: number, phone: string, type: string) {

    return this.http.post(
      `${this.url}/dossier/update-phone`,
      {
        id: id,
        phone: phone,
        type: type
      }
    );

  }

  create(data: Object): Observable<Object> {
    return this.http.post(`${this.created}`, data);
  }

  update(data: Object): Observable<Object> {
    return this.http.post(`${this.updated}`, data);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  delete(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/${id}`, { responseType: 'text' });
  }

  getDossier(id: number): Observable<Object> {
    return this.http.get(`${this.get}/${id}`);
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.gets}`);
  }

  updateEtat(data: Object): Observable<Object> {
    return this.http.post(`${this.updatedEtat}`, data);
  }

  searchDossier(search: any): Observable<Object> {
    return this.http.get(`${this.search}/${search}`);
  }

  getNbrCommDoss(id: number): Observable<any> {
    return this.http.get(`${this.nbrCommDos}/${id}`);
  }

  getNbrCommDossPayer(id: number): Observable<any> {
    return this.http.get(`${this.nbrCommDosPay}/${id}`);
  }

  getNbrCommDossNonPayer(id: number): Observable<any> {
    return this.http.get(`${this.nbrCommDosNonPay}/${id}`);
  }

}

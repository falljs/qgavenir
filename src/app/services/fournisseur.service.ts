import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private fournisseurs = `${this.url}/fournisseur/fournisseurs`;
  private fournisseur = `${this.url}/fournisseur/fournisseur`;
  private codeFournisseur = `${this.url}/fournisseur/fournisseur/code`;
  private created = `${this.url}/fournisseur/create`;
  private updated = `${this.url}/fournisseur/update`;
  private creatCpt = `${this.url}/fournisseur/createCompte`;
  private image = `${this.url}/fournisseur/image`;
  private deleted = `${this.url}/fournisseur/delete`;
  private search = `${this.url}/fournisseur/search`;
  private achat = `${this.url}/fournisseur/achatsFournisseur`;

  listFournisseur!: any[];
  public dataForm!: FormGroup;

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.fournisseurs}`);
  }

  getData(id: number): Observable<Object> {
    return this.http.get(`${this.fournisseur}/${id}`);
  }

  getFournisseurByCode(code: string): Observable<Object> {
    return this.http.get(`${this.codeFournisseur}/${code}`);
  }

  createData(data: Object): Observable<Object> {
    return this.http.post(`${this.created}`, data);
  }

  onPrint(): Observable<any> {
    return this.http.get(`https://www.qg-avenir.iconestock.com/server/public/api/print`);
  }

  updateData(data: Object): Observable<Object> {
    return this.http.post(`${this.updated}`, data);
  }

  createCompte(data: Object): Observable<Object> {
    return this.http.post(`${this.creatCpt}`, data);
  }

  updateImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.image}`, formData);
  }

  deleteData(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/${id}`, { responseType: 'text' });
  }

  searchFournisseur(search: any): Observable<Object> {
    return this.http.get(`${this.search}/${search}`);
  }

  getAchatFournisseur(code: any): Observable<any> {
    return this.http.get(`${this.achat}/${code}`);
  }
}

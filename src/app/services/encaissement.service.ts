import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EncaissementService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private encaissemants = `${this.url}/encaissement/encaissements`;
  private encaissementsToday = `${this.url}/encaissement/encaissementsToday`;
  private encaissementsByDate = `${this.url}/encaissement/encaissementsByDate`;

  private create = `${this.url}/encaissement/create`;
  private update = `${this.url}/encaissement/update`;
  private delete = `${this.url}/encaissement/delete`;

  private valider = `${this.url}/encaissement/valider`;
  private invalider = `${this.url}/encaissement/invalider`;


  private decaissemants = `${this.url}/decaissement/decaissements`;
  private decaissementsToday = `${this.url}/decaissement/decaissementsToday`;
  private decaissementsByDate = `${this.url}/decaissement/decaissementsByDate`;

  private create_decaisse = `${this.url}/decaissement/create`;
  private update_decaisse = `${this.url}/decaissement/update`;
  private delete_decaisse = `${this.url}/decaissement/delete`;

  listEncaissement!: any[];
  listDecaissement!: any[];

  constructor(private http: HttpClient) { }

  createData(data: Object): Observable<Object> {
    return this.http.post(`${this.create}`, data);
  }

  updateData(data: Object): Observable<Object> {
    return this.http.post(`${this.update}`, data);
  }

  valide(data: Object): Observable<Object> {
    return this.http.post(`${this.valider}`, data);
  }

  invalide(data: Object): Observable<Object> {
    return this.http.post(`${this.invalider}`, data);
  }

  deleteData(id: number): Observable<any> {
    return this.http.get(`${this.delete}/${id}`, { responseType: 'text' });
  }

  getEncaissemants(): Observable<any> {
    return this.http.get(`${this.encaissemants}`);
  }

  getEncaissemantsToday(): Observable<any> {
    return this.http.get(`${this.encaissementsToday}`);
  }

  getEncaissemantsByDate(date: any): Observable<any> {
    return this.http.get(`${this.encaissementsByDate}/${date}`);
  }


  ////////////////////  Décaissement ////////////////////


  createData_decaisse(data: Object): Observable<Object> {
    return this.http.post(`${this.create_decaisse}`, data);
  }

  updateData_decaisse(data: Object): Observable<Object> {
    return this.http.post(`${this.update_decaisse}`, data);
  }

  deleteData_decaisse(id: number): Observable<any> {
    return this.http.get(`${this.delete_decaisse}/${id}`, { responseType: 'text' });
  }

  getDecaissemants(): Observable<any> {
    return this.http.get(`${this.decaissemants}`);
  }

  getDecaissemantsToday(): Observable<any> {
    return this.http.get(`${this.decaissementsToday}`);
  }

  getDecaissemantsByDate(date: any): Observable<any> {
    return this.http.get(`${this.decaissementsByDate}/${date}`);
  }

}

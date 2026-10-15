import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InventaireService {
  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private inventaires = `${this.url}/inventaire`;
  private inventaire = `${this.url}/inventaire`;
  private created = `${this.url}/inventaire`;
  private updated = `${this.url}/inventaire`;
  private deleted = `${this.url}/inventaire`;

  maxId!: any;

  constructor(private http: HttpClient, public router: Router) { }

  create(data: Object): Observable<Object> {
    return this.http.post(`${this.created}`, data);
  }

  update(data: Object, id: number): Observable<Object> {
    return this.http.put(`${this.updated}/${id}`, data);
  }

  terminer(data: Object, id: number): Observable<Object> {
    return this.http.put(`${this.updated}/terminer/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.get(`${this.deleted}/${id}`, { responseType: 'text' });
  }

  getInventaires(): Observable<any> {
    return this.http.get(`${this.inventaires}`);
  }

  getInventaire(id: number): Observable<any> {
    return this.http.get(`${this.inventaire}/${id}`);
  }
}

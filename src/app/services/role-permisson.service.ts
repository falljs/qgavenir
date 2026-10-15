import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolePermissonService {
  private url = "https://www.qg-avenir.iconestock.com/server/public/api";
  private onIndex = `${this.url}/role`;
  private onStore = `${this.url}/role`;
  private onShow = `${this.url}/role`;
  private onUpdate = `${this.url}/role`;

  private onDelete = `${this.url}/role`;

  constructor(private http: HttpClient) { }

  index(): Observable<Object> {
    return this.http.get(`${this.onIndex}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  store(info: Object) {
    return this.http.post(`${this.onStore}`, info, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  show(id: number): Observable<Object> {
    return this.http.get(`${this.onShow}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }


  update(info: Object, id: number) {
    return this.http.put(`${this.onUpdate}/${id}`, info, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.onDelete}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => new Error('Something went wrong'));
      })
    );
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Notification } from '../models/Notification';

export interface NotificationResponse {
  success: boolean;
  notifications: Notification[]; // Tableau des notifications
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'https://www.qg-avenir.iconestock.com/server/public/api/notification';  // URL de base

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer les notifications
  getNotifications(): Observable<any> {
    /*const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });*/
    return this.http.get(`${this.apiUrl}/recent`).pipe(
      catchError((error) => {
        console.error('Error fetching notifications:', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour récupérer les notifications
  getAllNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/notifications`).pipe(
      catchError((error) => {
        console.error('Error fetching notifications:', error);
        return throwError(() => error);
      })
    );
  }

  // Méthode pour marquer une notification comme envoyée
  markAsSent(notificationId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${notificationId}/mark-as-sent`, {});
  }

  // Méthode pour chercher des notifications
  searchNotifications(term: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search`, { params: { term } });
  }

}



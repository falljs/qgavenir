import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {

  private url = "https://www.iconestock.com/api";
  private create = `${this.url}/saveSession`;

  private startTime: number = 0;
  private interval: any;

  constructor(private http: HttpClient,) {
    this.loadTime();
  }

  store(data: Object): Observable<Object> {
    return this.http.post(`${this.create}`, data);
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      this.startTime++;
      sessionStorage.setItem('timeSpent', this.startTime.toString());
    }, 1000);
  }

  getTime(): number {
    return this.startTime;
  }

  stopTimer(): void {
    clearInterval(this.interval);
  }

  private loadTime(): void {
    const savedTime = sessionStorage.getItem('timeSpent');
    this.startTime = savedTime ? parseInt(savedTime, 10) : 0;
  }
}

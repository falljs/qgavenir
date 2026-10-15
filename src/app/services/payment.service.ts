import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  private index = `${this.url}/payment/index`;
  private counter = `${this.url}/payment/credit`;

  next_paiement: any = '';
  date_paiement: any = '';
  payment: any = 0;
  credit: any = 0;
  difference: any = 0;
  reste_jour: any = 0;
  check: any = 0;

  constructor(private http: HttpClient) { }

  getPayment(): Observable<Object> {
    return this.http.get(`${this.index}`);
  }

  updateCredit(): Observable<Object> {
    return this.http.get(`${this.counter}`);
  }

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  
  getFormattedDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', year: 'numeric', month: 'short', day: '2-digit'
    };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }

}

import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, fromEvent, merge, Observable, of } from 'rxjs';
import { mapTo, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status$: BehaviorSubject<boolean> = new BehaviorSubject(navigator.onLine);

  constructor(private zone: NgZone) {
    this.monitor();
  }

  private monitor() {
    this.zone.runOutsideAngular(() => {
      merge(
        fromEvent(window, 'online').pipe(mapTo(true)),
        fromEvent(window, 'offline').pipe(mapTo(false))
      )
        .pipe(startWith(navigator.onLine))
        .subscribe((status) => {
          this.zone.run(() => this.status$.next(status));
        });
    });
  }

  get currentStatus(): Observable<boolean> {
    return this.status$.asObservable();
  }

}
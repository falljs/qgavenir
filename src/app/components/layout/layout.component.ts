import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ParametreService } from 'src/app/services/parametre.service';
import { PaymentService } from 'src/app/services/payment.service';
import { TimerService } from 'src/app/services/timer.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;
declare const bootstrap: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  timeSpent: number = 0;
  private interval: any;

  private intervalId: any;
  private elapsedTime: number = 0;

  maintenance: any;
  setting: any;

  pdfUrl!: SafeResourceUrl;

  constructor(private timerService: TimerService, public router: Router,
    public userService: UserService, public paymentService: PaymentService,
    public parametreService: ParametreService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getPayment();
    this.startTimer();
    this.pastime();
  }


  /*
    private timerService: TimerService,

    timeSpent: number = 0;
    private interval: any;

    private intervalId: any;
    private elapsedTime: number = 0;

    this.startTimer();
    this.pastime();
  */
  pastime() {
    this.timerService.startTimer();
    this.interval = setInterval(() => {
      this.timeSpent = this.timerService.getTime();
    }, 1000);
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.elapsedTime += 60; // Incrémente le temps passé
      this.saveElapsedTime(this.elapsedTime);
    }, 60000); // 60 secondes
  }

  saveElapsedTime(data: any) {
    const jsonData = {
      domain: 'https://iconestock.com',
      time_spent: data
    };

    this.timerService.store(jsonData).subscribe({
      next: data => {
        //console.log('Données envoyées avec succès', data);
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


  getPayment() {
    this.paymentService.getPayment().subscribe((data) => {
      let response: any = data;
      localStorage.removeItem('payment');
      localStorage.setItem('payment', this.userService.encrypt(JSON.stringify(response)));
      this.paymentService.payment = response.payment;
      this.paymentService.credit = response.credit;
      this.paymentService.check = response.check;
      if (this.paymentService.payment == 0 && this.paymentService.check == 0) {
        $('#modalPaie').modal('toggle');
      }
    });
  }

  getApiWave() {
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.qg-avenir.iconestock.com/server/public/wave');
    const openModal = document.getElementById('paiementWave') as HTMLElement;
    const modalInstance = bootstrap.Modal.getInstance(openModal) || new bootstrap.Modal(openModal);
    modalInstance.show();
  }

  updateCredit() {
    this.paymentService.updateCredit().subscribe((data) => {
      $('#modalPaie').modal('hide');
      $('#modalPaiementLayout').modal('hide');
    });
  }

  logout() {
    $('#modalPaie').modal('hide');
    $('#modalPaiementLayout').modal('hide');
    this.userService.logout();
  }

}

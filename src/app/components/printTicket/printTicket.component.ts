import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  templateUrl: './printTicket.component.html',
  styleUrls: ['./printTicket.component.scss']
})
export class PrintTicketComponent implements OnInit {

  ticket: any;
  listTicket: any;
  ligneReglementDivers: any;
  year: any;
  constructor(private datePipe: DatePipe,) { window.print(); this.back(); }

  ngOnInit() {
    this.ticket = JSON.parse(localStorage.getItem('ticket')!);
    this.listTicket = JSON.parse(localStorage.getItem('listLigneCommandeDetail')!);
    this.year = this.getYear(new Date(Date.now()));

  }

  back() {
    window.onafterprint = window.close;
  }

  getYear(date: any) {
    return this.datePipe.transform(date, 'yyyy');
  }
}


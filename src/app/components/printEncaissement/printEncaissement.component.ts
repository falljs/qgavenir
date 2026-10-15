import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  templateUrl: './printEncaissement.component.html',
  styleUrls: ['./printEncaissement.component.scss']
})
export class PrintEncaissementComponent implements OnInit {

  encaissement: any;
  year: any;
  constructor(private datePipe: DatePipe,) { window.print(); this.back(); }

  ngOnInit() {
    this.encaissement = JSON.parse(localStorage.getItem('print-encaissement')!);
    this.year = this.getYear(new Date(Date.now()));
  }

  back() {
    window.onafterprint = window.close;
  }

  getYear(date: any) {
    return this.datePipe.transform(date, 'yyyy');
  }
}


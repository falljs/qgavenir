import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  date: any;

  constructor(private router:Router,private datePipe: DatePipe,) { }

  ngOnInit() {
    let date = this.datePipe.transform((new Date), 'yyyy');
    this.date = date;
  }
}

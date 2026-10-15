import { Component, OnInit } from '@angular/core';
import { ParametreService } from './services/parametre.service';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public parametreService: ParametreService, public userService: UserService) { }

  ngOnInit() {
    this.viderCommande();
    this.viderDevis();
    this.viderBon();
    this.viderAchat();
    this.viderBonAchat();
    this.viderProduit();
    this.viderMouvement();
    this.viderInventaire();
    this.viderCompte();
    this.viderUser();
  }

  viderCommande() {
    this.parametreService.viderCommande().subscribe(data => {
      let resp: any = data;
    });
  }

  viderDevis() {
    this.parametreService.viderDevis().subscribe(data => {
      let resp: any = data;
    });
  }

  viderBon() {
    this.parametreService.viderBon().subscribe(data => {
      let resp: any = data;
    });
  }

  viderAchat() {
    this.parametreService.viderAchat().subscribe(data => {
      let resp: any = data;
    });
  }

  viderBonAchat() {
    this.parametreService.viderBonAchat().subscribe(data => {
      let resp: any = data;
    });
  }

  viderProduit() {
    this.parametreService.viderProduit().subscribe(data => {
      let resp: any = data;
    });
  }

  viderMouvement() {
    this.parametreService.viderMouvement().subscribe(data => {
      let resp: any = data;
    });
  }

  viderInventaire() {
    this.parametreService.viderInventaire().subscribe(data => {
      let resp: any = data;
    });
  }

  viderCompte() {
    this.parametreService.viderCompte().subscribe(data => {
      let resp: any = data;
    });
  }

  viderUser() {
    this.parametreService.viderUser().subscribe(data => {
      let resp: any = data;
    });
  }

}
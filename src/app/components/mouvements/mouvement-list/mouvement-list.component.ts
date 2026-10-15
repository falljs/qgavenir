import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AchatService } from 'src/app/services/achat.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-mouvement-list',
  templateUrl: './mouvement-list.component.html',
  styleUrls: ['./mouvement-list.component.scss']
})
export class ListMouvementComponent implements OnInit {

  page: number = 1;
  nbr: number = 0;
  defaultItem: number = 100;
  nbrPage: number = 0;
  date: any;
  codeFn: any;
  status: any;

  isDisable = false;
  isClick = false;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public achatService: AchatService, public router: Router,
    private datePipe: DatePipe, public produitService: ProduitService,
    public userService: UserService, public localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.date = this.datePipe.transform(new Date(Date.now()), 'dd-MM-yyyy');
    this.getMouvements();
    this.refreshRoleAndPermissonsUser();
    // Vérifier si les rôles existent dans l'utilisateur
    if (this.userService.user.roles && this.userService.user.roles.length > 0) {
      // Extraire le nom du premier rôle
      this.firstRoleName = this.userService.user.roles[0].name;
    }
  }

  refreshRoleAndPermissonsUser(): void {
    this.userService.refreshRoleAndPermissonsUser(this.userService.user.id).subscribe(data => {
      let resp: any = data;
      this.userService.user.permissions = resp.user.permissions;
      this.userService.setRoles(resp.user.roles);
    });
  }

  getMouvements() {
    this.isDisable = true;
    this.isClick = true;
    this.produitService.getMouvements().subscribe((data: any) => {
      this.isDisable = false;
      this.isClick = false;
      let response: any = data;
      this.produitService.listMouvements = response.mouvements;
      this.nbrPage = Math.ceil(this.produitService.listMouvements.length / this.defaultItem);
    });
  }

  search() {
    let search: any = $("#inputSearch").val();
    if (search) {
      this.achatService.searchAchat(search).subscribe(
        (res: any[]) => {
          this.achatService.listAchat = res;
          let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

          for (var i = 0; i < this.achatService.listAchat.length; i++) {

            if (this.achatService.listAchat[i].net) {
              totalVente += this.achatService.listAchat[i].net;
              this.achatService.totalVente = totalVente;
            } else {
              totalVente += this.achatService.listAchat[i].net;
              this.achatService.totalVente = totalVente;
            }

            if (this.achatService.listAchat[i].versement) {
              totalAvance += this.achatService.listAchat[i].versement;
              this.achatService.totalAvance = totalAvance;
            } else {
              totalAvance += this.achatService.listAchat[i].versement;
              this.achatService.totalAvance = totalAvance;
            }

            if (this.achatService.listAchat[i].restant) {
              totalRestant += this.achatService.listAchat[i].restant;
              this.achatService.totalRestant = totalRestant;
            } else {
              totalRestant += this.achatService.listAchat[i].restant;
              this.achatService.totalRestant = totalRestant;
            }
          }
        });
    } else {
      this.achatService.getAchatsDay();
    }
  }

  OnChangeStatus(ctrl: any) {
    if (ctrl.value) {
      this.achatService.totalVente = 0;
      this.achatService.totalAvance = 0;
      this.achatService.totalRestant = 0;
      this.status = ctrl.value;
      if (this.status == 'payer') {
        this.getAchatsPayer();
      }
      if (this.status == 'cours') {
        this.getAchatsEncours();
      }
      if (this.status == 'nonPay') {
        this.getAchatsRestant();
      }
    }
    else {
      this.achatService.getAchatsDay();
    }
  }

  onChangeDate(ctrl: any) {
    if (ctrl.value) {
      this.achatService.totalVente = 0;
      this.achatService.totalAvance = 0;
      this.achatService.totalRestant = 0;
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.achatService.getAchatByDate(date).subscribe(
        (data: any) => {
          let response: any = data;
          this.achatService.listAchat = response.achats;
          this.nbr = this.achatService.listAchat.length;
          this.nbrPage = Math.ceil(this.nbr / this.defaultItem);

        });
    } else {
      this.achatService.getAchatsDay();
    }
  }

  OnChangeFournisseur(ctrl: any) {
    if (ctrl.value) {
      this.achatService.totalVente = 0;
      this.achatService.totalAvance = 0;
      this.achatService.totalRestant = 0;
      this.codeFn = ctrl.value;
      this.achatService.getAchatByCodeFn(this.codeFn).subscribe(
        (data: any[]) => {
          this.achatService.listAchat = data;
          this.achatService.nbrAchat = this.achatService.listAchat.length;
          this.nbr = this.achatService.listAchat.length;
          this.nbrPage = Math.ceil(this.nbr / this.defaultItem);
        });
    }
    else {
      this.achatService.getAchatsDay();
    }
  }

  onChange2DatesFirst(ctrl: any) {
    if (ctrl.value) {
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.date = date;
    }
  }

  onChange2DatesSecond(ctrl: any) {
    if (ctrl.value) {
      this.achatService.totalVente = 0;
      this.achatService.totalAvance = 0;
      this.achatService.totalRestant = 0;
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.achatService.getAchatBy2Dates(this.date, date).subscribe(
        (data: any) => {
          let response: any = data;
          this.achatService.listAchat = response.achats;
          this.achatService.nbrAchat = this.achatService.listAchat.length;
          this.nbr = this.achatService.listAchat.length;
          this.nbrPage = Math.ceil(this.nbr / this.defaultItem);
        });
    } else {
      this.achatService.getAchatsDay();
    }
  }

  getAchatsPayer() {
    this.achatService.totalVente = 0;
    this.achatService.totalAvance = 0;
    this.achatService.totalRestant = 0;
    this.achatService.getNbrAchatsPayer().subscribe(
      (data: any[]) => {
        this.achatService.listAchat = data;
        this.achatService.nbrAchat = this.achatService.listAchat.length;
        this.nbr = this.achatService.listAchat.length;
        this.nbrPage = Math.ceil(this.nbr / this.defaultItem);
      });
  }

  getAchatsEncours() {
    this.achatService.totalVente = 0;
    this.achatService.totalAvance = 0;
    this.achatService.totalRestant = 0;
    this.achatService.getNbrAchatsEncours().subscribe(
      (data: any[]) => {
        this.achatService.listAchat = data;
        this.achatService.nbrAchat = this.achatService.listAchat.length;
        this.nbr = this.achatService.listAchat.length;
        this.nbrPage = Math.ceil(this.nbr / this.defaultItem);
      });
  }

  getAchatsRestant() {
    this.achatService.totalVente = 0;
    this.achatService.totalAvance = 0;
    this.achatService.totalRestant = 0;
    this.achatService.getNbrAchatsRestant().subscribe(
      (data: any[]) => {
        this.achatService.listAchat = data;
        this.achatService.nbrAchat = this.achatService.listAchat.length;
        this.nbr = this.achatService.listAchat.length;
        this.nbrPage = Math.ceil(this.nbr / this.defaultItem);
      });
  }

  detail(id: any) {
    this.produitService.getMouvement(id).subscribe((data: any) => {
      let response: any = data;
      this.produitService.mouvemen = response.mouvement;
      localStorage.removeItem('mouvement');
      localStorage.setItem('mouvement', JSON.stringify(response.mouvement));
      localStorage.setItem('ligneMouvementDetail', JSON.stringify(response.ligne_mouvement));
      this.router.navigate(['/mouvement-detail']);
    });
  }


  edit(id: any) {
    this.produitService.getMouvement(id).subscribe((data: any) => {
      let response: any = data;
      this.produitService.mouvemen = response.mouvement;
      localStorage.removeItem('mouvement');
      localStorage.setItem('mouvement', JSON.stringify(response.mouvement));
      localStorage.setItem('ligneMouvement', JSON.stringify(response.ligne_mouvement));
      this.router.navigate(['/mouvement-edit']);
    });
  }

  routeProduit() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/produit']);
  }

  routeDepot_1() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/depot_I']);
  }

  routeNewMouve() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/mouvement-new']);
  }

}

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AchatService } from 'src/app/services/achat.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-list-achat',
  templateUrl: './list-achat.component.html',
  styleUrls: ['./list-achat.component.scss']
})
export class ListAchatComponent implements OnInit {

  page: number = 1;
  nbrAchat: number = 0;
  defaultItem: number = 100;
  nbrPage: number = 0;
  date: any;
  codeFn: any;
  status: any;

  fournisseurs!: any[];

  searchSelect = '';
  selectedFournisseur: any = null;
  showDropdown = false;

  isDisable = false;
  isClick = false;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public achatService: AchatService, public router: Router, public localStorageService: LocalStorageService,
    private datePipe: DatePipe, public fournisseurService: FournisseurService,
    public userService: UserService) { }

  ngOnInit() {
    this.date = this.datePipe.transform(new Date(Date.now()), 'dd-MM-yyyy');
    this.achatService.getAchatsDay();
    this.getFournisseurs();
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

  get filteredFournisseur() {
    return this.fournisseurs.filter(fournisseur =>
      fournisseur.name.toLowerCase().includes(this.searchSelect.toLowerCase())
    );
  }

  selectFournisseur(fournisseur: any) {
    this.selectedFournisseur = fournisseur;
    this.searchSelect = '';
    this.showDropdown = false; // Fermer le dropdown après la sélection
    if (fournisseur) {
      this.achatService.totalVente = 0;
      this.achatService.totalAvance = 0;
      this.achatService.totalRestant = 0;
      this.codeFn = fournisseur.code;
      this.achatService.getAchatByCodeFn(this.codeFn).subscribe(
        (data: any[]) => {
          this.achatService.listAchat = data;
          this.achatService.nbrAchat = this.achatService.listAchat.length;
          this.nbrAchat = this.achatService.listAchat.length;
          this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
          let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

          for (var i = 0; i < this.achatService.nbrAchat; i++) {

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
    }
    else {
      this.achatService.getAchatsDay();
    }
  }

  getAchats() {
    this.isDisable = true;
    this.isClick = true;
    this.achatService.totalVente = 0;
    this.achatService.totalAvance = 0;
    this.achatService.totalRestant = 0;
    this.achatService.getAchats().subscribe(
      (data: any) => {
        this.isDisable = false;
        this.isClick = false;
        let response: any = data;
        this.achatService.listAchat = response.achats;
        this.achatService.nbrAchat = this.achatService.listAchat.length;
        this.nbrAchat = this.achatService.listAchat.length;
        this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.achatService.nbrAchat; i++) {

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
  }

  //Get All product fournisseurs!:any[];
  getFournisseurs() {
    this.fournisseurService.getAll().subscribe((res: any[]) => {
      this.fournisseurs = res;
    });
  }

  editAchat(achat: any) {
    this.achatService.edit(achat);
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
          this.achatService.nbrAchat = this.achatService.listAchat.length;
          this.nbrAchat = this.achatService.listAchat.length;
          this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
          let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

          for (var i = 0; i < this.achatService.nbrAchat; i++) {

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

  OnChangeFournisseur(ctrl: any) {

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
          this.nbrAchat = this.achatService.listAchat.length;
          this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
          let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

          for (var i = 0; i < this.achatService.nbrAchat; i++) {

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

  getAchatsPayer() {
    this.achatService.totalVente = 0;
    this.achatService.totalAvance = 0;
    this.achatService.totalRestant = 0;
    this.achatService.getNbrAchatsPayer().subscribe(
      (data: any[]) => {
        this.achatService.listAchat = data;
        this.achatService.nbrAchat = this.achatService.listAchat.length;
        this.nbrAchat = this.achatService.listAchat.length;
        this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.achatService.nbrAchat; i++) {

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
  }

  getAchatsEncours() {
    this.achatService.totalVente = 0;
    this.achatService.totalAvance = 0;
    this.achatService.totalRestant = 0;
    this.achatService.getNbrAchatsEncours().subscribe(
      (data: any[]) => {
        this.achatService.listAchat = data;
        this.achatService.nbrAchat = this.achatService.listAchat.length;
        this.nbrAchat = this.achatService.listAchat.length;
        this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.achatService.nbrAchat; i++) {

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
  }

  getAchatsRestant() {
    this.achatService.totalVente = 0;
    this.achatService.totalAvance = 0;
    this.achatService.totalRestant = 0;
    this.achatService.getNbrAchatsRestant().subscribe(
      (data: any[]) => {
        this.achatService.listAchat = data;
        this.achatService.nbrAchat = this.achatService.listAchat.length;
        this.nbrAchat = this.achatService.listAchat.length;
        this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.achatService.nbrAchat; i++) {

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
  }

  detail(achat: any) {
    this.achatService.getAchat(achat.id).subscribe((data: any) => {
      let response: any = data;
      this.achatService.achat = response.achat;
      localStorage.removeItem('achat')
      localStorage.removeItem('dossier')
      localStorage.removeItem('fournisseur')
      localStorage.removeItem('is_editable')
      localStorage.removeItem('listLigneAchatDetail')
      localStorage.removeItem('listReglementAchatDetail')
      localStorage.setItem('achat', JSON.stringify(this.achatService.achat));
      localStorage.setItem('is_editable', JSON.stringify(response.is_editable));
      localStorage.setItem('listLigneAchatDetail', JSON.stringify(response.ligneAchats));
      localStorage.setItem('listReglementAchatDetail', JSON.stringify(response.ligneReglementAchats));
      localStorage.setItem('fournisseur', JSON.stringify(response.fournisseur));
      localStorage.setItem('dossier', JSON.stringify(response.dossier));
      this.router.navigate(['/achat-detail']);
    });
  }

  routeAchat() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/achat-nouveau']);
  }
}

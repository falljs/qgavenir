import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BonAchatService } from 'src/app/services/bon-achat.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-list-bon-achat',
  templateUrl: './list-bon-achat.component.html',
  styleUrls: ['./list-bon-achat.component.scss']
})
export class ListBonAchatComponent implements OnInit {

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

  constructor(public bonAchatService: BonAchatService, public router: Router, public localStorageService: LocalStorageService,
    private datePipe: DatePipe, public fournisseurService: FournisseurService,
    public userService: UserService) { }

  ngOnInit() {
    this.date = this.datePipe.transform(new Date(Date.now()), 'dd-MM-yyyy');
    this.bonAchatService.getBonAchatsDay();
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
      this.codeFn = fournisseur.code;
      this.bonAchatService.getBonAchatByCodeFn(this.codeFn).subscribe(
        (data: any[]) => {
          this.bonAchatService.listAchat = data;
          this.bonAchatService.nbrAchat = this.bonAchatService.listAchat.length;
          this.nbrAchat = this.bonAchatService.listAchat.length;
          this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
        });
    }
    else {
      this.bonAchatService.getBonAchatsDay();
    }
  }

  getBonAchats() {
    this.isDisable = true;
    this.isClick = true;
    this.bonAchatService.getBonAchats().subscribe(
      (data: any) => {
        this.isDisable = false;
        this.isClick = false;
        let response: any = data;
        this.bonAchatService.listAchat = response.bonAchats;
        this.bonAchatService.nbrAchat = this.bonAchatService.listAchat.length;
        this.nbrAchat = this.bonAchatService.listAchat.length;
        this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
      });
  }

  //Get All product fournisseurs!:any[];
  getFournisseurs() {
    this.fournisseurService.getAll().subscribe((res: any[]) => {
      this.fournisseurs = res;
    });
  }

  editBonAchat(achat: any) {
    this.bonAchatService.edit(achat);
  }

  search() {
    let search: any = $("#inputSearch").val();
    if (search) {
      this.bonAchatService.searchBonAchat(search).subscribe(
        (res: any[]) => {
          this.bonAchatService.listAchat = res;
        });
    } else {
      this.bonAchatService.getBonAchatsDay();
    }
  }

  onChangeDate(ctrl: any) {
    if (ctrl.value) {
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.bonAchatService.getBonAchatByDate(date).subscribe(
        (data: any) => {
          let response: any = data;
          this.bonAchatService.listAchat = response.bonAchats;
          this.bonAchatService.nbrAchat = this.bonAchatService.listAchat.length;
          this.nbrAchat = this.bonAchatService.listAchat.length;
          this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
        });
    } else {
      this.bonAchatService.getBonAchatsDay();
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
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.bonAchatService.getBonAchatBy2Dates(this.date, date).subscribe(
        (data: any) => {
          let response: any = data;
          this.bonAchatService.listAchat = response.bonAchats;
          this.bonAchatService.nbrAchat = this.bonAchatService.listAchat.length;
          this.nbrAchat = this.bonAchatService.listAchat.length;
          this.nbrPage = Math.ceil(this.nbrAchat / this.defaultItem);
        });
    } else {
      this.bonAchatService.getBonAchatsDay();
    }
  }

  detail(achat: any) {
    this.bonAchatService.detail(achat);
  }


  routeAchat() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/achat-nouveau']);
  }
}

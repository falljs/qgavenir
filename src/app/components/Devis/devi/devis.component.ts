import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { CommandeService } from 'src/app/services/commande.service';
import { DevisService } from 'src/app/services/devis.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.scss']
})
export class DevisComponent {

  page: number = 1;
  nbrDvs: number = 0;
  defaultItem: number = 100;
  nbrPage: number = 0;
  date: any;
  client: any;

  searchSelect = '';
  selectedClient: any = null;
  showDropdown = false;

  isDisable = false;
  isClick = false;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public devisService: DevisService, public commandeService: CommandeService,
    private datePipe: DatePipe, public clientService: ClientService, public userService: UserService,
    public localStorageService: LocalStorageService, public router: Router,) { }

  ngOnInit() {
    this.date = this.datePipe.transform(new Date(Date.now()), 'dd-MM-yyyy');
    this.devisService.getDevisDay();
    this.getClients();
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

  get filteredClient() {
    return this.clientService.listClient.filter(client =>
      client.name.toLowerCase().includes(this.searchSelect.toLowerCase())
    );
  }

  getDevis() {
    this.isDisable = true;
    this.isClick = true;
    this.devisService.getDevis().subscribe(
      data => {
        this.isDisable = false;
        this.isClick = false;
        this.devisService.listDevis = data;
        this.devisService.nbrDvs = this.devisService.listDevis.length;
        this.nbrDvs = this.devisService.listDevis.length;
        this.nbrPage = Math.ceil(this.nbrDvs / this.defaultItem);
      });
  }

  getClients() {
    this.clientService.getAll().subscribe(
      response => {
        this.clientService.listClient = response;
      });
  }

  search() {
    let search: any = $("#inputSearch").val();
    if (search) {
      this.devisService.searchDevis(search).subscribe(
        data => {
          this.devisService.listDevis = data;
          this.devisService.nbrDvs = this.devisService.listDevis.length;
        });
    } else {
      this.devisService.getDevisDay();
    }
  }

  searchType() {
    let inputSearchType: any = $("#inputSearchType").val();
    if (inputSearchType) {
      this.devisService.searchDevis(inputSearchType).subscribe(
        data => {
          this.devisService.listDevis = data;
          this.devisService.nbrDvs = this.devisService.listDevis.length;
        });
    } else {
      this.devisService.getDevisDay();
    }
  }

  onChangeDate(ctrl: any) {
    if (ctrl.value) {
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.devisService.getDevisByDate(date).subscribe(
        data => {
          this.devisService.listDevis = data;
          this.devisService.nbrDvs = this.devisService.listDevis.length;
          this.nbrDvs = this.devisService.listDevis.length;
          this.nbrPage = Math.ceil(this.nbrDvs / this.defaultItem);
        });
    } else {
      this.devisService.getDevisDay();
    }
  }

  selectClient(client: any) {
    this.selectedClient = client;
    this.searchSelect = '';
    this.showDropdown = false; // Fermer le dropdown après la sélection
    if (this.selectedClient.code) {
      this.client = this.selectedClient.code;
      this.devisService.getDevisByCodeClient(this.client).subscribe(
        data => {
          this.devisService.listDevis = data;
          this.devisService.nbrDvs = this.devisService.listDevis.length;
          this.nbrDvs = this.devisService.listDevis.length;
          this.nbrPage = Math.ceil(this.nbrDvs / this.defaultItem);
        });
    } else {
      this.devisService.getDevisDay();
    }
  }

  OnChangeClient(ctrl: any) {

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
      this.devisService.getDevisBy2Dates(this.date, date).subscribe(
        data => {
          this.devisService.listDevis = data;
          this.devisService.nbrDvs = this.devisService.listDevis.length;
          this.nbrDvs = this.devisService.listDevis.length;
          this.nbrPage = Math.ceil(this.nbrDvs / this.defaultItem);
        });
    } else {
      this.devisService.getDevisDay();
    }
  }

  editDevis(devis: any) {
    this.devisService.edit(devis);
  }

  detail(devis: any) {
    this.devisService.detail(devis);
  }

}


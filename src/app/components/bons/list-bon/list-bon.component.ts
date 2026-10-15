import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BonService } from 'src/app/services/bon.service';
import { ClientService } from 'src/app/services/client.service';
import { CommandeService } from 'src/app/services/commande.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-list-bon',
  templateUrl: './list-bon.component.html',
  styleUrls: ['./list-bon.component.scss']
})
export class ListBonComponent implements OnInit {

  page: number = 1;
  nbrBon: number = 0;
  defaultItem: number = 100;
  nbrPage: number = 0;
  date: any;
  codeClt: any;
  status: any;

  searchSelect = '';
  selectedClient: any = null;
  showDropdown = false;

  isDisable = false;
  isClick = false;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public bonService: BonService, public userService: UserService, public commandeService: CommandeService,
    private datePipe: DatePipe, public clientService: ClientService,
    public router: Router, public localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.date = this.datePipe.transform(new Date(Date.now()), 'dd-MM-yyyy');
    this.bonService.getBonsDay();
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

  getBons() {
    this.isDisable = true;
    this.isClick = true;
    this.bonService.totalVente = 0;
    this.bonService.getBons().subscribe(
      data => {
        this.isDisable = false;
        this.isClick = false;
        this.bonService.listBon = data.bons;
        this.bonService.nbrBon = this.bonService.listBon.length;
        this.nbrBon = this.bonService.listBon.length;
        this.nbrPage = Math.ceil(this.nbrBon / this.defaultItem);
        let totalVente = 0;

        for (var i = 0; i < this.bonService.nbrBon; i++) {

          if (this.bonService.listBon[i].net) {
            totalVente += this.bonService.listBon[i].net;
            this.bonService.totalVente = totalVente;
          } else {
            totalVente += this.bonService.listBon[i].net;
            this.bonService.totalVente = totalVente;
          }
        }
      });
  }

  getClients() {
    this.clientService.getAll().subscribe(
      response => {
        this.clientService.listClient = response;
      });
  }

  selectClient(client: any) {
    this.selectedClient = client;
    this.searchSelect = '';
    this.showDropdown = false; // Fermer le dropdown après la sélection
    if (this.selectedClient.code) {
      this.bonService.totalVente = 0;
      this.codeClt = this.selectedClient.code;
      this.bonService.getBonByCodeClient(this.codeClt).subscribe(
        data => {
          this.bonService.listBon = data;
          this.bonService.nbrBon = this.bonService.listBon.length;
          this.nbrBon = this.bonService.listBon.length;
          this.nbrPage = Math.ceil(this.nbrBon / this.defaultItem);
          let totalVente = 0;

          for (var i = 0; i < this.bonService.nbrBon; i++) {

            if (this.bonService.listBon[i].net) {
              totalVente += this.bonService.listBon[i].net;
              this.bonService.totalVente = totalVente;
            } else {
              totalVente += this.bonService.listBon[i].net;
              this.bonService.totalVente = totalVente;
            }
          }
        });
    }
    else {
      this.bonService.getBonsDay();
    }
  }

  OnChangeClient(ctrl: any) {

  }

  editBon(bon: any) {
    this.bonService.edit(bon);
  }

  detail(bon: any) {
    this.bonService.getBon(bon.id).subscribe((data) => {
      let response: any = data;
      this.bonService.bon = response.bon;
      localStorage.removeItem('bon');
      localStorage.removeItem('dossier');
      localStorage.removeItem('client');
      localStorage.removeItem('listLigneBonDetail');
      localStorage.setItem('bon', JSON.stringify(this.bonService.bon));
      localStorage.setItem('listLigneBonDetail', JSON.stringify(response.ligneBons));
      localStorage.setItem('client', JSON.stringify(response.client));
      localStorage.setItem('dossier', JSON.stringify(response.dossier));
      this.router.navigate(['/bon-detail']);
    });
  }

  routeNewBon() {
    this.localStorageService.rootBon();
    this.router.navigate(['/bon-nouveau']);
  }

  routeBonComm() {
    this.localStorageService.rootConvertBon();
    this.router.navigate(['/bon-commande']);
  }


}

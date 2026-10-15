import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/services/client.service';
import { CommandeService } from 'src/app/services/commande.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  page: number = 1;
  nbrComm: number = 0;
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

  constructor(public commandeService: CommandeService, public router: Router,
    private datePipe: DatePipe, public clientService: ClientService,
    public userService: UserService,
    public localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.date = this.datePipe.transform(new Date(Date.now()), 'dd-MM-yyyy');
    this.commandeService.getCommandesDay();
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

  getCommandes() {
    this.isDisable = true;
    this.isClick = true;
    this.commandeService.totalVente = 0;
    this.commandeService.totalAvance = 0;
    this.commandeService.totalRestant = 0;
    this.commandeService.getCommandes().subscribe(
      data => {
        this.isDisable = false;
        this.isClick = false;
        let response: any = data;
        this.commandeService.listCommande = response.commandes;
        this.commandeService.nbrCmd = this.commandeService.listCommande.length;
        this.nbrComm = this.commandeService.listCommande.length;
        this.nbrPage = Math.ceil(this.nbrComm / this.defaultItem);
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.commandeService.nbrCmd; i++) {

          if (this.commandeService.listCommande[i].net) {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          } else {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          }

          if (this.commandeService.listCommande[i].versement) {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          } else {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          }

          if (this.commandeService.listCommande[i].restant) {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
          } else {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
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

  search() {
    this.page = 1;
    let search: any = $("#inputSearch").val();
    if (search) {
      this.commandeService.searchCommande(search).subscribe(
        response => {
          this.commandeService.listCommande = response;
          let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

          for (var i = 0; i < this.commandeService.listCommande.length; i++) {

            if (this.commandeService.listCommande[i].net) {
              totalVente += this.commandeService.listCommande[i].net;
              this.commandeService.totalVente = totalVente;
            } else {
              totalVente += this.commandeService.listCommande[i].net;
              this.commandeService.totalVente = totalVente;
            }

            if (this.commandeService.listCommande[i].versement) {
              totalAvance += this.commandeService.listCommande[i].versement;
              this.commandeService.totalAvance = totalAvance;
            } else {
              totalAvance += this.commandeService.listCommande[i].versement;
              this.commandeService.totalAvance = totalAvance;
            }

            if (this.commandeService.listCommande[i].restant) {
              totalRestant += this.commandeService.listCommande[i].restant;
              this.commandeService.totalRestant = totalRestant;
            } else {
              totalRestant += this.commandeService.listCommande[i].restant;
              this.commandeService.totalRestant = totalRestant;
            }
          }
        });
    } else {
      this.commandeService.getCommandesDay();
    }
  }

  OnChangeStatus(ctrl: any) {
    if (ctrl.value) {
      this.commandeService.totalVente = 0;
      this.commandeService.totalAvance = 0;
      this.commandeService.totalRestant = 0;
      this.status = ctrl.value;
      if (this.status == 'payer') {
        this.getCommandesPayer();
      }
      if (this.status == 'cours') {
        this.getCommandesEncours();
      }
      if (this.status == 'nonPay') {
        this.getCommandesRestant();
      }
      if (this.status == 'wave') {
        this.getCommandesWave();
      }
    }
    else {
      this.commandeService.getCommandesDay();
    }
  }

  selectClient(client: any) {
    this.selectedClient = client;
    this.searchSelect = '';
    this.showDropdown = false; // Fermer le dropdown après la sélection
    if (this.selectedClient.code) {
      this.commandeService.totalVente = 0;
      this.commandeService.totalAvance = 0;
      this.commandeService.totalRestant = 0;
      this.codeClt = this.selectedClient.code;
      this.commandeService.getCommandeByCodeClient(this.codeClt).subscribe(
        data => {
          let response: any = data;
          this.commandeService.listCommande = response.commandes;
          this.commandeService.nbrCmd = this.commandeService.listCommande.length;
          this.nbrComm = this.commandeService.listCommande.length;
          this.nbrPage = Math.ceil(this.nbrComm / this.defaultItem);
          let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

          for (var i = 0; i < this.commandeService.nbrCmd; i++) {

            if (this.commandeService.listCommande[i].net) {
              totalVente += this.commandeService.listCommande[i].net;
              this.commandeService.totalVente = totalVente;
            } else {
              totalVente += this.commandeService.listCommande[i].net;
              this.commandeService.totalVente = totalVente;
            }

            if (this.commandeService.listCommande[i].versement) {
              totalAvance += this.commandeService.listCommande[i].versement;
              this.commandeService.totalAvance = totalAvance;
            } else {
              totalAvance += this.commandeService.listCommande[i].versement;
              this.commandeService.totalAvance = totalAvance;
            }

            if (this.commandeService.listCommande[i].restant) {
              totalRestant += this.commandeService.listCommande[i].restant;
              this.commandeService.totalRestant = totalRestant;
            } else {
              totalRestant += this.commandeService.listCommande[i].restant;
              this.commandeService.totalRestant = totalRestant;
            }
          }
        });
    }
    else {
      this.commandeService.getCommandesDay();
    }
  }

  onChangeDate(ctrl: any) {
    if (ctrl.value) {
      this.commandeService.totalVente = 0;
      this.commandeService.totalAvance = 0;
      this.commandeService.totalRestant = 0;
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.commandeService.getCommandeByDate(date).subscribe(
        data => {
          let response: any = data;
          this.commandeService.listCommande = response.commandes;
          this.commandeService.nbrCmd = this.commandeService.listCommande.length;
          this.nbrComm = this.commandeService.listCommande.length;
          this.nbrPage = Math.ceil(this.nbrComm / this.defaultItem);
          let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

          for (var i = 0; i < this.commandeService.nbrCmd; i++) {

            if (this.commandeService.listCommande[i].net) {
              totalVente += this.commandeService.listCommande[i].net;
              this.commandeService.totalVente = totalVente;
            } else {
              totalVente += this.commandeService.listCommande[i].net;
              this.commandeService.totalVente = totalVente;
            }

            if (this.commandeService.listCommande[i].versement) {
              totalAvance += this.commandeService.listCommande[i].versement;
              this.commandeService.totalAvance = totalAvance;
            } else {
              totalAvance += this.commandeService.listCommande[i].versement;
              this.commandeService.totalAvance = totalAvance;
            }

            if (this.commandeService.listCommande[i].restant) {
              totalRestant += this.commandeService.listCommande[i].restant;
              this.commandeService.totalRestant = totalRestant;
            } else {
              totalRestant += this.commandeService.listCommande[i].restant;
              this.commandeService.totalRestant = totalRestant;
            }
          }

        });
    } else {
      this.commandeService.getCommandesDay();
    }
  }

  onChange2DatesFirst(ctrl: any) {
    if (ctrl.value) {
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.date = date;
    } else {
      this.getCommandes();
    }
  }

  onChange2DatesSecond(ctrl: any) {
    if (ctrl.value) {
      this.commandeService.totalVente = 0;
      this.commandeService.totalAvance = 0;
      this.commandeService.totalRestant = 0;
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.commandeService.getCommandeBy2Dates(this.date, date).subscribe(
        data => {
          let response: any = data;
          this.commandeService.listCommande = response.commandes;
          this.commandeService.nbrCmd = this.commandeService.listCommande.length;
          this.nbrComm = this.commandeService.listCommande.length;
          this.nbrPage = Math.ceil(this.nbrComm / this.defaultItem);
          let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

          for (var i = 0; i < this.commandeService.nbrCmd; i++) {

            if (this.commandeService.listCommande[i].net) {
              totalVente += this.commandeService.listCommande[i].net;
              this.commandeService.totalVente = totalVente;
            } else {
              totalVente += this.commandeService.listCommande[i].net;
              this.commandeService.totalVente = totalVente;
            }

            if (this.commandeService.listCommande[i].versement) {
              totalAvance += this.commandeService.listCommande[i].versement;
              this.commandeService.totalAvance = totalAvance;
            } else {
              totalAvance += this.commandeService.listCommande[i].versement;
              this.commandeService.totalAvance = totalAvance;
            }

            if (this.commandeService.listCommande[i].restant) {
              totalRestant += this.commandeService.listCommande[i].restant;
              this.commandeService.totalRestant = totalRestant;
            } else {
              totalRestant += this.commandeService.listCommande[i].restant;
              this.commandeService.totalRestant = totalRestant;
            }
          }
        });
    } else {
      this.commandeService.getCommandesDay();
    }
  }

  getCommandesPayer() {
    this.commandeService.totalVente = 0;
    this.commandeService.totalAvance = 0;
    this.commandeService.totalRestant = 0;
    this.commandeService.getNbrCommandesPayer().subscribe(
      data => {
        this.commandeService.listCommande = data;
        this.commandeService.nbrCmd = this.commandeService.listCommande.length;
        this.nbrComm = this.commandeService.listCommande.length;
        this.nbrPage = Math.ceil(this.nbrComm / this.defaultItem);
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.commandeService.nbrCmd; i++) {

          if (this.commandeService.listCommande[i].net) {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          } else {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          }

          if (this.commandeService.listCommande[i].versement) {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          } else {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          }

          if (this.commandeService.listCommande[i].restant) {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
          } else {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
          }
        }
      });
  }

  getCommandesEncours() {
    this.commandeService.totalVente = 0;
    this.commandeService.totalAvance = 0;
    this.commandeService.totalRestant = 0;
    this.commandeService.getNbrCommandesEncours().subscribe(
      data => {
        this.commandeService.listCommande = data;
        this.commandeService.nbrCmd = this.commandeService.listCommande.length;
        this.nbrComm = this.commandeService.listCommande.length;
        this.nbrPage = Math.ceil(this.nbrComm / this.defaultItem);
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.commandeService.nbrCmd; i++) {

          if (this.commandeService.listCommande[i].net) {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          } else {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          }

          if (this.commandeService.listCommande[i].versement) {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          } else {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          }

          if (this.commandeService.listCommande[i].restant) {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
          } else {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
          }
        }
      });
  }

  getCommandesRestant() {
    this.commandeService.totalVente = 0;
    this.commandeService.totalAvance = 0;
    this.commandeService.totalRestant = 0;
    this.commandeService.getNbrCommandesRestant().subscribe(
      data => {
        this.commandeService.listCommande = data;
        this.commandeService.nbrCmd = this.commandeService.listCommande.length;
        this.nbrComm = this.commandeService.listCommande.length;
        this.nbrPage = Math.ceil(this.nbrComm / this.defaultItem);
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.commandeService.nbrCmd; i++) {

          if (this.commandeService.listCommande[i].net) {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          } else {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          }

          if (this.commandeService.listCommande[i].versement) {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          } else {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          }

          if (this.commandeService.listCommande[i].restant) {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
          } else {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
          }
        }
      });
  }

  getCommandesWave() {
    this.commandeService.totalVente = 0;
    this.commandeService.totalAvance = 0;
    this.commandeService.totalRestant = 0;
    this.commandeService.getNbrCommandesWave().subscribe(
      data => {
        this.commandeService.listCommande = data;
        this.commandeService.nbrCmd = this.commandeService.listCommande.length;
        this.nbrComm = this.commandeService.listCommande.length;
        this.nbrPage = Math.ceil(this.nbrComm / this.defaultItem);
        let totalVente = 0; let totalAvance = 0; let totalRestant = 0;

        for (var i = 0; i < this.commandeService.nbrCmd; i++) {

          if (this.commandeService.listCommande[i].net) {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          } else {
            totalVente += this.commandeService.listCommande[i].net;
            this.commandeService.totalVente = totalVente;
          }

          if (this.commandeService.listCommande[i].versement) {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          } else {
            totalAvance += this.commandeService.listCommande[i].versement;
            this.commandeService.totalAvance = totalAvance;
          }

          if (this.commandeService.listCommande[i].restant) {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
          } else {
            totalRestant += this.commandeService.listCommande[i].restant;
            this.commandeService.totalRestant = totalRestant;
          }
        }
      });
  }

  editCommande(commande: any) {
    this.commandeService.edit(commande);
  }

  detail(commande: any) {
    this.commandeService.detail(commande);
  }

  routeVente() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/vente']);
  }

  routeDevis() {
    this.localStorageService.rootDevis();
    this.router.navigate(['/devis']);
  }

  routeBon() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/bon']);
  }

}

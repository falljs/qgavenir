import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { UserService } from 'src/app/services/user.service';
import { ClientService } from 'src/app/services/client.service';
import { CommandeService } from 'src/app/services/commande.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
declare var $: any;

@Component({
  selector: 'app-dette',
  templateUrl: './dette.component.html',
  styleUrls: ['./dette.component.scss']
})
export class DetteComponent implements OnInit {

  nom_client: any = null;

  montantTotal_dette = 0;

  listDettes: any[] = [];

  defaultItem: number = 100;
  page: number = 1;
  nbrDivers: number = 0;
  nbrBon: number = 0;
  nbrPage: number = 0;

  date_search: any;
  print!: boolean;

  searchSelect = '';
  selectedClient: any = null;
  showDropdown = false;

  constructor(public clientService: ClientService, public userService: UserService,
    public toastrService: ToastrService, public datePipe: DatePipe, public commandeService: CommandeService) { }

  ngOnInit(): void {
    this.getDettesToday();
    this.getClients();
  }

  get filteredClient() {
    return this.clientService.listClient.filter(client =>
      client.name.toLowerCase().includes(this.searchSelect.toLowerCase())
    );
  }

  getDettesToday() {
    this.commandeService.getDetteToDay().subscribe(
      data => {
        let response: any = data;
        this.commandeService.listDette = response.commande;
        this.commandeService.listDetteBon = response.bon;
        this.nbrDivers = this.commandeService.listDette.length;
        this.nbrBon = this.commandeService.listDetteBon.length;
        this.nbrPage = Math.ceil(this.nbrDivers / this.defaultItem);

        // Calculer la somme des restes dans listDette
        let sommeRestes = this.commandeService.listDette.reduce((total: number, item: any) => {
          return total + item.restant;
        }, 0);

        // Calculer la somme des nets dans listDetteBon
        let sommeNets = this.commandeService.listDetteBon.reduce((total: number, item: any) => {
          return total + item.net;
        }, 0);

        this.montantTotal_dette = sommeRestes + sommeNets;
      });
  }

  getDettes() {
    this.commandeService.getDettes().subscribe(
      data => {
        let response: any = data;
        this.commandeService.listDette = response.commande;
        this.commandeService.listDetteBon = response.bon;
        this.nbrDivers = this.commandeService.listDette.length;
        this.nbrBon = this.commandeService.listDetteBon.length;
        this.nbrPage = Math.ceil(this.nbrDivers / this.defaultItem);

        // Calculer la somme des restes dans listDette
        let sommeRestes = this.commandeService.listDette.reduce((total: number, item: any) => {
          return total + item.restant;
        }, 0);

        // Calculer la somme des nets dans listDetteBon
        let sommeNets = this.commandeService.listDetteBon.reduce((total: number, item: any) => {
          return total + item.net;
        }, 0);

        this.montantTotal_dette = sommeRestes + sommeNets;

      });
  }

  getClients() {
    this.clientService.getAll().subscribe(
      data => {
        this.clientService.listClient = data;
      });

  }

  selectClient(client: any) {
    this.selectedClient = client;
    this.searchSelect = '';
    this.showDropdown = false; // Fermer le dropdown après la sélection
    this.nom_client = this.selectedClient.name;
    if (this.selectedClient.code) {
      this.commandeService.searchDetteByClient(this.selectedClient.code).subscribe(
        data => {
          let response: any = data;
          this.commandeService.listDette = response.commandes;
          this.commandeService.listDetteBon = response.bons;
          this.nbrDivers = this.commandeService.listDette.length;
          this.nbrBon = this.commandeService.listDetteBon.length;
          this.nbrPage = Math.ceil(this.nbrDivers / this.defaultItem);
          this.print = true;
          // Calculer la somme des restes dans listDette
          let sommeRestes = this.commandeService.listDette.reduce((total: number, item: any) => {
            return total + item.restant;
          }, 0);

          // Calculer la somme des nets dans listDetteBon
          let sommeNets = this.commandeService.listDetteBon.reduce((total: number, item: any) => {
            return total + item.net;
          }, 0);

          this.montantTotal_dette = sommeRestes + sommeNets;
        });
    }
    else {
      this.getDettesToday();
    }
  }

  onChangeDate(ctrl: any) {
    if (ctrl.value) {
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.date_search = date;
      this.commandeService.getDetteByDate(date).subscribe(
        data => {
          let response: any = data;
          this.commandeService.listDette = response.commande;
          this.commandeService.listDetteBon = response.bon;
          this.nbrDivers = this.commandeService.listDette.length;
          this.nbrBon = this.commandeService.listDetteBon.length;
          this.nbrPage = Math.ceil(this.nbrDivers / this.defaultItem);

          // Calculer la somme des restes dans listDette
          let sommeRestes = this.commandeService.listDette.reduce((total: number, item: any) => {
            return total + item.restant;
          }, 0);

          // Calculer la somme des nets dans listDetteBon
          let sommeNets = this.commandeService.listDetteBon.reduce((total: number, item: any) => {
            return total + item.net;
          }, 0);

          this.montantTotal_dette = sommeRestes + sommeNets;
        });
    } else {
      this.commandeService.getDetteToDay();
    }
  }


  detail(dv: any) {
    this.commandeService.detail(dv);
  }

  printData(any: any) {
    this.commandeService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.wakeursmds.com/server/public/print/facture-bons/client/' + any, "_blank");
    });
  };

}

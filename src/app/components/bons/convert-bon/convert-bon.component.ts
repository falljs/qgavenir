import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Bon } from 'src/app/models/bon';
import { Commande } from 'src/app/models/commande';
import { BonService } from 'src/app/services/bon.service';
import { ClientService } from 'src/app/services/client.service';
import { CommandeService } from 'src/app/services/commande.service';
import { DossierService } from 'src/app/services/dossier.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-convert-bon',
  templateUrl: './convert-bon.component.html',
  styleUrls: ['./convert-bon.component.scss']
})
export class ConvertBonComponent implements OnInit {

  maxIdCmd!: number;
  commande: Commande = new Commande;
  bons!: Bon;
  nbrBon!: number;

  date: any;
  heure: any;
  year!: any;
  month!: any;


  listBons!: any[];
  listBonClient!: any[];
  isValid: boolean = true;

  // Var Form Commande
  date_comm!: any;
  heure_comm!: any;
  totht: number = 0;
  reduction: number = 0;
  restant: number = 0;
  versement: number = 0;
  net: number = 0;
  tottva: number = 0;
  auteur!: any;
  nom_client!: any;
  totttc: number = 0;

  editeLigne!: boolean;
  isDisable: boolean = false;
  isClick: boolean = false;

  searchSelect = '';
  selectedClient: any = null;
  showDropdown = false;

  constructor(public bonService: BonService, public userService: UserService,
    public clientService: ClientService, public dossierService: DossierService,
    public toastrService: ToastrService, private datePipe: DatePipe,
    public commandeService: CommandeService) { }

  ngOnInit(): void {
    this.bons = new Bon();
    this.getClients();
    this.getMaxId();
    this.date_comm = this.getDate(new Date(Date.now()));
    this.heure_comm = this.getHeure(new Date(Date.now()));
    this.listBons = [];
    this.listBonClient = [];
    if (localStorage.getItem('listBon') != null) {
      this.listBons = JSON.parse(localStorage.getItem('listBon')!);
      let total = 0;
      for (var i = 0; i < this.listBons.length; i++) {
        if (this.listBons[i].net) {
          total += this.listBons[i].net;
          this.totht = total;
        }
        this.getTtc();
      }
    } else {
      this.removeLcmd();
    }
  }

  get filteredClient() {
    return this.clientService.listClient.filter(client =>
      client.name.toLowerCase().includes(this.searchSelect.toLowerCase())
    );
  }

  getMaxId() {
    this.year = this.getYear(new Date(Date.now()));
    this.month = this.getMonth(new Date(Date.now()));
    this.bonService.getMaxId().subscribe(
      data => {
        this.commandeService.maxId = this.year + 'F' + this.month + data.maxId;
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
    this.nom_client = client.name;
    this.searchSelect = '';
    this.showDropdown = false; // Fermer le dropdown après la sélection
    if (this.selectedClient.code) {
      this.clientService.getData(this.selectedClient.id).subscribe(
        data => {
          let response: any = data;
          this.listBonClient = response.bons;
        });
    }
    else {
      this.listBonClient = [];
    }
  }

  onchange(bon: Bon) {
    // push vers Ligne Commande choix
    if (bon.isselected == true) {
      this.bons.id = bon.id;
      this.bons.numero = bon.numero;
      this.bons.totht = bon.totht;
      this.bons.totttc = bon.totttc;
      this.bons.net = bon.net;
      this.bons.auteur = this.userService.name;
      this.listBons.push(this.bons);
      localStorage.removeItem('listBon');
      localStorage.setItem('listBon', JSON.stringify(this.listBons));
      this.nbrBon = this.listBons.length;
      this.bons = new Bon();
      this.calcul();
    } else {
      this.deleteBon(bon.id);
    }
  }

  // Calcule Totat Ht
  calcul() {
    let total = 0;
    if (this.listBons.length > 0) {
      for (var i = 0; i < this.listBons.length; i++) {
        if (this.listBons[i].net) {
          total += this.listBons[i].net;
          this.totht = total;
        }
        this.getTtc();
      }
    } else {
      this.removeLcmd();
    }
    return total;
  }

  // Calcule Totat TTC
  getTtc() {
    this.totttc = (this.totht + (this.totht * this.tottva) / 100);
    this.net = this.totttc - this.reduction;
  }

  // Delete Ligne Commande
  deleteBon(id: number) {
    for (let i = 0; i < this.listBons.length; ++i) {
      this.nbrBon = i;
      if (this.listBons[i].id == id) {
        this.listBons.splice(i, 1);
        localStorage.removeItem('listBon');
        localStorage.setItem('listBon', JSON.stringify(this.listBons));
      }
    }
    this.calcul();
  }


  // Remove Ligne Commande
  removeLcmd() {
    localStorage.removeItem("listBon");
    this.listBons = [];
    this.totht = 0;
    this.tottva = 0;
    this.totttc = 0;
    this.reduction = 0;
    this.net = 0;
  }


  alert() {
    this.reduction = 0;
    this.toastrService.error('La reduction ne doit pas être superieure au TTC');
  }

  getDate(date: any) {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  getYear(date: any) {
    return this.datePipe.transform(date, 'yy');
  }

  getMonth(date: any) {
    return this.datePipe.transform(date, 'MM');
  }

  getHeure(date: any) {
    return this.datePipe.transform(date, 'HH:mm:ss');
  }

  dateNow(dateNow: any) {
    return this.datePipe.transform(dateNow, 'dd-MM-yyyy HH:mm:ss');
  }

  onSubmitBonCommande() {
    this.isDisable = true;
    this.isClick = true;
    const payLoad = {
      nom_client: this.nom_client,
      totht: this.totht,
      reduction: this.reduction,
      restant: this.restant,
      net: this.net,
      tottva: this.tottva,
      totttc: this.totttc,
      bons: this.listBons,
      auteur: this.userService.name
    }
    this.bonService.bonToCommande(payLoad).subscribe(
      data => {
        let resp: any = data;
        this.toastrService.success('Commande numero ' + resp.commande.numero + ' crée !');
        this.commandeService.detail(resp.commande);
      });
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Bon } from 'src/app/models/bon';
import { LigneBon } from 'src/app/models/ligne-bon';
import { BonService } from 'src/app/services/bon.service';
import { ClientService } from 'src/app/services/client.service';
import { LigneBonService } from 'src/app/services/ligne-bon.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-create-bon',
  templateUrl: './create-bon.component.html',
  styleUrls: ['./create-bon.component.scss']
})
export class CreateBonComponent implements OnInit {

  formClient!: FormGroup;
  formBon!: FormGroup;

  maxIdBon!: number;
  bon: Bon = new Bon;
  ligneBon!: LigneBon;
  nbrProduit!: number;

  date: any;
  heure: any;
  year!: any;
  month!: any;

  isValid: boolean = true;

  // Var Form Commande
  date_bon!: any;
  heure_bon!: any;
  valid!: boolean;
  etat!: boolean;
  totht: number = 0;
  reduction: number = 0;
  net: number = 0;
  tottva: number = 0;
  auteur!: any;
  id_client: number = 0;
  nom_client!: any;
  code_client!: any;
  numero_client!: any;
  email_client!: any;
  totttc: number = 0;
  benefice: number = 0;

  editeLigne!: boolean;
  isDisable: boolean = false;
  isClick: boolean = false;

  searchSelect = '';
  selectedClient: any = null;
  showDropdown = false;

  constructor(public produitService: ProduitService, private datePipe: DatePipe,
    public bonService: BonService, public userService: UserService,
    public clientService: ClientService,
    public toastrService: ToastrService, public ligneBonService: LigneBonService,
    public formBuilder: FormBuilder, public localStorageService: LocalStorageService) { }
  get fClient() { return this.formClient.controls }
  get fBon() { return this.formBon.controls }

  ngOnInit(): void {
    this.ligneBon = new LigneBon();
    this.getProduits();
    this.getClients();
    this.getMaxId();
    this.initFormClient();
    this.initFormBon();
    this.date_bon = this.getDate(new Date(Date.now()));
    this.heure_bon = this.getHeure(new Date(Date.now()));
    this.id_client = 0;
    this.ligneBonService.listLigneBon = [];
    if (localStorage.getItem('listLigneBon') != null) {
      this.ligneBonService.listLigneBon = JSON.parse(localStorage.getItem('listLigneBon')!);
      let total = 0;
      for (var i = 0; i < this.ligneBonService.listLigneBon.length; i++) {
        if (this.ligneBonService.listLigneBon[i].totht) {
          total += this.ligneBonService.listLigneBon[i].totht;
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

  selectClient(client: any) {
    this.selectedClient = client;
    this.id_client = client.id; // Mettre à jour l'ID du client sélectionné
    this.nom_client = client.name;
    this.code_client = client.code;
    this.numero_client = client.numero;
    this.searchSelect = '';
    this.showDropdown = false; // Fermer le dropdown après la sélection
  }

  initFormBon() {
    this.formBon = this.formBuilder.group({
      date_bon: '',
      heure_bon: '',
      auteur: '',
      id_client: 1,
      nom_client: '',
      reduction: 0,
      net: 0,
      totht: 0,
      tottva: 0,
      totttc: 0,
      ligneBon: [],
    });
  }

  dafaForm() {
    this.fBon['date_bon'].setValue(this.date_bon);
    this.fBon['heure_bon'].setValue(this.heure_bon);
    this.fBon['id_client'].setValue(this.id_client);
    this.fBon['nom_client'].setValue(this.nom_client);
    this.fBon['auteur'].setValue(this.userService.name);
    this.fBon['totht'].setValue(this.totht);
    this.fBon['reduction'].setValue(this.reduction);
    this.fBon['net'].setValue(this.net);
    this.fBon['tottva'].setValue(this.tottva);
    this.fBon['totttc'].setValue(this.totttc);
    this.fBon['ligneBon'].setValue(this.ligneBonService.listLigneBon);
  }


  initFormClient() {
    this.formClient = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('221'),
      surnom: new FormControl(''),
      address: new FormControl(''),
      auteur: new FormControl(this.userService.name)
    });
  }


  onSubmitClient() {
    this.formClient.value.auteur = this.userService.name;
    this.clientService.createData(this.formClient.value).subscribe({
      next: data => {
        let resp: any = data;
        this.initFormClient();
        this.toastrService.success('Client ' + resp.data.name + ' ajouté !');
        this.id_client = resp.data.id;
        this.clientService.getAll().subscribe(
          data => {
            this.clientService.listClient = data;
          });
        this.selectClient(resp.data);
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }


  getProduits() {
    this.produitService.getAllProduct().subscribe(
      data => {
        this.produitService.listProduits = data;
      });
  }

  getMaxId() {
    this.year = this.getYear(new Date(Date.now()));
    this.month = this.getMonth(new Date(Date.now()));
    this.bonService.getMaxId().subscribe(
      data => {
        this.bonService.maxId = this.year + 'B' + this.month + data.maxId;
      });
  }

  getClients() {
    this.clientService.getAll().subscribe(
      data => {
        this.clientService.listClient = data;
        // filtre le client néant
        let listClients: any = this.clientService.listClient.filter((client: any) => client.name == 'NÉANT');
        // Sélectionne le premier client par défaut
        if (listClients.length > 0) {
          this.selectedClient = listClients[0];
          this.selectClient(this.selectedClient);
        }
      });

  }



  onchange(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneBon.codeProduit = produit.code;
      this.ligneBon.produit = produit.designation;
      this.ligneBon.qtyProduit = produit.qty;
      this.ligneBon.qty = 0.5;
      this.ligneBon.prix = produit.prix;
      this.ligneBon.prix_achat = produit.prix_achat;
      this.ligneBon.totht = this.ligneBon.qty * this.ligneBon.prix;
      this.ligneBon.auteur = this.userService.name;
      this.ligneBonService.listLigneBon.push(this.ligneBon);
      localStorage.removeItem('listLigneBon');
      localStorage.setItem('listLigneBon', JSON.stringify(this.ligneBonService.listLigneBon));
      this.nbrProduit = this.ligneBonService.listLigneBon.length;
      this.ligneBon = new LigneBon();
      this.calcul();
    } else {
      this.deleteLigneBon(produit.code);
    }
  }

  onchangeAlert(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected) {
      // Ouvre le modal manuellement seulement si le produit n'est pas sélectionné
      const modal = new bootstrap.Modal(document.getElementById('modalAlertLine'));
      modal.show();
      localStorage.removeItem('produit');
      localStorage.setItem('produit', JSON.stringify(produit));
    } else {
      this.deleteLigneBon(produit.code);
    }
  }

  submitAlert() {
    if (localStorage.getItem('produit') != null) {
      let produit: any = JSON.parse(localStorage.getItem('produit')!);
      this.onchange(produit);
      localStorage.removeItem('produit');
    };
  }

  cancelAlert() {
    if (localStorage.getItem('produit') != null) {
      let produit: any = JSON.parse(localStorage.getItem('produit')!);
      for (var i = 0; i < this.produitService.listProduits.length; i++) {
        if (this.produitService.listProduits[i].code == produit.code) {
          this.produitService.listProduits[i].isselected = false;
        }
      }
      localStorage.removeItem('produit');
    }
  }

  // Calcule Totat Ht
  calcul() {
    let total = 0;
    if (this.ligneBonService.listLigneBon.length > 0) {
      for (var i = 0; i < this.ligneBonService.listLigneBon.length; i++) {
        if (this.ligneBonService.listLigneBon[i].totht) {
          total += this.ligneBonService.listLigneBon[i].totht;
          this.totht = total;
        }
        this.getTtc();
      }
      localStorage.removeItem('listLigneBon');
      localStorage.setItem('listLigneBon', JSON.stringify(this.ligneBonService.listLigneBon));
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
  deleteLigneBon(code: any) {
    for (let i = 0; i < this.ligneBonService.listLigneBon.length; ++i) {
      this.nbrProduit = i;
      if (this.ligneBonService.listLigneBon[i].codeProduit == code) {
        this.ligneBonService.listLigneBon.splice(i, 1);
      }
    }
    this.calcul();

    for (var i = 0; i < this.produitService.listProduits.length; i++) {
      if (this.produitService.listProduits[i].code == code) {
        this.produitService.listProduits[i].isselected = false;
      }
    }
  }

  openClient() {
    this.formClient.reset();
  }

  // Remove Ligne Commande
  removeLcmd() {
    localStorage.removeItem("listLigneBon");
    this.ligneBonService.listLigneBon = [];
    this.totht = 0;
    this.tottva = 0;
    this.totttc = 0;
    this.reduction = 0;
    this.net = 0;

    for (var i = 0; i < this.produitService.listProduits.length; i++) {
      this.produitService.listProduits[i].isselected = false;
    }
  }

  //Décrémenter
  incremente(pi: LigneBon) {
    if (pi.qty < pi.qtyProduit) {
      pi.qty = pi.qty + 0.5;
      pi.totht = pi.qty * pi.prix;
    } else {
      pi.qty = pi.qty + 0.5;
      let emprunt: number = pi.qty - pi.qtyProduit;
      this.toastrService.error('Vous venez demprunter une quantité de ' + emprunt + ' sur ce produit !');
      pi.totht = pi.qty * pi.prix;
    }
    this.calcul();
  }

  //Incrémenter
  decremente(pi: LigneBon) {
    if (pi.qty != 0.5) {
      pi.qty = pi.qty - 0.5;
      pi.totht = pi.qty * pi.prix;
    }
    this.calcul();
  }

  // Edit Line
  editDomain(p: LigneBon) {
    this.editeLigne = true
    p.editable = !p.editable;
  }

  // Edit Line Valid
  editDomainValid(p: LigneBon) {
    this.editeLigne = false;
    p.editable = !p.editable;
    if (p.qty > p.qtyProduit) {
      let emprunt: number = p.qty - p.qtyProduit;
      this.toastrService.error('Vous venez demprunter une quantité de ' + emprunt + ' sur ce produit !');
      p.totht = p.qty * p.prix;
    } else if (p.qty < 0.5) {
      this.toastrService.error('La quantité doit être au moins 0.5');
      p.qty = 0.5;
      p.totht = p.qty * p.prix;
    } else {
      p.totht = p.qty * p.prix;
    }
    this.calcul();
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

  onSubmitBon() {
    this.isDisable = true;
    this.isClick = true;
    this.dafaForm();
    this.fBon['heure_bon'].setValue(this.getHeure(new Date(Date.now())));
    this.bonService.create(this.formBon.value).subscribe(
      data => {
        let resp: any = data;
        this.toastrService.success('Bon numero ' + resp.bon.numero + ' crée !');
        this.bonService.detail(resp.bon);
      });
  }

  /**************************** Search Filter Designation *******************************/
  searchDesignation() {
    let input: any, filter, table: any, tr, i;

    input = document.getElementById("InputDesignation");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableProduit");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      var td0 = tr[i].getElementsByTagName("td")[1];

      if (td0) {
        var txtValue0 = td0.textContent || td0.innerHTML;
        if (
          txtValue0.toUpperCase().indexOf(filter) == 0
        ) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  /**************************** Search Filter Famille *******************************/
  searchFamille() {
    let input: any, filter, table: any, tr, i;

    input = document.getElementById("InputFamille");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableProduit");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      var td0 = tr[i].getElementsByTagName("td")[4];

      if (td0) {
        var txtValue0 = td0.textContent || td0.innerHTML;
        if (
          txtValue0.toUpperCase().indexOf(filter) == 0
        ) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  /**************************** Search Filter Reference *******************************/
  searchReference() {
    let input: any, filter, table: any, tr, i;

    input = document.getElementById("InputReference");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableProduit");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      var td0 = tr[i].getElementsByTagName("td")[5];

      if (td0) {
        var txtValue0 = td0.textContent || td0.innerHTML;
        if (
          txtValue0.toUpperCase().indexOf(filter) == 0
        ) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}

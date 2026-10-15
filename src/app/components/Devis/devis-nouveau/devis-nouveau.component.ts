import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Devis } from 'src/app/models/devis';
import { LigneDevis } from 'src/app/models/ligne-devis';
import { Produit } from 'src/app/models/produit';
import { ClientService } from 'src/app/services/client.service';
import { DevisService } from 'src/app/services/devis.service';
import { DossierService } from 'src/app/services/dossier.service';
import { LigneDevisService } from 'src/app/services/ligne-devis.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-devis-nouveau',
  templateUrl: './devis-nouveau.component.html',
  styleUrls: ['./devis-nouveau.component.scss']
})
export class DevisNouveauComponent {

  formDossier!: FormGroup;
  formClient!: FormGroup;
  formCommande!: FormGroup;

  maxIdCmd!: number;
  devis: Devis = new Devis;
  ligneDevis!: LigneDevis;
  nbrProduit!: number;

  date!: any;
  heure: any;
  year!: any;
  month!: any;

  isValid: boolean = true;
  isDisable: boolean = false;
  // Var Form Commande
  numDos: number = 1;
  date_devis!: any;
  heure_devis!: any;
  type!: any;
  totht: number = 0;
  net: number = 0;
  tottva: number = 0;
  auteur!: any;
  id_client: number = 1;
  nom_client!: any;
  code_client!: any;
  numero_client!: any;
  email_client!: any;
  totttc: number = 0;

  editeLigne!: boolean;

  client: any = 'NÉANT';

  typeVente: any = 'detail';

  constructor(public produitService: ProduitService, public ligneDevisService: LigneDevisService,
    public devisService: DevisService, public userService: UserService, public localStorageService: LocalStorageService,
    public clientService: ClientService, public dossierService: DossierService,
    public toastrService: ToastrService, private datePipe: DatePipe,
    public formBuilder: FormBuilder,) { }
  get fClient() { return this.formClient.controls }
  get fDossier() { return this.formDossier.controls }
  get fCommande() { return this.formCommande.controls }

  ngOnInit(): void {
    this.ligneDevis = new LigneDevis();
    this.getProduits();
    this.getDossiers();
    this.getClients();
    this.getMaxId();
    this.initFormDossier();
    this.initFormClient();
    this.initFormCommande();
    this.date_devis = this.getDate(new Date(Date.now()));
    this.heure_devis = this.getHeure(new Date(Date.now()));
    this.ligneDevisService.listLigneDevis = [];
    if (localStorage.getItem('listLigneDevis') != null) {
      this.ligneDevisService.listLigneDevis = JSON.parse(localStorage.getItem('listLigneDevis')!);
      let total = 0;
      for (var i = 0; i < this.ligneDevisService.listLigneDevis.length; i++) {
        if (this.ligneDevisService.listLigneDevis[i].totht) {
          total += this.ligneDevisService.listLigneDevis[i].totht;
          this.totht = total;
        }
        this.getTtc();
      }
    };
    if (localStorage.getItem('listLigneDevis') == null) {
      this.totht = 0;
      this.tottva = 0;
      this.totttc = 0;
      this.net = 0;
    }
  }

  onChangeVente(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.typeVente = selectedValue;
  }

  initFormCommande() {
    this.formCommande = this.formBuilder.group({
      numDos: 1,
      date_devis: '',
      heure_devis: '',
      type: '',
      auteur: '',
      id_client: 1,
      net: 0,
      totht: 0,
      tottva: 0,
      totttc: 0,
      ligneDevis: [],
    });
  }

  dafaForm() {
    this.fCommande['numDos'].setValue(this.numDos);
    this.fCommande['date_devis'].setValue(this.date_devis);
    this.fCommande['heure_devis'].setValue(this.heure_devis);
    this.fCommande['type'].setValue(this.type);
    this.fCommande['id_client'].setValue(this.id_client);
    this.fCommande['auteur'].setValue(this.userService.name);
    this.fCommande['totht'].setValue(this.totht);
    this.fCommande['net'].setValue(this.net);
    this.fCommande['tottva'].setValue(this.tottva);
    this.fCommande['totttc'].setValue(this.totttc);
    this.fCommande['ligneDevis'].setValue(this.ligneDevisService.listLigneDevis);
  }

  OnChangeClient(ctrl: any) {
    if (ctrl.value) {
      this.client = ctrl.value;
      for (var i = 0; i < this.dossierService.listDossiers.length; i++) {
        if (this.dossierService.listDossiers[i].nom == this.client) {
          this.numDos = this.dossierService.listDossiers[i].id;
          this.id_client = this.dossierService.listDossiers[i].id;
        }
      }

    }
    else {
      this.client = 'NÉANT';
      this.numDos = 1;
      this.id_client = 1;
    }
  }

  initFormClient() {
    this.formClient = new FormGroup({
      name: new FormControl('', [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }

  initFormDossier() {
    this.formDossier = new FormGroup({
      nom: new FormControl('', [Validators.required]),
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
        this.getClients();
        this.id_client = resp.data.id;
        this.getDossiers();
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  onSubmitDossier() {
    this.dossierService.create(this.formDossier.value).subscribe({
      next: data => {
        let dossier: any = data;
        this.initFormDossier();
        this.getDossiers();
        this.toastrService.success('Dossier ' + dossier.nom + ' créé !');
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  getProduits() {
    // 1. Récupération du cache local listProduitsCache
    const cachedProduits = localStorage.getItem('listProduitsCache');
    if (cachedProduits) {
      this.produitService.listProduits = JSON.parse(cachedProduits);
    }

    // 2. Mise à jour avec les données fraîches de l'API
    this.produitService.getAllProduct().subscribe(
      data => {
        // 3. Mise à jour du service
        this.produitService.listProduits = data;

        // 4. Mise à jour du cache
        localStorage.setItem('listProduitsCache', JSON.stringify(data));
      },
      error => {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }

  getMaxId() {
    this.year = this.getYear(new Date(Date.now()));
    this.month = this.getMonth(new Date(Date.now()));
    this.devisService.getMaxId().subscribe(
      data => {
        this.devisService.maxId = this.year + 'D' + this.month + data.maxId;
      });
  }

  getClients() {
    this.clientService.getAll().subscribe(
      data => {
        this.clientService.listClient = data;
      });

  }

  getDossiers() {
    this.dossierService.getAll().subscribe(
      data => {
        this.dossierService.listDossiers = data;
        for (var i = 0; i < this.dossierService.listDossiers.length; i++) {
          if (this.dossierService.listDossiers[i].id_client == this.id_client) {
            this.numDos = this.dossierService.listDossiers[i].id;
          }
        }
      });
  }

  onchangeGros(produit: Produit) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneDevis.codeProduit = produit.code;
      this.ligneDevis.produit = produit.designation;
      this.ligneDevis.qtyProduit = produit.qty;
      this.ligneDevis.qty = 0.5;
      this.ligneDevis.prix = produit.prix_gros;
      this.ligneDevis.prix_achat = produit.prix_achat;
      this.ligneDevis.totht = this.ligneDevis.qty * this.ligneDevis.prix;
      this.ligneDevis.auteur = this.userService.name;
      this.ligneDevisService.listLigneDevis.push(this.ligneDevis);
      localStorage.removeItem('listLigneDevis')
      localStorage.setItem('listLigneDevis', JSON.stringify(this.ligneDevisService.listLigneDevis));
      this.nbrProduit = this.ligneDevisService.listLigneDevis.length;
      this.ligneDevis = new LigneDevis();
      this.calcul();
    } else {
      this.deleteLigneDevis(produit.code);
    }
  }

  onchange(produit: Produit) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneDevis.codeProduit = produit.code;
      this.ligneDevis.produit = produit.designation;
      this.ligneDevis.qtyProduit = produit.qty;
      this.ligneDevis.qty = 0.5;
      this.ligneDevis.prix = produit.prix;
      this.ligneDevis.prix_achat = produit.prix_achat;
      this.ligneDevis.totht = this.ligneDevis.qty * this.ligneDevis.prix;
      this.ligneDevis.auteur = this.userService.name;
      this.ligneDevisService.listLigneDevis.push(this.ligneDevis);
      localStorage.removeItem('listLigneDevis')
      localStorage.setItem('listLigneDevis', JSON.stringify(this.ligneDevisService.listLigneDevis));
      this.nbrProduit = this.ligneDevisService.listLigneDevis.length;
      this.ligneDevis = new LigneDevis();
      this.calcul();
    } else {
      this.deleteLigneDevis(produit.code);
      this.calcul();
    }
  }

  // Calcule Totat Ht
  calcul() {
    let total = 0;
    if (this.ligneDevisService.listLigneDevis.length > 0) {
      for (var i = 0; i < this.ligneDevisService.listLigneDevis.length; i++) {
        if (this.ligneDevisService.listLigneDevis[i].totht) {
          total += this.ligneDevisService.listLigneDevis[i].totht;
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
    this.net = this.totttc;
  }

  // Delete Ligne Commande
  deleteLigneDevis(code: any) {
    for (let i = 0; i < this.ligneDevisService.listLigneDevis.length; ++i) {
      this.nbrProduit = i;
      if (this.ligneDevisService.listLigneDevis[i].codeProduit == code) {
        this.ligneDevisService.listLigneDevis.splice(i, 1);
        localStorage.removeItem('listLigneDevis');
        localStorage.setItem('listLigneDevis', JSON.stringify(this.ligneDevisService.listLigneDevis));
      }
    }
    this.calcul();
  }

  openClient() {
    this.formClient.reset();
  }

  openDossier() {
    this.formDossier.reset();
  }

  // Remove Ligne Commande
  removeLcmd() {
    localStorage.removeItem("listLigneDevis");
    this.ligneDevisService.listLigneDevis = [];
    this.totht = 0;
    this.tottva = 0;
    this.totttc = 0;
    this.net = 0;
  }

  //Décrémenter
  incremente(pi: LigneDevis) {
    if (pi.qty != pi.qtyProduit) {
      pi.qty = pi.qty + 0.5;
      pi.totht = pi.qty * pi.prix;
    } else {
      this.toastrService.error('Vous ne pouvez pas dépasser la quantité en stock ' + pi.qty);
    }
    this.calcul();
  }

  //Incrémenter
  decremente(pi: LigneDevis) {
    if (pi.qty != 0.5) {
      pi.qty = pi.qty - 0.5;
      pi.totht = pi.qty * pi.prix;
    }
    this.calcul();
  }

  // Edit Line
  editDomain(p: LigneDevis) {
    this.editeLigne = true
    p.editable = !p.editable;
  }

  // Edit Line Valid
  editDomainValid(p: LigneDevis) {
    this.editeLigne = false;
    p.editable = !p.editable;
    if (p.qty > p.qtyProduit) {
      this.toastrService.error('Vous ne pouvez pas dépasser la quantité en stock ' + p.qtyProduit);
      p.qty = p.qtyProduit;
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

  onSubmitCommande() {
    this.isDisable = true;
    this.fCommande['heure_devis'].setValue(this.getHeure(new Date(Date.now())));
    this.dafaForm();
    this.devisService.create(this.formCommande.value).subscribe(
      data => {
        let resp: any = data;
        this.localStorageService.clearExecptException();
        this.toastrService.success('Devis numero ' + resp.devis.numero + ' crée !');
        this.devisService.detail(resp.devis);
      });
  }

  /**************************** Search Filter Designation *******************************/
  searchDesignation() {
    let input: any, filter, table: any, tr, i;

    input = document.getElementById("InputDesign");
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

    input = document.getElementById("InputMifa");
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

    input = document.getElementById("InputRef");
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


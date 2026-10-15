import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Commande } from 'src/app/models/commande';
import { LigneCommande } from 'src/app/models/ligne-commande';
import { ClientService } from 'src/app/services/client.service';
import { CommandeService } from 'src/app/services/commande.service';
import { DevisService } from 'src/app/services/devis.service';
import { LigneCommandeService } from 'src/app/services/ligne-commande.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-vente',
  templateUrl: './vente.component.html',
  styleUrls: ['./vente.component.scss']
})
export class VenteComponent implements OnInit {

  formDossier!: FormGroup;
  formClient!: FormGroup;
  formCommande!: FormGroup;

  maxIdCmd!: number;
  commande: Commande = new Commande;
  ligneCommande!: LigneCommande;
  nbrProduit!: number;

  date!: any;
  heure: any;

  isValid: boolean = true;

  // Var Form Commande
  year!: any;
  month!: any;
  date_comm!: any;
  heure_comm!: any;
  valid!: boolean;
  etat!: boolean;
  totht: number = 0;
  reduction: number = 0;
  restant: number = 0;
  versement: number = 0;
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
  isDisable: boolean = false;
  isClick: boolean = false;

  client: any = 'Néant';
  clientAutre: any;

  typeVente: any = 'detail';

  searchSelect = '';
  selectedClient: any = null;
  showDropdown = false;
  isSelect = false;

  constructor(public produitService: ProduitService, public ligneCommandeService: LigneCommandeService,
    public commandeService: CommandeService, public userService: UserService,
    public clientService: ClientService,
    public toastrService: ToastrService, private datePipe: DatePipe, public devisService: DevisService,
    public formBuilder: FormBuilder, public router: Router, public localStorageService: LocalStorageService) { }
  get fClient() { return this.formClient.controls }
  get fDossier() { return this.formDossier.controls }
  get fCommande() { return this.formCommande.controls }

  ngOnInit(): void {
    this.ligneCommande = new LigneCommande();
    this.getProduits();
    this.getClients();
    this.getMaxId();
    this.initFormDossier();
    this.initFormClient();
    this.initFormCommande();
    this.date_comm = this.getDate(new Date(Date.now()));
    this.heure_comm = this.getHeure(new Date(Date.now()));
    this.id_client = 1;
    this.ligneCommandeService.listLigneCommande = [];
    if (localStorage.getItem('listLigneCommande') != null) {
      this.ligneCommandeService.listLigneCommande = JSON.parse(localStorage.getItem('listLigneCommande')!);
      let total = 0, benefice = 0;
      for (var i = 0; i < this.ligneCommandeService.listLigneCommande.length; i++) {
        if (this.ligneCommandeService.listLigneCommande[i].totht) {
          total += this.ligneCommandeService.listLigneCommande[i].totht;
          this.totht = total;
        }
        this.getTtc();
      }
    };
    if (localStorage.getItem('listLigneCommande') == null) {
      this.totht = 0;
      this.tottva = 0;
      this.totttc = 0;
      this.reduction = 0;
      this.net = 0;
    }

    if (localStorage.getItem('clientFacture') != null) {
      let client: any = JSON.parse(localStorage.getItem('clientFacture')!);
      this.selectClient(client);
    }
  }

  get filteredClient() {
    return this.clientService.listClient.filter(client =>
      client.name.toLowerCase().includes(this.searchSelect.toLowerCase())
    );
  }

  selectClient(client: any) {
    if (client == 'autre') {
      this.isSelect = true;
    } else {
      this.clientAutre = null;
      this.isSelect = false;
      this.selectedClient = client;
      this.client = client.name; // Mettre à jour le nom du client sélectionné
      this.nom_client = client.name; // Mettre à jour l'ID du client sélectionné
      this.id_client = client.id; // Mettre à jour l'ID du client sélectionné
      this.code_client = client.code;
      this.numero_client = client.numero;
      this.searchSelect = '';
      this.showDropdown = false; // Fermer le dropdown après la sélection
    }
    localStorage.removeItem('clientFacture');
  }

  initFormCommande() {
    this.formCommande = this.formBuilder.group({
      date_comm: '',
      heure_comm: '',
      auteur: '',
      id_client: 1,
      nom_client: this.client,
      reduction: 0,
      versement: 0,
      restant: 0,
      net: 0,
      totht: 0,
      tottva: 0,
      totttc: 0,
      ligneCommande: [],
    });
  }

  dafaForm() {
    this.fCommande['date_comm'].setValue(this.date_comm);
    this.fCommande['heure_comm'].setValue(this.heure_comm);
    this.fCommande['id_client'].setValue(this.id_client);
    this.fCommande['nom_client'].setValue(this.client);
    this.fCommande['auteur'].setValue(this.userService.name);
    this.fCommande['totht'].setValue(this.totht);
    this.fCommande['reduction'].setValue(this.reduction);
    this.fCommande['net'].setValue(this.net);
    this.fCommande['tottva'].setValue(this.tottva);
    this.fCommande['totttc'].setValue(this.totttc);
    this.fCommande['restant'].setValue(this.net);
    this.fCommande['versement'].setValue(this.versement);
    this.fCommande['ligneCommande'].setValue(this.ligneCommandeService.listLigneCommande);
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

  initFormDossier() {
    this.formDossier = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }

  onSubmitClient() {
    this.formClient.value.auteur = this.userService.name;
    this.clientService.createData(this.formClient.value).subscribe({
      next: (data: any) => {
        let resp: any = data;
        this.initFormClient();
        this.toastrService.success('Client ' + resp.data.name + ' ajouté !');
        this.clientService.getAll().subscribe(
          data => {
            this.clientService.listClient = data;
          });
        this.selectClient(resp.data);
      },
      error: (err: { error: { message: any; }; }) => {
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
    this.commandeService.getMaxId().subscribe(
      data => {
        this.commandeService.maxId = this.year + 'F' + this.month + data.maxId;
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

  onChangeVente(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.typeVente = selectedValue;
  }

  onchangeGros(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneCommande.codeProduit = produit.code;
      this.ligneCommande.produit = produit.designation;
      this.ligneCommande.qtyProduit = produit.qty;
      this.ligneCommande.qty = 0.5;
      this.ligneCommande.prix = produit.prix_gros;
      this.ligneCommande.prix_achat = produit.prix_achat;
      this.ligneCommande.totht = this.ligneCommande.qty * this.ligneCommande.prix;
      this.ligneCommande.auteur = this.userService.name;
      this.ligneCommandeService.listLigneCommande.push(this.ligneCommande);
      localStorage.removeItem('listLigneCommande')
      localStorage.setItem('listLigneCommande', JSON.stringify(this.ligneCommandeService.listLigneCommande));
      this.nbrProduit = this.ligneCommandeService.listLigneCommande.length;
      this.ligneCommande = new LigneCommande();
      this.calcul();
    } else {
      this.deleteLigneCommande(produit.code);
    }
  }

  onchangeDouzaine(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneCommande.codeProduit = produit.code;
      this.ligneCommande.produit = produit.designation;
      this.ligneCommande.qtyProduit = produit.qty;
      this.ligneCommande.qty = 0.5;
      this.ligneCommande.prix = produit.prix_douzaine;
      this.ligneCommande.prix_achat = produit.prix_achat;
      this.ligneCommande.totht = this.ligneCommande.qty * this.ligneCommande.prix;
      this.ligneCommande.auteur = this.userService.name;
      this.ligneCommandeService.listLigneCommande.push(this.ligneCommande);
      localStorage.removeItem('listLigneCommande')
      localStorage.setItem('listLigneCommande', JSON.stringify(this.ligneCommandeService.listLigneCommande));
      this.nbrProduit = this.ligneCommandeService.listLigneCommande.length;
      this.ligneCommande = new LigneCommande();
      this.calcul();
    } else {
      this.deleteLigneCommande(produit.code);
    }
  }

  onchangeCarton(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneCommande.codeProduit = produit.code;
      this.ligneCommande.produit = produit.designation;
      this.ligneCommande.qtyProduit = produit.qty;
      this.ligneCommande.qty = 0.5;
      this.ligneCommande.prix = produit.prix_carton;
      this.ligneCommande.prix_achat = produit.prix_achat;
      this.ligneCommande.totht = this.ligneCommande.qty * this.ligneCommande.prix;
      this.ligneCommande.auteur = this.userService.name;
      this.ligneCommandeService.listLigneCommande.push(this.ligneCommande);
      localStorage.removeItem('listLigneCommande')
      localStorage.setItem('listLigneCommande', JSON.stringify(this.ligneCommandeService.listLigneCommande));
      this.nbrProduit = this.ligneCommandeService.listLigneCommande.length;
      this.ligneCommande = new LigneCommande();
      this.calcul();
    } else {
      this.deleteLigneCommande(produit.code);
    }
  }

  onchange(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneCommande.codeProduit = produit.code;
      this.ligneCommande.produit = produit.designation;
      this.ligneCommande.qtyProduit = produit.qty;
      this.ligneCommande.qty = 0.5;
      this.ligneCommande.prix = produit.prix;
      this.ligneCommande.prix_achat = produit.prix_achat;
      this.ligneCommande.totht = this.ligneCommande.qty * this.ligneCommande.prix;
      this.ligneCommande.auteur = this.userService.name;
      this.ligneCommandeService.listLigneCommande.push(this.ligneCommande);
      localStorage.removeItem('listLigneCommande')
      localStorage.setItem('listLigneCommande', JSON.stringify(this.ligneCommandeService.listLigneCommande));
      this.nbrProduit = this.ligneCommandeService.listLigneCommande.length;
      this.ligneCommande = new LigneCommande();
      this.calcul();
    } else {
      this.deleteLigneCommande(produit.code);
    }
  }

  onchangeGrosAlert(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected) {
      // Ouvre le modal manuellement seulement si le produit n'est pas sélectionné
      const modal = new bootstrap.Modal(document.getElementById('modalAlertLine'));
      modal.show();
      localStorage.removeItem('produit');
      localStorage.setItem('produit', JSON.stringify(produit));
    } else {
      this.deleteLigneCommande(produit.code);
    }
  }

  onchangeDouzaineAlert(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected) {
      // Ouvre le modal manuellement seulement si le produit n'est pas sélectionné
      const modal = new bootstrap.Modal(document.getElementById('modalAlertLine'));
      modal.show();
      localStorage.removeItem('produit');
      localStorage.setItem('produit', JSON.stringify(produit));
    } else {
      this.deleteLigneCommande(produit.code);
    }
  }

  onchangeCartonAlert(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected) {
      // Ouvre le modal manuellement seulement si le produit n'est pas sélectionné
      const modal = new bootstrap.Modal(document.getElementById('modalAlertLine'));
      modal.show();
      localStorage.removeItem('produit');
      localStorage.setItem('produit', JSON.stringify(produit));
    } else {
      this.deleteLigneCommande(produit.code);
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
      this.deleteLigneCommande(produit.code);
    }
  }

  submitAlert() {
    if (localStorage.getItem('produit') != null) {
      let produit: any = JSON.parse(localStorage.getItem('produit')!);
      if (this.typeVente == 'detail') {
        this.onchange(produit);
      } else if (this.typeVente == 'gros') {
        this.onchange(produit);
      } else if (this.typeVente == 'douzaine') {
        this.onchange(produit);
      } else {
        this.onchangeGros(produit);
      }
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
    let total = 0, benefice = 0;
    if (this.ligneCommandeService.listLigneCommande.length > 0) {
      for (var i = 0; i < this.ligneCommandeService.listLigneCommande.length; i++) {
        if (this.ligneCommandeService.listLigneCommande[i].totht) {
          total += this.ligneCommandeService.listLigneCommande[i].totht;
          this.totht = total;
        }
        this.getTtc();
      }
      localStorage.removeItem('listLigneCommande')
      localStorage.setItem('listLigneCommande', JSON.stringify(this.ligneCommandeService.listLigneCommande));
    } else {
      this.removeLcmd();
    }
    return [total, benefice];
  }

  // Calcule Totat TTC
  getTtc() {
    this.totttc = (this.totht + (this.totht * this.tottva) / 100);
    this.net = this.totttc - this.reduction;
  }

  // Delete Ligne Commande
  deleteLigneCommande(code: any) {
    for (let i = 0; i < this.ligneCommandeService.listLigneCommande.length; ++i) {
      this.nbrProduit = i;
      if (this.ligneCommandeService.listLigneCommande[i].codeProduit == code) {
        this.ligneCommandeService.listLigneCommande.splice(i, 1);
      }
    }

    for (var i = 0; i < this.produitService.listProduits.length; i++) {
      if (this.produitService.listProduits[i].code == code) {
        this.produitService.listProduits[i].isselected = false;
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
    localStorage.removeItem("listLigneCommande");
    this.ligneCommandeService.listLigneCommande = [];
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
  incremente(pi: LigneCommande) {
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
  decremente(pi: LigneCommande) {
    if (pi.qty != 0.5) {
      pi.qty = pi.qty - 0.5;
      pi.totht = pi.qty * pi.prix;
    }
    this.calcul();
  }

  // Edit Line
  editDomain(p: LigneCommande) {
    this.editeLigne = true
    p.editable = !p.editable;
  }

  // Edit Line Valid
  editDomainValid(p: LigneCommande) {
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

  onSubmitCommande() {
    this.isDisable = true;
    this.isClick = true;
    this.dafaForm();
    this.fCommande['heure_comm'].setValue(this.getHeure(new Date(Date.now())));
    if (this.clientAutre) {
      this.fCommande['nom_client'].setValue(this.clientAutre);
    }
    this.commandeService.create(this.formCommande.value).subscribe(
      data => {
        let resp: any = data;
        this.toastrService.success('Commande numero ' + resp.commande.numero + ' crée !');
        this.commandeService.detail(resp.commande);
      });
  }

  onSubmitDevis() {
    this.isDisable = true;
    this.isClick = true;
    this.dafaForm();
    this.fCommande['heure_comm'].setValue(this.getHeure(new Date(Date.now())));
    if (this.clientAutre) {
      this.fCommande['nom_client'].setValue(this.clientAutre);
    }
    this.devisService.create(this.formCommande.value).subscribe(
      data => {
        let resp: any = data;
        this.toastrService.success('Devis numero ' + resp.devis.numero + ' crée !');
        this.devisService.detail(resp.devis);
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

  routeVente() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/vente']);
  }

  routeTicket() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.commandeService.getCommandesDay();
    this.router.navigate(['/ticket']);
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

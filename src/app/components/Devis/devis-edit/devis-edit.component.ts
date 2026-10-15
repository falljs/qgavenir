import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LigneDevis } from 'src/app/models/ligne-devis';
import { Produit } from 'src/app/models/produit';
import { ClientService } from 'src/app/services/client.service';
import { DevisService } from 'src/app/services/devis.service';
import { LigneDevisService } from 'src/app/services/ligne-devis.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-devis-edit',
  templateUrl: './devis-edit.component.html',
  styleUrls: ['./devis-edit.component.scss']
})
export class DevisEditComponent implements OnInit {

  formDossier!: FormGroup;
  formClient!: FormGroup;
  fUpdateDevis!: FormGroup;

  maxIdCmd!: number;
  ligneDevis!: LigneDevis;
  nbrProduit!: number;

  date!: any;
  heure: any;

  isValid: boolean = true;

  // Var Form devis
  id!: number;
  numero!: number;
  date_devis!: string;
  heure_devis!: string;
  type!: string;
  totht!: number;
  net!: number;
  tottva!: number;
  auteur!: number;
  id_client!: any;
  nom_client!: any;
  code_client!: any;
  numero_client!: any;
  email_client!: any;
  totttc!: number;

  editeLigne!: boolean;
  isDisable: boolean = false;
  isClick: boolean = false;
  devis!: any;
  client!: any;

  clientAutre: any;

  typeVente: any = 'detail';

  searchSelect = '';
  selectedClient: any = null;
  showDropdown = false;
  isSelect = false;

  constructor(public produitService: ProduitService, public ligneDevisService: LigneDevisService,
    public devisService: DevisService, public userService: UserService, public clientService: ClientService,
    public toastrService: ToastrService, public formBuilder: FormBuilder) { }
  get fClient() { return this.formClient.controls }
  get fDossier() { return this.formDossier.controls }
  get formUpdatedevis() { return this.fUpdateDevis.controls }

  ngOnInit(): void {
    this.getProduits();
    this.getClients();
    this.ligneDevis = new LigneDevis();
    this.initFormClient();
    this.initFormdevis();

    if (localStorage.getItem('devis') != null) {
      this.devis = JSON.parse(localStorage.getItem('devis')!);
      this.ligneDevisService.listLigneDevis = JSON.parse(localStorage.getItem('listLigneDevis')!);
      var clt = JSON.parse(localStorage.getItem('client')!);
      if (this.devis.code_client == "0") {
        this.isSelect = true;
        this.clientAutre = this.devis.nom_client;
      } else {
        this.isSelect = false;
        this.selectedClient = clt;
        this.selectClient(this.selectedClient);
      }
      this.id = this.devis.id;
      this.numero = this.devis.numero;
      this.date_devis = this.devis.date_devis;
      this.heure_devis = this.devis.heure_devis;
      this.type = this.devis.type;
      this.totht = this.devis.totht;
      this.net = this.devis.net;
      this.tottva = this.devis.tottva;
      this.auteur = this.userService.name;
      this.totttc = this.devis.totttc;

      let total = 0;
      for (var i = 0; i < this.ligneDevisService.listLigneDevis.length; i++) {
        if (this.ligneDevisService.listLigneDevis[i].totht) {
          total += this.ligneDevisService.listLigneDevis[i].totht;
          this.totht = total;
        }
        this.getTtc();
      }
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
      this.id_client = client.id; // Mettre à jour l'ID du client sélectionné
      this.code_client = client.code;
      this.nom_client = client.name;
      this.numero_client = client.numero;
      this.searchSelect = '';
      this.showDropdown = false; // Fermer le dropdown après la sélection
    }
  }

  onChangeVente(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.typeVente = selectedValue;
  }

  initFormdevis() {
    this.fUpdateDevis = this.formBuilder.group({
      id: this.id,
      numero: this.numero,
      date_devis: '',
      heure_devis: '',
      type: '',
      auteur: '',
      id_client: 1,
      nom_client: '',
      net: 0,
      totht: 0,
      tottva: 0,
      totttc: 0,
      ligneDevis: [],
    });
  }

  dafaForm() {
    this.formUpdatedevis['id'].setValue(this.id);
    this.formUpdatedevis['numero'].setValue(this.numero);
    this.formUpdatedevis['date_devis'].setValue(this.date_devis);
    this.formUpdatedevis['heure_devis'].setValue(this.heure_devis);
    this.formUpdatedevis['type'].setValue(this.type);
    this.formUpdatedevis['id_client'].setValue(this.id_client);
    this.formUpdatedevis['nom_client'].setValue(this.nom_client);
    this.formUpdatedevis['auteur'].setValue(this.userService.name);
    this.formUpdatedevis['totht'].setValue(this.totht);
    this.formUpdatedevis['net'].setValue(this.net);
    this.formUpdatedevis['tottva'].setValue(this.tottva);
    this.formUpdatedevis['totttc'].setValue(this.totttc);
    this.formUpdatedevis['ligneDevis'].setValue(this.ligneDevisService.listLigneDevis);
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
    this.clientService.createData(this.formClient.value).subscribe({
      next: data => {
        let resp: any = data;
        this.initFormClient();
        this.getClients();
        this.toastrService.success('Client ' + resp.data.name + ' ajouté !');
        //this.getClients();
        this.id_client = resp.data.id;
        this.selectClient(resp.data);
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  getProduits() {
    // 0.5. Récupération du cache local listProduitsCache
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

  getClients() {
    this.clientService.getAll().subscribe(
      data => {
        this.clientService.listClient = data;
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
      this.ligneDevis = new LigneDevis;
      this.calcul();
    } else {
      this.deleteLigneDevis(produit.code);
    }
  }

  onchangeDouzaine(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneDevis.codeProduit = produit.code;
      this.ligneDevis.produit = produit.designation;
      this.ligneDevis.qtyProduit = produit.qty;
      this.ligneDevis.qty = 0.5;
      this.ligneDevis.prix = produit.prix_douzaine;
      this.ligneDevis.prix_achat = produit.prix_achat;
      this.ligneDevis.totht = this.ligneDevis.qty * this.ligneDevis.prix;
      this.ligneDevis.auteur = this.userService.name;
      this.ligneDevisService.listLigneDevis.push(this.ligneDevis);
      localStorage.removeItem('listLigneDevis')
      localStorage.setItem('listLigneDevis', JSON.stringify(this.ligneDevisService.listLigneDevis));
      this.nbrProduit = this.ligneDevisService.listLigneDevis.length;
      this.ligneDevis = new LigneDevis;
      this.calcul();
    } else {
      this.deleteLigneDevis(produit.code);
    }
  }

  onchangeCarton(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneDevis.codeProduit = produit.code;
      this.ligneDevis.produit = produit.designation;
      this.ligneDevis.qtyProduit = produit.qty;
      this.ligneDevis.qty = 0.5;
      this.ligneDevis.prix = produit.prix_carton;
      this.ligneDevis.prix_achat = produit.prix_achat;
      this.ligneDevis.totht = this.ligneDevis.qty * this.ligneDevis.prix;
      this.ligneDevis.auteur = this.userService.name;
      this.ligneDevisService.listLigneDevis.push(this.ligneDevis);
      localStorage.removeItem('listLigneDevis')
      localStorage.setItem('listLigneDevis', JSON.stringify(this.ligneDevisService.listLigneDevis));
      this.nbrProduit = this.ligneDevisService.listLigneDevis.length;
      this.ligneDevis = new LigneDevis;
      this.calcul();
    } else {
      this.deleteLigneDevis(produit.code);
    }
  }

  onchange(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneDevis.devis = 0;
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
      this.ligneDevis = new LigneDevis;
      this.calcul();
    } else {
      this.deleteLigneDevis(produit.code);
    }
  }

  onchangeGrosAlert(produit: Produit) {
    // push vers Ligne Commande choix
    if (produit.isselected) {
      // Ouvre le modal manuellement seulement si le produit n'est pas sélectionné
      const modal = new bootstrap.Modal(document.getElementById('modalAlertLine'));
      modal.show();
      localStorage.removeItem('produit');
      localStorage.setItem('produit', JSON.stringify(produit));
    } else {
      this.deleteLigneDevis(produit.code);
    }
  }

  onchangeDouzaineAlert(produit: Produit) {
    // push vers Ligne Commande choix
    if (produit.isselected) {
      // Ouvre le modal manuellement seulement si le produit n'est pas sélectionné
      const modal = new bootstrap.Modal(document.getElementById('modalAlertLine'));
      modal.show();
      localStorage.removeItem('produit');
      localStorage.setItem('produit', JSON.stringify(produit));
    } else {
      this.deleteLigneDevis(produit.code);
    }
  }

  onchangeCartonAlert(produit: Produit) {
    // push vers Ligne Commande choix
    if (produit.isselected) {
      // Ouvre le modal manuellement seulement si le produit n'est pas sélectionné
      const modal = new bootstrap.Modal(document.getElementById('modalAlertLine'));
      modal.show();
      localStorage.removeItem('produit');
      localStorage.setItem('produit', JSON.stringify(produit));
    } else {
      this.deleteLigneDevis(produit.code);
    }
  }

  onchangeAlert(produit: Produit) {
    // push vers Ligne Commande choix
    if (produit.isselected) {
      // Ouvre le modal manuellement seulement si le produit n'est pas sélectionné
      const modal = new bootstrap.Modal(document.getElementById('modalAlertLine'));
      modal.show();
      localStorage.removeItem('produit');
      localStorage.setItem('produit', JSON.stringify(produit));
    } else {
      this.deleteLigneDevis(produit.code);
    }
  }

  submitAlert() {
    if (localStorage.getItem('produit') != null) {
      let produit: any = JSON.parse(localStorage.getItem('produit')!);
      if (this.typeVente == 'detail') {
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
    let total = 0;
    if (this.ligneDevisService.listLigneDevis.length > 0) {
      for (var i = 0; i < this.ligneDevisService.listLigneDevis.length; i++) {
        if (this.ligneDevisService.listLigneDevis[i].totht) {
          total += this.ligneDevisService.listLigneDevis[i].totht;
          this.totht = total;
        }
        this.getTtc();
      }
      localStorage.removeItem('listLigneDevis')
      localStorage.setItem('listLigneDevis', JSON.stringify(this.ligneDevisService.listLigneDevis));
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

  // Delete Ligne devis
  deleteLigneDevis(code: any) {
    for (let i = 0; i < this.ligneDevisService.listLigneDevis.length; ++i) {
      this.nbrProduit = i;
      if (this.ligneDevisService.listLigneDevis[i].codeProduit == code) {
        this.ligneDevisService.listLigneDevis.splice(i, 1);
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

  openDossier() {
    this.formDossier.reset();
  }

  // Remove Ligne devis
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
    if (pi.id) {
      pi.qty = pi.qty + 0.5;
      pi.totht = pi.qty * pi.prix;
    } else {
      if (pi.qty < pi.qtyProduit) {
        pi.qty = pi.qty + 0.5;
        pi.totht = pi.qty * pi.prix;
      } else {
        pi.qty = pi.qty + 0.5;
        let emprunt: number = pi.qty - pi.qtyProduit;
        this.toastrService.error('Vous venez demprunter une quantité de ' + emprunt + ' sur ce produit !');
        pi.totht = pi.qty * pi.prix;
      }
    }
    this.calcul();
  }

  //Incrémenter
  decremente(pi: LigneDevis) {
    if (pi.qty != 0.5) {
      pi.qty = pi.qty - 0.5;
      pi.totht = pi.qty * pi.prix;
    } else {
      this.toastrService.error('La quanté doit être au moins 0.5');
    }
    this.calcul();
  }

  // Edit Line
  editDomain(p: LigneDevis) {
    if (!p.editable) {
      this.editeLigne = true
    } else {
      this.editeLigne = false
    }
    p.editable = !p.editable;
    p.totht = p.qty * p.prix;
  }

  // Edit Line Valid
  editDomainValid(p: LigneDevis) {
    this.editeLigne = false;
    p.editable = !p.editable;
    if (p.id) {
      if (p.qty > p.qtyProduit) {
        p.totht = p.qty * p.prix;
      } else if (p.qty < 0.5) {
        this.toastrService.error('La quantité doit être au moins 0.5');
        p.qty = 0.5;
        p.totht = p.qty * p.prix;
      } else {
        p.totht = p.qty * p.prix;
      }
    } else {
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
    }
    this.calcul();
  }

  onSubmitUpdateDevis() {
    this.isDisable = true;
    this.isClick = true;
    this.dafaForm();
    if (this.clientAutre) {
      this.formUpdatedevis['nom_client'].setValue(this.clientAutre);
    }

    this.devisService.update(this.fUpdateDevis.value).subscribe(
      data => {
        let resp: any = data;
        this.toastrService.success('devis numero ' + resp.devis.numero + ' mise à jour !');
        this.devisService.detail(resp.devis);
      });
  }

  retour() {
    this.devisService.detail(this.devis);
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


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LigneBon } from 'src/app/models/ligne-bon';
import { BonService } from 'src/app/services/bon.service';
import { ClientService } from 'src/app/services/client.service';
import { LigneBonService } from 'src/app/services/ligne-bon.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
declare var bootstrap: any;

@Component({
  selector: 'app-edit-bon',
  templateUrl: './edit-bon.component.html',
  styleUrls: ['./edit-bon.component.scss']
})
export class EditBonComponent implements OnInit {

  formDossier!: FormGroup;
  formClient!: FormGroup;
  fUpdateBon!: FormGroup;

  maxIdBon!: number;
  ligneBon!: LigneBon;
  nbrProduit!: number;

  date!: any;
  heure: any;

  isValid: boolean = true;

  // Var Form bon
  id!: number;
  numero!: number;
  date_bon!: string;
  heure_bon!: string;
  valid!: boolean;
  etat!: boolean;
  totht!: number;
  reduction!: number;
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
  bon!: any;
  client!: any;

  searchSelect = '';
  selectedClient: any = null;
  showDropdown = false;

  constructor(public produitService: ProduitService, public ligneBonService: LigneBonService,
    public bonService: BonService, public userService: UserService,
    public clientService: ClientService,
    public toastrService: ToastrService, public formBuilder: FormBuilder) { }
  get fClient() { return this.formClient.controls }
  get fDossier() { return this.formDossier.controls }
  get formUpdateBon() { return this.fUpdateBon.controls }

  ngOnInit() {
    this.getProduits();
    this.getClients();
    this.ligneBon = new LigneBon();
    this.initFormClient();
    this.initFormBon();
    if (localStorage.getItem('bon') != null) {
      this.bon = JSON.parse(localStorage.getItem('bon')!);
      this.client = JSON.parse(localStorage.getItem('client')!);
      if (this.client) {
        this.selectedClient = this.client;
        this.selectClient(this.selectedClient);
      }
      this.id = this.bon.id;
      this.numero = this.bon.numero;
      this.date_bon = this.bon.date_bon;
      this.heure_bon = this.bon.heure_bon;
      this.valid = this.bon.valid;
      this.etat = this.bon.etat;
      this.totht = this.bon.totht;
      this.reduction = this.bon.reduction;
      this.net = this.bon.net;
      this.tottva = this.bon.tottva;
      this.auteur = this.userService.name;
      this.id_client = this.client.id;
      this.totttc = this.bon.totttc;
    }
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
    }
  }

  get filteredClient() {
    return this.clientService.listClient.filter(client =>
      client.name.toLowerCase().includes(this.searchSelect.toLowerCase())
    );
  }

  selectClient(client: any) {
    this.selectedClient = client;
    this.client.name = client.name; // Mettre à jour le nom du client sélectionné
    this.id_client = client.id; // Mettre à jour l'ID du client sélectionné
    this.code_client = client.code;
    this.nom_client = client.name;
    this.numero_client = client.numero;
    this.searchSelect = '';
    this.showDropdown = false; // Fermer le dropdown après la sélection
  }

  initFormBon() {
    this.fUpdateBon = this.formBuilder.group({
      id: this.id,
      numero: this.numero,
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
    this.formUpdateBon['id'].setValue(this.id);
    this.formUpdateBon['numero'].setValue(this.numero);
    this.formUpdateBon['date_bon'].setValue(this.date_bon);
    this.formUpdateBon['heure_bon'].setValue(this.heure_bon);
    this.formUpdateBon['nom_client'].setValue(this.nom_client);
    this.formUpdateBon['id_client'].setValue(this.id_client);
    this.formUpdateBon['auteur'].setValue(this.userService.name);
    this.formUpdateBon['totht'].setValue(this.totht);
    this.formUpdateBon['reduction'].setValue(this.reduction);
    this.formUpdateBon['net'].setValue(this.net);
    this.formUpdateBon['tottva'].setValue(this.tottva);
    this.formUpdateBon['totttc'].setValue(this.totttc);
    this.formUpdateBon['ligneBon'].setValue(this.ligneBonService.listLigneBon);
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
    this.produitService.getAllProduct().subscribe(
      data => {
        this.produitService.listProduits = data;
      });
  }

  getClients() {
    this.clientService.getAll().subscribe(
      data => {
        this.clientService.listClient = data;
      });

  }



  onchange(produit: any) {
    // push vers Ligne bon choix
    if (produit.isselected == true) {
      this.ligneBon.bon = 0;
      this.ligneBon.codeProduit = produit.code;
      this.ligneBon.produit = produit.designation;
      this.ligneBon.qtyProduit = produit.qty;
      this.ligneBon.qty = 1;
      this.ligneBon.prix = produit.prix;
      this.ligneBon.prix_achat = produit.prix_achat;
      this.ligneBon.totht = this.ligneBon.qty * this.ligneBon.prix;
      this.ligneBon.auteur = this.userService.name;
      this.ligneBonService.listLigneBon.push(this.ligneBon);
      localStorage.removeItem('listLigneBon')
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

  // Delete Ligne bon
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

  openDossier() {
    this.formDossier.reset();
  }

  // Remove Ligne bon
  removeLcmd() {
    localStorage.removeItem("listLigneBon");
    this.ligneBonService.listLigneBon = [];
    this.totht = 0;
    this.tottva = 0;
    this.totttc = 0;
    this.reduction = 0;
    this.net = 0;
  }

  //Décrémenter
  incremente(pi: LigneBon) {
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
  decremente(pi: LigneBon) {
    if (pi.qty != 0.5) {
      pi.qty = pi.qty - 0.5;
      pi.totht = pi.qty * pi.prix;
    }
    this.calcul();
  }

  // Edit Line
  editDomain(p: LigneBon) {
    if (!p.editable) {
      this.editeLigne = true
    } else {
      this.editeLigne = false
    }
    p.editable = !p.editable;
    p.totht = p.qty * p.prix;
  }

  // Edit Line Valid
  editDomainValid(p: LigneBon) {
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

  onSubmitUpdateBon() {
    this.isDisable = true;
    this.isClick = true;
    this.dafaForm();
    this.bonService.update(this.fUpdateBon.value).subscribe(
      data => {
        let resp: any = data;
        this.toastrService.success('bon numero ' + resp.bon.numero + ' mise à jour !');
        this.bonService.detail(resp.bon);
      });
  }

  retour() {
    this.bonService.detail(this.bon);
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

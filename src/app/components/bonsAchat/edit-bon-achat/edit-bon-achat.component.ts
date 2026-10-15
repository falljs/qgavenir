import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LigneAchat } from 'src/app/models/ligne-achat';
import { BonAchatService } from 'src/app/services/bon-achat.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { LigneAchatService } from 'src/app/services/ligne-achat.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-bon-achat',
  templateUrl: './edit-bon-achat.component.html',
  styleUrls: ['./edit-bon-achat.component.scss']
})
export class EditBonAchatComponent implements OnInit {

  formFournisseur!: FormGroup;
  formAchat!: FormGroup;

  maxIdAcht!: number;
  ligneBonAchat!: LigneAchat;
  nbrProduit!: number;

  date!: any;
  heure: any;

  isValid: boolean = true;

  // Var Form Achat
  id!: number;
  numero: any;
  year!: any;
  month!: any;
  date_achat!: any;
  heure_achat!: any;
  totht: number = 0;
  reduction: number = 0;
  restant: number = 0;
  versement: number = 0;
  net: number = 0;
  tottva: number = 0;
  auteur!: any;
  nom_fn!: any;
  totttc: number = 0;
  totalFrais: number = 0;
  numCheck!: any;
  typeFrais: number = 0;

  editeLigne!: boolean;
  isDisable: boolean = false;
  isClick: boolean = false;
  isTypeFrais: boolean = false;

  achat!: any;

  fournisseurs!: any[];

  // Produit
  designation: any;

  searchSelect = '';
  selectedFournisseur: any = null;
  showDropdown = false;

  constructor(public produitService: ProduitService, public ligneAchatService: LigneAchatService,
    public bonAchatService: BonAchatService, public userService: UserService,
    public fournisseurService: FournisseurService,
    public router: Router, public localStorageService: LocalStorageService,
    private datePipe: DatePipe, public toastrService: ToastrService,
    public formBuilder: FormBuilder,) { }
  get fFournisseur() { return this.formFournisseur.controls }
  get fAchat() { return this.formAchat.controls }

  ngOnInit(): void {
    this.getProduits();
    this.getFournisseurs();
    this.ligneBonAchat = new LigneAchat();
    this.initFormFournisseur();
    this.initFormAchat();
    if (localStorage.getItem('bonAchat') != null) {
      this.achat = JSON.parse(localStorage.getItem('bonAchat')!);
      this.ligneAchatService.listLigneBonAchat = JSON.parse(localStorage.getItem('listLigneBonAchats')!);
      var fns = JSON.parse(localStorage.getItem('fournisseur')!);
      if (fns) {
        this.selectedFournisseur = fns;
        this.selectFournisseur(this.selectedFournisseur);
      }
      this.id = this.achat.id;
      this.numero = this.achat.numero;
      this.date_achat = this.achat.date_achat;
      this.heure_achat = this.achat.heure_achat;
      this.totht = this.achat.totht;
      this.reduction = this.achat.reduction;
      this.restant = this.achat.restant;
      this.versement = this.achat.versement;
      this.net = this.achat.net;
      this.tottva = this.achat.tottva;
      this.auteur = this.userService.name;
      this.totttc = this.achat.totttc;
      this.typeFrais = this.achat.typeFrais;
      this.totalFrais = this.achat.totalFrais;
      this.numCheck = this.achat.numCheck;

      let total = 0; let frais = 0;
      for (var i = 0; i < this.ligneAchatService.listLigneBonAchat.length; i++) {
        if (this.ligneAchatService.listLigneBonAchat[i].totht) {
          total += this.ligneAchatService.listLigneBonAchat[i].totht;
          this.totht = total;
        }
        this.getTtc();
      }
    }
  }

  get filteredFournisseur() {
    return this.fournisseurs.filter(fournisseur =>
      fournisseur.name.toLowerCase().includes(this.searchSelect.toLowerCase())
    );
  }

  selectFournisseur(fournisseur: any) {
    this.selectedFournisseur = fournisseur;
    this.nom_fn = fournisseur.name;
    this.searchSelect = '';
    this.showDropdown = false; // Fermer le dropdown après la sélection
  }

  initFormAchat() {
    this.formAchat = this.formBuilder.group({
      id: this.id,
      date_achat: '',
      heure_achat: '',
      auteur: '',
      nom_fn: '',
      reduction: 0,
      versement: 0,
      restant: 0,
      net: 0,
      totht: 0,
      tottva: 0,
      totttc: 0,
      numCheck: '',
      totalFrais: 0,
      typeFrais: 0,
      ligneBonAchat: [],
    });
  }

  dafaForm() {
    this.fAchat['id'].setValue(this.id);
    this.fAchat['date_achat'].setValue(this.date_achat);
    this.fAchat['heure_achat'].setValue(this.heure_achat);
    this.fAchat['nom_fn'].setValue(this.nom_fn);
    this.fAchat['auteur'].setValue(this.userService.name);
    this.fAchat['totht'].setValue(this.totht);
    this.fAchat['reduction'].setValue(this.reduction);
    this.fAchat['net'].setValue(this.net);
    this.fAchat['tottva'].setValue(this.tottva);
    this.fAchat['totttc'].setValue(this.totttc);
    this.fAchat['totttc'].setValue(this.totttc);
    this.fAchat['numCheck'].setValue(this.numCheck);
    this.fAchat['totalFrais'].setValue(this.totalFrais);
    this.fAchat['typeFrais'].setValue(this.typeFrais);
    if (this.achat.versement != 0) {
      this.fAchat['restant'].setValue(this.restant);
    } else {
      this.fAchat['restant'].setValue(this.net);
    }
    this.fAchat['versement'].setValue(this.versement);
    this.fAchat['numCheck'].setValue(this.numCheck);
    this.fAchat['ligneBonAchat'].setValue(this.ligneAchatService.listLigneBonAchat);
  }

  initFormFournisseur() {
    this.formFournisseur = new FormGroup({
      name: new FormControl('', [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }


  onSubmitFournisseur() {
    this.fournisseurService.createData(this.formFournisseur.value).subscribe({
      next: (data: any) => {
        let resp: any = data;
        this.initFormFournisseur();
        this.fournisseurService.getAll().subscribe(
          data => {
            this.fournisseurs = data;
          });
        this.selectFournisseur(resp.data);
      },
      error: (err: { error: { message: any; }; }) => {
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

  getProduitsByCode(code: any) {
    this.produitService.getProduitsByCodeFn(code).subscribe(
      (data: any[]) => {
        this.produitService.listProduits = data;
      });
  }


  getYear(date: any) {
    return this.datePipe.transform(date, 'yy');
  }

  getMonth(date: any) {
    return this.datePipe.transform(date, 'MM');
  }

  //Get All product fournisseurs!:any[];
  getFournisseurs() {
    this.fournisseurService.getAll().subscribe((res: any[]) => {
      this.fournisseurs = res;
    });
  }


  onchange(produit: any) {
    // push vers Ligne Commande choixdesignation
    if (produit.isselected == true) {
      this.ligneBonAchat.code = produit.code;
      this.ligneBonAchat.designation = produit.designation;
      this.ligneBonAchat.qty = 0.5;
      this.ligneBonAchat.frais = 0;
      this.ligneBonAchat.prix_achat = produit.prix_achat;
      this.ligneBonAchat.totht = this.ligneBonAchat.qty * this.ligneBonAchat.prix_achat;
      this.ligneBonAchat.auteur = this.userService.name;
      this.ligneAchatService.listLigneBonAchat.push(this.ligneBonAchat);
      localStorage.removeItem('listLigneBonAchats');
      localStorage.setItem('listLigneBonAchats', JSON.stringify(this.ligneAchatService.listLigneBonAchat));
      this.nbrProduit = this.ligneAchatService.listLigneBonAchat.length;
      this.ligneBonAchat = new LigneAchat();
      this.calcul();
    } else {
      this.deleteLigneAchat(produit.code);
    }
  }

  // Edit Line
  editDomain(p: LigneAchat) {
    this.editeLigne = true
    p.editable = !p.editable;
  }

  // Edit Line Valid
  editDomainValid(p: LigneAchat) {
    this.editeLigne = false;
    p.editable = !p.editable;
    if (p.qty < 0.5) {
      this.toastrService.error('La quantité doit être au moins 0.5');
      p.qty = 0.5;
      p.totht = p.qty * p.prix_achat;
    } else {
      p.totht = p.qty * p.prix_achat;
    }
    this.calcul();
  }

  //Décrémenter
  incremente(pi: LigneAchat) {
    pi.qty = pi.qty + 0.5;
    pi.totht = pi.qty * pi.prix_achat;
    this.calcul();
  }

  //Incrémenter
  decremente(pi: LigneAchat) {
    if (pi.qty != 0.5) {
      pi.qty = pi.qty - 0.5;
      pi.totht = pi.qty * pi.prix_achat;
    } else {
      this.toastrService.error('La quantité doit être au moins 0.5');
    }
    this.calcul();
  }

  // Calcule Totat Ht
  calcul() {
    let total = 0; let frais = 0;
    if (this.ligneAchatService.listLigneBonAchat.length > 0) {
      for (var i = 0; i < this.ligneAchatService.listLigneBonAchat.length; i++) {
        if (this.ligneAchatService.listLigneBonAchat[i].totht) {
          total += this.ligneAchatService.listLigneBonAchat[i].totht;
          this.totht = total;
        }

        this.getTtc();
      }
      localStorage.removeItem('listLigneBonAchats');
      localStorage.setItem('listLigneBonAchats', JSON.stringify(this.ligneAchatService.listLigneBonAchat));
    } else {
      this.removeLcmd();
    }
    return total;
  }

  // Calcule Totat TTC
  getTtc() {
    this.totttc = (this.totht + (this.totht * this.tottva) / 100);
    //this.totttc = this.totttc + this.totalFrais;
    this.net = this.totttc - this.reduction;
    this.restant = this.net - this.versement;
  }

  // Calcule Totat TTC
  getFrais() {
    if (this.typeFrais == 1) {
      this.isTypeFrais = true;
    } else {
      this.isTypeFrais = false;
    }
  }

  // Delete Ligne achat
  deleteLigneAchat(code: any) {
    for (let i = 0; i < this.ligneAchatService.listLigneBonAchat.length; ++i) {
      this.nbrProduit = i;
      if (this.ligneAchatService.listLigneBonAchat[i].code == code) {
        this.ligneAchatService.listLigneBonAchat.splice(i, 1);
      }
    }
    this.calcul();

    for (var i = 0; i < this.produitService.listProduits.length; i++) {
      if (this.produitService.listProduits[i].code == code) {
        this.produitService.listProduits[i].isselected = false;
      }
    }
  }


  openFournisseur() {
    this.formFournisseur.reset();
  }

  // Remove Ligne achat
  removeLcmd() {
    localStorage.removeItem("listLigneBonAchats");
    this.ligneAchatService.listLigneBonAchat = [];
    this.totht = 0;
    this.tottva = 0;
    this.totttc = 0;
    this.reduction = 0;
    this.net = 0;
    this.totalFrais = 0;

    for (var i = 0; i < this.produitService.listProduits.length; i++) {
      this.produitService.listProduits[i].isselected = false;
    }
  }

  alert() {
    this.reduction = 0;
  }

  detailBonAchat() {
    this.bonAchatService.detail(this.achat);
  }

  onSubmitAchat() {
    this.isDisable = true;
    this.isClick = true;
    this.dafaForm();
    this.bonAchatService.update(this.formAchat.value).subscribe(
      (data: any) => {
        let resp: any = data;
        this.bonAchatService.detail(resp.bonAchat);
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

  /**************************** Search Filter MotCle *******************************/
  searchMotCle() {
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
          txtValue0.toUpperCase().indexOf(filter) > -1
        ) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  routeTicketAchat() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/achat']);
  }
}

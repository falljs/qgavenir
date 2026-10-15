import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Achat } from 'src/app/models/achat';
import { LigneAchat } from 'src/app/models/ligne-achat';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
import { LigneAchatService } from 'src/app/services/ligne-achat.service';
import { AchatService } from 'src/app/services/achat.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { BonAchatService } from 'src/app/services/bon-achat.service';
declare var $: any;

@Component({
  selector: 'app-create-achat',
  templateUrl: './create-achat.component.html',
  styleUrls: ['./create-achat.component.scss']
})
export class CreateAchatComponent implements OnInit {

  formFournisseur!: FormGroup;
  formAchat!: FormGroup;

  maxIdAcht!: number;
  achat: Achat = new Achat;
  ligneAchat!: LigneAchat;
  nbrProduit!: number;

  date!: any;
  heure: any;

  isValid: boolean = true;

  // Var Form Achat
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
  numCheck!: any;
  totalFrais: number = 0;
  typeFrais!: any;

  editeLigne!: boolean;
  isDisable: boolean = false;
  isClick: boolean = false;
  isTypeFrais: boolean = false;

  fournisseurs!: any[];


  // Produit
  designation: any;

  searchSelect = '';
  selectedFournisseur: any = null;
  showDropdown = false;

  searchSelectProd = '';

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public produitService: ProduitService, public ligneAchatService: LigneAchatService,
    public achatService: AchatService, public userService: UserService,
    public fournisseurService: FournisseurService,
    public router: Router, public localStorageService: LocalStorageService,
    private datePipe: DatePipe, public toastrService: ToastrService,
    public formBuilder: FormBuilder, public bonAchatService: BonAchatService) { }
  get fFournisseur() { return this.formFournisseur.controls }
  get fAchat() { return this.formAchat.controls }

  ngOnInit(): void {
    this.ligneAchat = new LigneAchat();
    this.getProduits();
    this.produitService.listProduits = [];
    this.getFournisseurs();
    this.getMaxId();
    this.initFormFournisseur();
    this.initFormAchat();
    this.date_achat = this.getDate(new Date(Date.now()));
    this.heure_achat = this.getHeure(new Date(Date.now()));
    this.typeFrais = '0';
    this.ligneAchatService.listLigneAchat = [];
    if (localStorage.getItem('listLigneAchats') != null) {
      this.ligneAchatService.listLigneAchat = JSON.parse(localStorage.getItem('listLigneAchats')!);
      let total = 0; let frais = 0;
      for (var i = 0; i < this.ligneAchatService.listLigneAchat.length; i++) {
        if (this.ligneAchatService.listLigneAchat[i].totht) {
          total += this.ligneAchatService.listLigneAchat[i].totht;
          this.totht = total;
        }
        this.getTtc();
      }
    } else {
      this.removeLcmd();
    }
    this.userService.getUserLoggin();
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

  get filteredProduct() {
    return this.produitService.listProduits.filter(produit =>
      produit.designation.toLowerCase().includes(this.searchSelectProd.toLowerCase())
    );
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
      typeFrais: '0',
      ligneAchat: [],
    });
  }

  dafaForm() {
    this.fAchat['date_achat'].setValue(this.date_achat);
    this.fAchat['heure_achat'].setValue(this.heure_achat);
    this.fAchat['nom_fn'].setValue(this.nom_fn);
    this.fAchat['auteur'].setValue(this.userService.name);
    this.fAchat['totht'].setValue(this.totht);
    this.fAchat['reduction'].setValue(this.reduction);
    this.fAchat['net'].setValue(this.net);
    this.fAchat['tottva'].setValue(this.tottva);
    this.fAchat['totttc'].setValue(this.totttc);
    this.fAchat['restant'].setValue(this.net);
    this.fAchat['versement'].setValue(this.versement);
    this.fAchat['numCheck'].setValue(this.numCheck);
    this.fAchat['totalFrais'].setValue(this.totalFrais);
    this.fAchat['typeFrais'].setValue(this.typeFrais);
    this.fAchat['ligneAchat'].setValue(this.ligneAchatService.listLigneAchat);
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

  getProduitsByCode(code: any) {
    this.produitService.getProduitsByCodeFn(code).subscribe(
      (data: any[]) => {
        this.produitService.listProduits = data;
      });
  }

  getMaxId() {
    this.year = this.getYear(new Date(Date.now()));
    this.month = this.getMonth(new Date(Date.now()));
    this.achatService.getMaxId().subscribe(
      (data: { maxId: string; }) => {
        this.achatService.maxId = this.year + 'A' + this.month + data.maxId;
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
      // filtre le client néant
      let listFournisseurs: any = this.fournisseurs.filter((fournisseur: any) => fournisseur.name == 'Néant');
      // Sélectionne le premier client par défaut
      if (listFournisseurs.length > 0) {
        this.selectedFournisseur = listFournisseurs[0];
        this.selectFournisseur(this.selectedFournisseur);
      }
    });
  }

  onchange(produit: any) {
    // push vers Ligne Commande choix
    if (produit.isselected == true) {
      this.ligneAchat.code = produit.code;
      this.ligneAchat.designation = produit.designation;
      this.ligneAchat.qty = 0.5;
      this.ligneAchat.prix_achat = produit.prix_achat;
      this.ligneAchat.frais = 0;
      this.ligneAchat.totht = this.ligneAchat.qty * this.ligneAchat.prix_achat;
      this.ligneAchat.auteur = this.userService.name;
      this.ligneAchatService.listLigneAchat.push(this.ligneAchat);
      localStorage.removeItem('listLigneAchats');
      localStorage.setItem('listLigneAchats', JSON.stringify(this.ligneAchatService.listLigneAchat));
      this.nbrProduit = this.ligneAchatService.listLigneAchat.length;
      this.ligneAchat = new LigneAchat();
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
    if (this.ligneAchatService.listLigneAchat.length > 0) {
      for (var i = 0; i < this.ligneAchatService.listLigneAchat.length; i++) {
        if (this.ligneAchatService.listLigneAchat[i].totht) {
          total += this.ligneAchatService.listLigneAchat[i].totht;
          this.totht = total;
        }
        this.getTtc();
      }
      localStorage.removeItem('listLigneAchats');
      localStorage.setItem('listLigneAchats', JSON.stringify(this.ligneAchatService.listLigneAchat));
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
    for (let i = 0; i < this.ligneAchatService.listLigneAchat.length; ++i) {
      this.nbrProduit = i;
      if (this.ligneAchatService.listLigneAchat[i].code == code) {
        this.ligneAchatService.listLigneAchat.splice(i, 1);
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
    localStorage.removeItem("listLigneAchats");
    this.ligneAchatService.listLigneAchat = [];
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

  getDate(date: any) {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  getHeure(date: any) {
    return this.datePipe.transform(date, 'HH:mm:ss');
  }

  dateNow(dateNow: any) {
    return this.datePipe.transform(dateNow, 'dd-MM-yyyy HH:mm:ss');
  }

  onSubmitAchat() {
    this.isDisable = true;
    this.isClick = true;
    this.fAchat['heure_achat'].setValue(this.getHeure(new Date(Date.now())));
    this.dafaForm();
    this.achatService.create(this.formAchat.value).subscribe(
      (data: any) => {
        let resp: any = data;
        this.toastrService.success('Achat numero ' + resp.achat.numero + ' crée !');
        this.achatService.detail(resp.achat);
      });
  }

  onSubmitBonAchat() {
    this.isDisable = true;
    this.isClick = true;
    this.fAchat['heure_achat'].setValue(this.getHeure(new Date(Date.now())));
    this.dafaForm();
    this.bonAchatService.create(this.formAchat.value).subscribe(
      (data: any) => {
        let resp: any = data;
        this.toastrService.success('Bon Achat numero ' + resp.bonAchat.numero + ' crée !');
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

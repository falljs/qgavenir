import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Produit } from 'src/app/models/produit';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
declare var $: any;

@Component({
  selector: 'app-mouvement-new',
  templateUrl: './mouvement-new.component.html',
  styleUrls: ['./mouvement-new.component.scss']
})
export class MouvementNewComponent implements OnInit {

  ligneProduit!: any;
  nbrProduit!: number;

  date!: any;
  heure: any;

  // Var Form Achat
  year!: any;
  month!: any;

  date_mouvement!: any;
  heure_achat!: any;

  responsable!: any;

  name_depot = null;

  // Produit
  produits: any = [];
  listLigneMouvement: any = [];

  designation: any;

  editeLigne!: boolean;
  isDisable: boolean = false;
  isClick: boolean = false;
  isLoading: boolean = false;

  typeMouvement: string = 'depot';

  constructor(public produitService: ProduitService, public router: Router,
    public userService: UserService, public toastrService: ToastrService,
    private datePipe: DatePipe, public localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.ligneProduit = new Produit();
    this.listLigneMouvement = [];
    this.getMaxId();
    this.getEntrepot_uns();
    this.date_mouvement = this.getDate(new Date(Date.now()));
    this.heure_achat = this.getHeure(new Date(Date.now()));
    if (localStorage.getItem('ligneMouvement') != null) {
      this.listLigneMouvement = JSON.parse(localStorage.getItem('ligneMouvement')!);
    }
  }

  //Get All product
  getEntrepot_uns() {
    this.produitService.getEntrepot_uns().subscribe(res => {
      this.isLoading = false;
      this.produits = res;
    });
  }

  //Get All product
  getProduits() {
    this.produitService.getAllProduct().subscribe(res => {
      this.isLoading = false;
      this.produits = res;
    });
  }


  getMaxId() {
    this.year = this.getYear(new Date(Date.now()));
    this.month = this.getMonth(new Date(Date.now()));
    this.produitService.getMaxId().subscribe(
      (data: { maxId: string; }) => {
        this.produitService.maxId = this.year + 'M' + this.month + data.maxId;
      });
  }

  getYear(date: any) {
    return this.datePipe.transform(date, 'yy');
  }

  getMonth(date: any) {
    return this.datePipe.transform(date, 'MM');
  }

  createMouvement() {
    this.isDisable = true;
    this.isClick = true;
    var data: any = {
      auteur: this.userService.name,
      responsable: this.responsable,
      ligneMouvement: this.listLigneMouvement
    };
    if (this.typeMouvement == 'depot') {
      this.produitService.onCreate_mouvement_depot(data).subscribe(
        data => {
          let response: any = data;
          this.toastrService.success('Les produits sont mouvementés entre le dépôt et le magasin avec succès !');
          localStorage.removeItem('ligneMouvement');
          localStorage.setItem('mouvement', JSON.stringify(response.mouvement));
          localStorage.setItem('ligneMouvementDetail', JSON.stringify(response.ligne_mouvement));
          this.router.navigate(['/mouvement-detail']);
        });
    } else {
      this.produitService.onCreate_mouvement_stock(data).subscribe(
        data => {
          let response: any = data;
          this.toastrService.success('Les produits sont mouvementés entre le dépôt et le magasin avec succès !');
          localStorage.removeItem('ligneMouvement');
          localStorage.setItem('mouvement', JSON.stringify(response.mouvement));
          localStorage.setItem('ligneMouvementDetail', JSON.stringify(response.ligne_mouvement));
          this.router.navigate(['/mouvement-detail']);
        });
    }
  }


  onchangeDepot(produit: any) {

    if (produit.isselected == true) {
      this.ligneProduit.matricule = produit.matricule;
      this.ligneProduit.id = produit.id;
      this.ligneProduit.code = produit.code;
      this.ligneProduit.produit = produit.designation;
      this.ligneProduit.stock = produit.stock;
      this.ligneProduit.qty = 0.5;
      this.ligneProduit.ref = produit.ref;
      this.ligneProduit.entrepot = produit.entrepot;
      this.ligneProduit.auteur = this.userService.name;
      this.listLigneMouvement.push(this.ligneProduit);
      localStorage.removeItem('ligneMouvement');
      localStorage.setItem('ligneMouvement', JSON.stringify(this.listLigneMouvement));
      this.ligneProduit = new Produit();
    } else {
      this.deleteLigne(produit.matricule);
    }

  }

  onchangeStock(produit: any) {

    if (produit.isselected == true) {
      this.ligneProduit.matricule = produit.code;
      this.ligneProduit.id = produit.id;
      this.ligneProduit.code = produit.code;
      this.ligneProduit.produit = produit.designation;
      this.ligneProduit.stock = produit.qty;
      this.ligneProduit.qty = 0.5;
      this.ligneProduit.ref = produit.ref;
      this.ligneProduit.entrepot = 'Stock';
      this.ligneProduit.auteur = this.userService.name;
      this.listLigneMouvement.push(this.ligneProduit);
      localStorage.removeItem('ligneMouvement');
      localStorage.setItem('ligneMouvement', JSON.stringify(this.listLigneMouvement));
      this.ligneProduit = new Produit();
    } else {
      this.deleteLigne(produit.matricule);
    }

  }

  onChangeType(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.typeMouvement = selectedValue;
    if (this.typeMouvement == 'depot') {
      this.isLoading = true;
      this.getEntrepot_uns();
    } else {
      this.isLoading = true;
      this.getProduits();
    }
  }


  // Delete Ligne Commande
  deleteLigne(matricule: any) {
    for (let i = 0; i < this.listLigneMouvement.length; ++i) {
      this.nbrProduit = i;
      if (this.listLigneMouvement[i].matricule == matricule) {
        this.listLigneMouvement.splice(i, 1);
      }
    }

    if (this.typeMouvement == 'depot') {
      for (var i = 0; i < this.produits.length; i++) {
        if (this.produits[i].matricule == matricule) {
          this.produits[i].isselected = false;
        }
      }
    } else {
      for (var i = 0; i < this.produits.length; i++) {
        if (this.produits[i].code == matricule) {
          this.produits[i].isselected = false;
        }
      }
    }
  }

  // Remove les lignes
  deletLignes() {
    localStorage.removeItem("ligneMouvement");
    this.listLigneMouvement = [];
    for (var i = 0; i < this.produits.length; i++) {
      this.produits[i].isselected = false;
    }
  }

  // Edit Line
  editDomain(produit: any) {
    this.editeLigne = true
    produit.editable = !produit.editable;
  }

  // Edit Line Valid
  valide(produit: any) {
    this.editeLigne = false;
    produit.editable = !produit.editable;
    if (produit.qty > produit.stock) {
      this.toastrService.error('Vous ne pouvez pas dépasser la quantité en stock ' + produit.stock);
      produit.qty = produit.stock;
    } else if (produit.qty < 0.5) {
      this.toastrService.error('La quantité doit être au moins 0.5');
      produit.qty = 0.5;
    }
  }

  cancel(produit: any) {
    this.editeLigne = false;
    produit.editable = !produit.editable;
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

}

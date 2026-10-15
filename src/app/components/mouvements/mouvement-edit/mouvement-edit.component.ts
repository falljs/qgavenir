import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Produit } from 'src/app/models/produit';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-mouvement-edit',
  templateUrl: './mouvement-edit.component.html',
  styleUrls: ['./mouvement-edit.component.scss']
})
export class MouvementEditComponent implements OnInit {

  ligneProduit!: any;
  nbrProduit!: number;

  date!: any;
  heure: any;

  // Var Form Achat
  year!: any;
  month!: any;

  date_mouvement!: any;
  heure_achat!: any;
  name_depot = null;

  // Produit
  produits: any = [];
  listProduits: any = [];

  responsable!: any;

  designation: any;
  mouvement: any;
  editeLigne!: boolean;
  isDisable: boolean = false;
  isClick: boolean = false;


  constructor(public produitService: ProduitService, public router: Router, private route: ActivatedRoute,
    public userService: UserService, public toastrService: ToastrService,
    private datePipe: DatePipe,) { }

  ngOnInit(): void {

    this.ligneProduit = new Produit();
    this.date_mouvement = this.getDate(new Date(Date.now()));
    this.heure_achat = this.getHeure(new Date(Date.now()));
    this.getMouvementEdit();
  }

  getMouvementEdit() {
    if (localStorage.getItem('mouvement') != null) {
      this.mouvement = JSON.parse(localStorage.getItem('mouvement')!);
      this.produitService.listLigneMouvement = JSON.parse(localStorage.getItem('ligneMouvement')!);
      this.responsable = this.mouvement.responsable;
      console.log(this.mouvement.type);
      if (this.mouvement.type == 'Stock => Depôt') {
        this.getProduits();
      } else {
        this.getEntrepot_uns();
      }
    }
  }

  //Get All product
  getEntrepot_uns() {
    this.produitService.getEntrepot_uns().subscribe(res => {
      this.produits = res;
    });
  }

  //Get All product
  getProduits() {
    this.produitService.getAllProduct().subscribe(res => {
      this.produits = res;
    });
  }

  getYear(date: any) {
    return this.datePipe.transform(date, 'yy');
  }

  getMonth(date: any) {
    return this.datePipe.transform(date, 'MM');
  }



  updateMouvement() {
    this.isDisable = true;
    this.isClick = true;
    var data: any = {
      numero: this.mouvement.numero,
      auteur: this.userService.name,
      responsable: this.responsable,
      ligneMouvement: this.produitService.listLigneMouvement
    };
    if (this.mouvement.type == 'Stock <= Depôt') {
      this.produitService.onUdapte_mouvement_depot(data).subscribe(
        data => {
          let response: any = data;
          this.toastrService.success('Les prodouits sont mouvementer entre les depôt et le magagin avec success !');
          localStorage.removeItem('mouvement');
          localStorage.removeItem('ligneMouvement');
          localStorage.removeItem('ligneMouvementDetail');
          localStorage.setItem('mouvement', JSON.stringify(response.mouvement));
          localStorage.setItem('ligneMouvementDetail', JSON.stringify(response.ligne_mouvement));
          this.router.navigate(['/mouvement-detail']);
        });
    } else {
      this.produitService.onUdapte_mouvement_stock(data).subscribe(
        data => {
          let response: any = data;
          this.toastrService.success('Les prodouits sont mouvementer entre les depôt et le magagin avec success !');
          localStorage.removeItem('mouvement');
          localStorage.removeItem('ligneMouvement');
          localStorage.removeItem('ligneMouvementDetail');
          localStorage.setItem('mouvement', JSON.stringify(response.mouvement));
          localStorage.setItem('ligneMouvementDetail', JSON.stringify(response.ligne_mouvement));
          this.router.navigate(['/mouvement-detail']);
        });
    }
  }


  onchangeDepot(produit: any) {

    if (produit.isselected == true) {
      this.ligneProduit.matricule = produit.matricule;
      this.ligneProduit.id = 0;
      this.ligneProduit.code = produit.code;
      this.ligneProduit.produit = produit.designation;
      this.ligneProduit.stock = produit.stock;
      this.ligneProduit.qty = 0.5;
      this.ligneProduit.ref = produit.ref;
      this.ligneProduit.entrepot = produit.entrepot;
      this.ligneProduit.auteur = this.userService.name;
      this.produitService.listLigneMouvement.push(this.ligneProduit);
      localStorage.removeItem('ligneMouvement');
      localStorage.setItem('ligneMouvement', JSON.stringify(this.produitService.listLigneMouvement));
      this.ligneProduit = new Produit();
    } else {

      this.deleteLigne(produit.matricule);
    }

  }

  onchangeStock(produit: any) {

    if (produit.isselected == true) {
      this.ligneProduit.matricule = produit.code;
      this.ligneProduit.id = 0;
      this.ligneProduit.code = produit.code;
      this.ligneProduit.produit = produit.designation;
      this.ligneProduit.stock = produit.qty;
      this.ligneProduit.qty = 0.5;
      this.ligneProduit.ref = produit.ref;
      this.ligneProduit.entrepot = 'Stock';
      this.ligneProduit.auteur = this.userService.name;
      this.produitService.listLigneMouvement.push(this.ligneProduit);
      localStorage.removeItem('ligneMouvement');
      localStorage.setItem('ligneMouvement', JSON.stringify(this.produitService.listLigneMouvement));
      this.ligneProduit = new Produit();
    } else {

      this.deleteLigne(produit.matricule);
    }

  }

  // Delete Ligne Commande
  deleteLigne(matricule: any) {
    for (let i = 0; i < this.produitService.listLigneMouvement.length; ++i) {
      this.nbrProduit = i;
      if (this.produitService.listLigneMouvement[i].matricule == matricule) {
        this.produitService.listLigneMouvement.splice(i, 1);
      }
    }

    if (this.mouvement.type == 'Stock => Depôt') {
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
  removeLignes() {
    localStorage.removeItem("ligneMouvement");
    this.produitService.listLigneMouvement = [];
  }

  // Edit Line
  editDomain(produit: any) {
    this.editeLigne = true;
    produit.editable = !produit.editable;
  }

  // Edit Line Valid
  valide(produit: any) {
    this.editeLigne = false;
    produit.editable = !produit.editable;

    if (this.mouvement.type == 'Stock => Depôt') {
      if (produit.id != 0) {
        this.produitService.getLigneMouvement(produit.id).subscribe(
          data => {
            let resp: any = data;
            let product: any = resp.produit_stock;
            let ligne_mouvement: any = resp.ligne_mouvement;
            let qtySum = (parseInt(product.qty) || 0) + ligne_mouvement.qty;
            if (produit.qty < qtySum) {
              produit.qty = produit.qty;
            } else {
              produit.qty = qtySum;
              this.toastrService.error('La quantité restant sur ce produit est de ' + product.qty);
            }
          });
      } else {
        if (produit.qty > produit.stock) {
          this.toastrService.error('Vous ne pouvez pas dépasser la quantité en stock ' + produit.stock);
          produit.qty = produit.stock;
        } else if (produit.qty < 0.5) {
          this.toastrService.error('La quantité doit être au moins 0.5');
          produit.qty = 0.5;
        }
      }
    } else {
      if (produit.id != 0) {
        this.produitService.getLigneMouvement(produit.id).subscribe(
          data => {
            let resp: any = data;
            let product: any = resp.produit_depot;
            let ligne_mouvement: any = resp.ligne_mouvement;
            let qtySum = (parseInt(product.stock) || 0) + ligne_mouvement.qty;
            if (produit.qty < qtySum) {
              produit.qty = produit.qty;
            } else {
              produit.qty = qtySum;
              this.toastrService.error('La quantité restant sur ce produit est de ' + product.stock);
            }
          });
      } else {
        if (produit.qty > produit.stock) {
          this.toastrService.error('Vous ne pouvez pas dépasser la quantité en stock ' + produit.stock);
          produit.qty = produit.stock;
        } else if (produit.qty < 0.5) {
          this.toastrService.error('La quantité doit être au moins 0.5');
          produit.qty = 0.5;
        }
      }
    }
  }

  cancel(produit: any) {
    this.editeLigne = false;
    produit.editable = !produit.editable;
  }

  detail(id: any) {
    this.produitService.getMouvement(id).subscribe((data: any) => {
      let response: any = data;
      this.produitService.mouvemen = response.mouvement;
      localStorage.removeItem('mouvement');
      localStorage.setItem('mouvement', JSON.stringify(response.mouvement));
      localStorage.setItem('ligneMouvementDetail', JSON.stringify(response.ligne_mouvement));
      this.router.navigate(['/mouvement-detail']);
    });
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

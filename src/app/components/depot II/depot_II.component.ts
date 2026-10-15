import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Produit } from 'src/app/models/produit';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ParametreService } from 'src/app/services/parametre.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
declare var $: any;

@Component({
  selector: 'app-depot_II',
  templateUrl: './depot_II.component.html',
  styleUrls: ['./depot_II.component.scss']
})
export class Depot_II_Component implements OnInit {

  page: number = 1;
  nbrProduit: number = 0;
  defaultItem: number = 12;
  produits!: Produit[];
  categories!: [];
  fournisseurs!: any[];

  form!: FormGroup;
  formUp!: FormGroup;
  id_Produit!: any;
  nbrPage: number = 0;
  totalQty: number = 0;
  totalPrix: number = 0;
  totalPrixGlobal: number = 0;
  totalPrixVente: number = 0;

  printQty: boolean = false;
  printCat: boolean = false;

  cat!: any;
  qty!: any;

  isChecked: boolean = false; // Initialisation de la propriété isChecked à false

  constructor(private produitService: ProduitService, public userService: UserService,
    public fb: FormBuilder, public toastrService: ToastrService, public fournisseurService: FournisseurService,
    public parametreService: ParametreService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.printCat = true;
    this.printQty = false;
    this.getProducts();
    this.initForm();
    this.initFormUp();
    this.getSetting();
    this.getAllCategories()
    this.getFournisseurs()
  }

  //Get All product fournisseurs!:any[];
  getFournisseurs() {
    this.fournisseurService.getAll().subscribe((res: any[]) => {
      this.fournisseurs = res;
    });
  }

  onCheckboxChange() {
    this.isChecked = true;
  }

  unCheckboxChange() {
    this.isChecked = false;
  }


  //Get All product
  getProducts() {
    this.cat = '';
    this.qty = '';
    this.produitService.getAllProduct().subscribe(res => {
      this.produits = res;
      this.nbrProduit = this.produits.length;
      this.nbrPage = Math.ceil(this.nbrProduit / this.defaultItem);
      let totalQty = 0; let totalPrix = 0; let totalPrixGlobal = 0; let totalPrixVente = 0;
      this.totalQty = 0; this.totalPrix = 0; this.totalPrixGlobal = 0; this.totalPrixVente = 0;
      for (var i = 0; i < this.produits.length; i++) {

        if (this.produits[i].qty) {
          totalQty += this.produits[i].qty;
          this.totalQty = totalQty;
        } else {
          totalQty += this.produits[i].qty;
          this.totalQty = totalQty;
        }

        if (this.produits[i].prix) {
          totalPrix += this.produits[i].prix_achat;
          totalPrixVente += this.produits[i].prix;
          this.totalPrix = totalPrix;
          this.totalPrixVente = totalPrixVente;
          totalPrixGlobal += this.produits[i].prix * this.produits[i].qty;
          this.totalPrixGlobal = totalPrixGlobal;

        } else {
          totalPrix += this.produits[i].prix_achat;
          totalPrixVente += this.produits[i].prix;
          this.totalPrix = totalPrix;
          this.totalPrixVente = totalPrixVente;
          totalPrixGlobal += this.produits[i].prix * this.produits[i].qty;
          this.totalPrixGlobal = totalPrixGlobal;
        }
      }
    });
  }

  getAllCategories() {
    this.produitService.getAllCategories().subscribe(res => {
      this.categories = res;
    });
  }

  search() {
    this.page = 1;
    let search: any = $("#inputDesignation").val();
    if (search) {
      this.produitService.searchProduit(search).subscribe(
        res => {
          let data: any = res;
          this.produits = data;
          this.nbrProduit = this.produits.length;
        });
    } else {
      this.getProducts();
    }
  }

  OnChangeCategory(ctrl: any) {
    if (ctrl.value) {
      this.printCat = true;
      this.printQty = false;
      this.cat = ctrl.value;
      this.produitService.getProductByCategory(ctrl.value).subscribe(res => {
        let data: any = res;
        this.produits = data;
        this.nbrProduit = this.produits.length;
        this.nbrPage = Math.ceil(this.nbrProduit / this.defaultItem);
        let totalQty = 0; let totalPrix = 0; let totalPrixGlobal = 0; let totalPrixVente = 0;
        this.totalQty = 0; this.totalPrix = 0; this.totalPrixGlobal = 0; this.totalPrixVente = 0;
        for (var i = 0; i < this.produits.length; i++) {

          if (this.produits[i].qty) {
            totalQty += this.produits[i].qty;
            this.totalQty = totalQty;
          } else {
            totalQty += this.produits[i].qty;
            this.totalQty = totalQty;
          }

          if (this.produits[i].prix) {
            totalPrix += this.produits[i].prix_achat;
            totalPrixVente += this.produits[i].prix;
            this.totalPrix = totalPrix;
            this.totalPrixVente = totalPrixVente;
            totalPrixGlobal += this.produits[i].prix * this.produits[i].qty;
            this.totalPrixGlobal = totalPrixGlobal;

          } else {
            totalPrix += this.produits[i].prix_achat;
            totalPrixVente += this.produits[i].prix;
            this.totalPrix = totalPrix;
            this.totalPrixVente = totalPrixVente;
            totalPrixGlobal += this.produits[i].prix * this.produits[i].qty;
            this.totalPrixGlobal = totalPrixGlobal;
          }
        }
      });
    } else {
      this.printCat = true;
      this.printQty = false;
      this.cat = '';
      this.qty = '';
      this.getProducts();
    }
  }

  OnChangeQty(ctrl: any) {
    if (ctrl.value) {
      this.printQty = true;
      this.printCat = false;
      this.qty = ctrl.value;
      if (this.qty == 'qtyOn') {
        this.produitService.getProductByQtyOn().subscribe(res => {
          let data: any = res;
          this.produits = data;
          this.nbrProduit = this.produits.length;
          this.nbrPage = Math.ceil(this.nbrProduit / this.defaultItem);
          let totalQty = 0; let totalPrix = 0; let totalPrixGlobal = 0; let totalPrixVente = 0;
          this.totalQty = 0; this.totalPrix = 0; this.totalPrixGlobal = 0; this.totalPrixVente = 0;
          for (var i = 0; i < this.produits.length; i++) {

            if (this.produits[i].qty) {
              totalQty += this.produits[i].qty;
              this.totalQty = totalQty;
            } else {
              totalQty += this.produits[i].qty;
              this.totalQty = totalQty;
            }

            if (this.produits[i].prix) {
              totalPrix += this.produits[i].prix_achat;
              totalPrixVente += this.produits[i].prix;
              this.totalPrix = totalPrix;
              this.totalPrixVente = totalPrixVente;
              totalPrixGlobal += this.produits[i].prix * this.produits[i].qty;
              this.totalPrixGlobal = totalPrixGlobal;

            } else {
              totalPrix += this.produits[i].prix_achat;
              totalPrixVente += this.produits[i].prix;
              this.totalPrix = totalPrix;
              this.totalPrixVente = totalPrixVente;
              totalPrixGlobal += this.produits[i].prix * this.produits[i].qty;
              this.totalPrixGlobal = totalPrixGlobal;
            }
          }
        });
      } else {
        this.produitService.getProductByQtyOff().subscribe(res => {
          let data: any = res;
          this.produits = data;
          this.nbrProduit = this.produits.length;
          this.nbrPage = Math.ceil(this.nbrProduit / this.defaultItem);
          let totalQty = 0; let totalPrix = 0; let totalPrixGlobal = 0; let totalPrixVente = 0;
          this.totalQty = 0; this.totalPrix = 0; this.totalPrixGlobal = 0; this.totalPrixVente = 0;
          for (var i = 0; i < this.produits.length; i++) {

            if (this.produits[i].qty) {
              totalQty += this.produits[i].qty;
              this.totalQty = totalQty;
            } else {
              totalQty += this.produits[i].qty;
              this.totalQty = totalQty;
            }

            if (this.produits[i].prix) {
              totalPrix += this.produits[i].prix_achat;
              totalPrixVente += this.produits[i].prix;
              this.totalPrix = totalPrix;
              this.totalPrixVente = totalPrixVente;
              totalPrixGlobal += this.produits[i].prix * this.produits[i].qty;
              this.totalPrixGlobal = totalPrixGlobal;

            } else {
              totalPrix += this.produits[i].prix_achat;
              totalPrixVente += this.produits[i].prix;
              this.totalPrix = totalPrix;
              this.totalPrixVente = totalPrixVente;
              totalPrixGlobal += this.produits[i].prix * this.produits[i].qty;
              this.totalPrixGlobal = totalPrixGlobal;
            }
          }
        });
      }

    } else {
      this.printCat = true;
      this.printQty = false;
      this.qty = '';
      this.cat = '';
      this.getProducts();
    }
  }

  getSetting() {
    this.parametreService.getSetting().subscribe((data) => {
      localStorage.setItem('setting', JSON.stringify(data));
    });
  }

  // Selected Famille
  fournisseurSelected(ctrl: any) {
    if (ctrl.selectedIndex == 0) {
      this.f['code'].setValue('Fn_0');
    }
    else {
      this.f['code'].setValue(this.fournisseurs[ctrl.selectedIndex - 1].code);
    }
  }

  //Created product
  onSubmit() {
    //console.log(this.form.value)
    if (this.form.value.qtyAlert > this.form.value.qty) {
      this.toastrService.error('La quantité alert doit être inférieure à la quantité en stock !');
    } else {
      this.produitService.createProduit(this.form.value).subscribe(
        response => {
          let produit: any = response;
          this.getProducts();
          this.form.reset();
          this.initForm();
          this.toastrService.success('Produit ' + produit.designation + ' Ajouté !');
        });
    }
  }

  //init form created data
  initForm() {
    this.form = new FormGroup({
      designation: new FormControl('', [Validators.required]),
      qty: new FormControl(0, [Validators.required]),
      entrepot_1: new FormControl(0,),
      entrepot_2: new FormControl(0,),
      qtyAlert: new FormControl(0, [Validators.required]),
      prix: new FormControl(0),
      prix_achat: new FormControl(0),
      ref: new FormControl(''),
      code_fn: new FormControl('Fn_0'),
      famille: new FormControl(''),
      marque: new FormControl(''),
      description: new FormControl(''),
      auteur: new FormControl(this.userService.name)
    });
  }

  //init form updated data
  initFormUp() {
    this.formUp = new FormGroup({
      code: new FormControl('',),
      code_fn: new FormControl('Fn_0'),
      designation: new FormControl('', [Validators.required]),
      qty: new FormControl(0, [Validators.required]),
      qtyAlert: new FormControl(0),
      prix: new FormControl(0),
      prix_achat: new FormControl(0),
      ref: new FormControl(''),
      famille: new FormControl(''),
      marque: new FormControl(''),
      description: new FormControl(''),
      auteur: new FormControl(this.userService.name)
    });
  }

  get f() {
    return this.form.controls;
  }
  get fUp() {
    return this.form.controls;
  }

  //Update
  update(p: any) {
    this.formUp = new FormGroup({
      id: new FormControl(p.id),
      code: new FormControl(p.code),
      code_fn: new FormControl(p.code_fn),
      designation: new FormControl(p.designation, [Validators.required]),
      qty: new FormControl(p.qty, [Validators.required]),
      qtyAlert: new FormControl(p.qtyAlert, [Validators.required]),
      prix: new FormControl(p.prix),
      prix_achat: new FormControl(p.prix_achat),
      ref: new FormControl(p.ref),
      famille: new FormControl(p.famille),
      marque: new FormControl(p.marque),
      description: new FormControl(p.description),
      auteur: new FormControl(this.userService.name)
    });
  }

  onUpdate() {
    if (this.formUp.value.qtyAlert > this.formUp.value.qty) {
      this.toastrService.error('La quantité alert doit être inférieure à la quantité en stock !');
    } else {
      this.produitService.updateProduit(this.formUp.value).subscribe(res => {
        this.getProducts();
        this.form.reset();
        $('#modal-product-update').modal('toggle');
        this.toastrService.success('Produit modifié !');
      });
    }
  }

  modalDeleteProduit(id: number) {
    this.id_Produit = id;
  }

  deleteProduit() {
    this.produitService.delete(this.id_Produit).subscribe((data) => {
      this.getProducts();
      this.toastrService.warning('Produit supprimé !');
    });
  }

  printCategorie() {
    this.produitService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.wakeursmds.com/server/public/print/produits/categorie/' + this.cat, "_blank");
    });
  }

  printQtyOn() {
    this.produitService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.wakeursmds.com/server/public/print/produits/qtyOn', "_blank");
    });
  }

  printQtyOff() {
    this.produitService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.wakeursmds.com/server/public/print/produits/qtyOff', "_blank");
    });
  }

  printProduit(commande: any) {
    this.produitService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.wakeursmds.com/server/public/print/produits/', "_blank");
    });
  }

}

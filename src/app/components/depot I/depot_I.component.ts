import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ParametreService } from 'src/app/services/parametre.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
declare var $: any;

@Component({
  selector: 'app-depot_I',
  templateUrl: './depot_I.component.html',
  styleUrls: ['./depot_I.component.scss']
})
export class Depot_I_Component implements OnInit {

  page: number = 1;
  nbrProduit: number = 0;
  defaultItem: number = 20;
  produits!: any[];
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

  editeLigne!: boolean;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(private produitService: ProduitService, public userService: UserService,
    public fb: FormBuilder, public toastrService: ToastrService, public fournisseurService: FournisseurService,
    public parametreService: ParametreService, private datePipe: DatePipe,
    public router: Router, public localStorageService: LocalStorageService) { }

  ngOnInit(): void {
    this.printCat = true;
    this.printQty = false;
    this.getEntrepot_uns();
    this.initForm();
    this.initFormUp();
    this.getSetting();
    this.getAllCategories();
    this.getFournisseurs();
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

  cancelEdit(produit: any) {

    // Restaurer l'ancien stock
    produit.stock = produit.stockOriginal;

    // Désactiver la modification
    produit.editable = false;

    this.editeLigne = false;
  }

  // Edit Line
  editDomain(produit: any) {

    // Sauvegarder l'ancienne valeur au cas où on annule
    produit.stockOriginal = produit.stock;

    // Activer la modification
    produit.editable = true;

    this.editeLigne = true;
  }

  updateStock(produit: any) {

    if (produit.stock === null || produit.stock === undefined || produit.stock < 0) {
      this.toastrService.error('Le stock doit être supérieur ou égal à 0.');
      return;
    }

    const data = {
      id: produit.id,
      stock: Number(produit.stock)
    };

    this.produitService.update_produitsEntrepot(data).subscribe({
      next: () => {

        produit.editable = false;
        this.editeLigne = false;

        this.toastrService.success(
          'Stock de ' + produit.designation + ' mis à jour !'
        );

        this.getEntrepot_uns();
      },

      error: () => {
        this.toastrService.error(
          'Impossible de mettre à jour le stock.'
        );
      }
    });
  }

  //Get All product
  getEntrepot_uns() {
    this.cat = '';
    this.qty = '';
    this.produitService.getEntrepot_uns().subscribe(res => {
      this.produits = res;
      this.nbrProduit = this.produits.length;
      this.nbrPage = Math.ceil(this.nbrProduit / this.defaultItem);
      let totalQty = 0; let totalPrix = 0; let totalPrixGlobal = 0; let totalPrixVente = 0;
      this.totalQty = 0; this.totalPrix = 0; this.totalPrixGlobal = 0; this.totalPrixVente = 0;
      for (var i = 0; i < this.produits.length; i++) {

        if (this.produits[i].stock) {
          totalQty += this.produits[i].stock;
          this.totalQty = totalQty;
        } else {
          totalQty += this.produits[i].stock;
          this.totalQty = totalQty;
        }

        if (this.produits[i].prix) {
          totalPrix += this.produits[i].prix_achat;
          totalPrixVente += this.produits[i].prix;
          this.totalPrix = totalPrix;
          this.totalPrixVente = totalPrixVente;
          totalPrixGlobal += this.produits[i].prix_achat * this.produits[i].stock;
          this.totalPrixGlobal = totalPrixGlobal;

        } else {
          totalPrix += this.produits[i].prix_achat;
          totalPrixVente += this.produits[i].prix;
          this.totalPrix = totalPrix;
          this.totalPrixVente = totalPrixVente;
          totalPrixGlobal += this.produits[i].prix_achat * this.produits[i].stock;
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
      this.produitService.searchEntrepot(search).subscribe(
        res => {
          let data: any = res;
          this.produits = data;
          this.nbrProduit = this.produits.length;
        });
    } else {
      this.getEntrepot_uns();
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

          if (this.produits[i].stock) {
            totalQty += this.produits[i].stock;
            this.totalQty = totalQty;
          } else {
            totalQty += this.produits[i].stock;
            this.totalQty = totalQty;
          }

          if (this.produits[i].prix) {
            totalPrix += this.produits[i].prix_achat;
            totalPrixVente += this.produits[i].prix;
            this.totalPrix = totalPrix;
            this.totalPrixVente = totalPrixVente;
            totalPrixGlobal += this.produits[i].prix_achat * this.produits[i].stock;
            this.totalPrixGlobal = totalPrixGlobal;

          } else {
            totalPrix += this.produits[i].prix_achat;
            totalPrixVente += this.produits[i].prix;
            this.totalPrix = totalPrix;
            this.totalPrixVente = totalPrixVente;
            totalPrixGlobal += this.produits[i].prix_achat * this.produits[i].stock;
            this.totalPrixGlobal = totalPrixGlobal;
          }
        }
      });
    } else {
      this.printCat = true;
      this.printQty = false;
      this.cat = '';
      this.qty = '';
      this.getEntrepot_uns();
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

            if (this.produits[i].stock) {
              totalQty += this.produits[i].stock;
              this.totalQty = totalQty;
            } else {
              totalQty += this.produits[i].stock;
              this.totalQty = totalQty;
            }

            if (this.produits[i].prix) {
              totalPrix += this.produits[i].prix_achat;
              totalPrixVente += this.produits[i].prix;
              this.totalPrix = totalPrix;
              this.totalPrixVente = totalPrixVente;
              totalPrixGlobal += this.produits[i].prix_achat * this.produits[i].stock;
              this.totalPrixGlobal = totalPrixGlobal;

            } else {
              totalPrix += this.produits[i].prix_achat;
              totalPrixVente += this.produits[i].prix;
              this.totalPrix = totalPrix;
              this.totalPrixVente = totalPrixVente;
              totalPrixGlobal += this.produits[i].prix_achat * this.produits[i].stock;
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

            if (this.produits[i].stock) {
              totalQty += this.produits[i].stock;
              this.totalQty = totalQty;
            } else {
              totalQty += this.produits[i].stock;
              this.totalQty = totalQty;
            }

            if (this.produits[i].prix) {
              totalPrix += this.produits[i].prix_achat;
              totalPrixVente += this.produits[i].prix;
              this.totalPrix = totalPrix;
              this.totalPrixVente = totalPrixVente;
              totalPrixGlobal += this.produits[i].prix_achat * this.produits[i].stock;
              this.totalPrixGlobal = totalPrixGlobal;

            } else {
              totalPrix += this.produits[i].prix_achat;
              totalPrixVente += this.produits[i].prix;
              this.totalPrix = totalPrix;
              this.totalPrixVente = totalPrixVente;
              totalPrixGlobal += this.produits[i].prix_achat * this.produits[i].stock;
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
      this.getEntrepot_uns();
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
    if (this.form.value.stockAlert > this.form.value.stock) {
      this.toastrService.error('La quantité alert doit être inférieure à la quantité en stock !');
    } else {
      this.produitService.createProduit(this.form.value).subscribe(
        response => {
          let produit: any = response;
          this.getEntrepot_uns();
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
      qty: new FormControl(p.stock, [Validators.required]),
      qtyAlert: new FormControl(p.stockAlert, [Validators.required]),
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
    if (this.formUp.value.stockAlert > this.formUp.value.stock) {
      this.toastrService.error('La quantité alert doit être inférieure à la quantité en stock !');
    } else {
      this.produitService.updateProduit(this.formUp.value).subscribe(res => {
        this.getEntrepot_uns();
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
    this.produitService.delete_produitsEntrepot(this.id_Produit).subscribe((data) => {
      this.toastrService.warning('Produit supprimé !');
      this.getEntrepot_uns();
    });
  }

  printCategorie() {
    this.produitService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.dsidakar.com/server/public/print/produits/categorie/' + this.cat, "_blank");
    });
  }

  printQtyOn() {
    this.produitService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.dsidakar.com/server/public/print/produits/qtyOn', "_blank");
    });
  }

  printQtyOff() {
    this.produitService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.dsidakar.com/server/public/print/produits/qtyOff', "_blank");
    });
  }

  printProduit(commande: any) {
    this.produitService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.dsidakar.com/server/public/print/produits/', "_blank");
    });
  }

  routeProduit() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/produit']);
  }


  routeMouvement() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/mouvement-list']);
  }

  exportPdf() {
    const safe = (val: any) => (val !== undefined && val !== null ? String(val) : 'N/A');

    // ✅ Calcul des totaux
    const totalQty = this.produits.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
    const totalPrixAchat = this.produits.reduce((sum, p) => sum + (Number(p.prix_achat) || 0), 0);
    const totalPrixGlobal = this.produits.reduce(
      (sum, p) => sum + ((Number(p.prix_achat) || 0) * (Number(p.qty) || 0)),
      0
    );

    // ✅ Formatage des nombres : milliers avec points, pas de virgules
    const formatPrice = (val: number) => {
      if (isNaN(val)) return '0';
      const rounded = Math.round(val);
      return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // ex: 1000000 => "1.000.000"
    };

    // Quantité : conserve les décimales si nécessaire (jusqu'à 2), et utilise le point comme séparateur
    const formatQty = (val: number) => {
      if (isNaN(val)) return '0';
      const num = Number(val);
      if (Number.isInteger(num)) return num.toString();
      // garde jusqu'à 2 décimales, supprime les 0 superflus
      return (Math.round(num * 100) / 100).toString().replace(/\.?0+$/, '');
    };

    // ✅ Tableau principal
    const tableBody = [
      [
        { text: 'Code', style: 'tableHeader' },
        { text: 'Désignation', style: 'tableHeader' },
        { text: 'Quantité', style: 'tableHeader' },
        { text: "Prix d'achat", style: 'tableHeader' },
        { text: 'Prix global', style: 'tableHeader' },
      ],
      ...this.produits.map(p => {
        const qty = Number(p.stock) || 0;
        const prixAchat = Number(p.prix_achat) || 0;
        const prixGlobal = prixAchat * qty;

        return [
          safe(p.code),
          safe(p.designation),
          { text: formatQty(qty), alignment: 'right' },
          { text: formatPrice(prixAchat), alignment: 'right' },
          { text: formatPrice(prixGlobal), alignment: 'right' }
        ];
      }),
      [
        { text: 'TOTAL', colSpan: 2, alignment: 'right', bold: true, fillColor: '#808080', color: 'black' },
        {},
        { text: formatQty(totalQty), bold: true, color: 'black', alignment: 'right' },
        { text: formatPrice(totalPrixAchat), bold: true, color: 'black', alignment: 'right' },
        { text: formatPrice(totalPrixGlobal), bold: true, color: 'black', alignment: 'right' }
      ]
    ];

    // ✅ Définition du document PDF (paysage)
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [20, 30, 20, 40],
      content: [
        {
          columns: [
            { image: 'logoTaiba', width: 300 },
            {
              text: 'Quincaillerie Générale\nVente de fer de tout genre\nAcier, Inox, Aluminium etc.\nDiamageune Dakar (Sénégal)\nTel: +221 77 753 26 76 | +221 77 860 63 48\nFax: +221 33 854 69 69',
              alignment: 'center',
              bold: true,
              fontSize: 12
            }
          ],
          margin: [0, 0, 0, 10]
        },
        { text: 'Liste des Produits', style: 'title' },
        {
          text: `Date d’export : ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
          alignment: 'right',
          fontSize: 8,
          italics: true,
          margin: [0, 0, 0, 10]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 65, 'auto'],
            body: tableBody
          },
          layout: 'lightHorizontalLines'
        }
      ],
      images: {
        logoTaiba: 'https://www.qg-avenir.iconestock.com/server/public/print/logo.png' // http://localhost:4200/assets/img/logo.png 
      },
      styles: {
        title: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          color: '#0000d6',
          margin: [0, 0, 0, 10]
        },
        tableHeader: {
          fillColor: '#D3D3D3',
          color: 'black',
          bold: true,
          alignment: 'center'
        }
      },
      footer: (currentPage, pageCount) => ({
        text: `Page ${currentPage} sur ${pageCount}`,
        alignment: 'center',
        fontSize: 8,
        margin: [0, 10, 0, 0]
      })
    };

    // Génération du PDF
    pdfMake.createPdf(docDefinition).open();
  }

}

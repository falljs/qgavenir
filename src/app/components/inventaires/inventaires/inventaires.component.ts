import { registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Produit } from 'src/app/models/produit';
import { InventaireService } from 'src/app/services/inventaire.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
import localeFr from '@angular/common/locales/fr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParametreService } from 'src/app/services/parametre.service';
import { HttpClient } from '@angular/common/http';
declare const bootstrap: any;

registerLocaleData(localeFr, 'fr')

@Component({
  selector: 'app-inventaires',
  templateUrl: './inventaires.component.html',
  styleUrls: ['./inventaires.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }]
})
export class InventairesComponent implements OnInit {
  private url = "https://www.qg-avenir.iconestock.com/server/public/api";

  page: number = 1;
  nbrProduit: number = 0;
  defaultItem: number = 50;
  currentPage: number = 1; // Page actuelle
  nbrPage: number = 0;

  inventaires!: Produit[];

  form!: FormGroup;
  formUpdate!: FormGroup;

  inventaireUpdate: any = {
    id: '',
    name: '',
    site: '',
    auteur: ''
  };

  searchSelect = '';
  selectedFournisseur: any = null;
  showDropdown = false;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  settingPayment: any;
  hostname: any;
  reference: any;

  inventaireToDelete: any = null;
  isDisableDelete = false;

  constructor(public inventaireService: InventaireService, public userService: UserService,
    public toastrService: ToastrService, public router: Router,
    public parametreService: ParametreService,
    public localStorageService: LocalStorageService, public http: HttpClient) { }
  get f() { return this.form.controls; }
  get fUp() { return this.formUpdate.controls; }

  ngOnInit(): void {
    // Initialiser le formulaire
    this.initForm();
    this.getInventaires();
    this.initFormUpdate();
    this.refreshRoleAndPermissonsUser();
    // Vérifier si les rôles existent dans l'utilisateur
    if (this.userService.user.roles && this.userService.user.roles.length > 0) {
      // Extraire le nom du premier rôle
      this.firstRoleName = this.userService.user.roles[0].name;
    }
    this.checkpaiement();
  }

  checkpaiement() {
    this.parametreService.getSettingIconeStock().subscribe(data => {
      let resp: any = data;
      const settingPaymentList = resp.payments;
      const hostname = window.location.hostname;
      if (!hostname.startsWith('www.')) {
        this.hostname = `www.${hostname}`;
      } else {
        this.hostname = hostname;
      }
      const settingPayment = settingPaymentList.filter((item: any) => item.client === this.hostname && item.module === 'inventaire');
      this.settingPayment = settingPayment[0];
      if (this.settingPayment?.check == 0) {
        this.reference = this.settingPayment?.reference;
        const openModal = document.getElementById('modalPayInventaireProduct') as HTMLElement;
        const modalInstance = bootstrap.Modal.getInstance(openModal) || new bootstrap.Modal(openModal);
        modalInstance.show();
      }
    });
  }

  essaie() {
    this.parametreService.getEssaieIconeStock(this.reference).subscribe(data => {
      let resp: any = data;
      const openModal = document.getElementById('modalPayInventaireProduct') as HTMLElement;
      const modalInstance = bootstrap.Modal.getInstance(openModal) || new bootstrap.Modal(openModal);
      modalInstance.hide();
    });
  }

  refreshRoleAndPermissonsUser(): void {
    this.userService.refreshRoleAndPermissonsUser(this.userService.user.id).subscribe(data => {
      let resp: any = data;
      this.userService.user.permissions = resp.user.permissions;
      this.userService.setRoles(resp.user.roles);
    });
  }


  //init form created data
  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      site: new FormControl('', Validators.required),
      auteur: new FormControl(this.userService.name)
    });
  }

  //init form created data
  initFormUpdate() {
    this.formUpdate = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      site: new FormControl('', Validators.required),
      auteur: new FormControl(this.userService.name)
    });
  }

  edit(inventaire: any) {
    this.inventaireUpdate = { ...inventaire };
    this.formUpdate.patchValue({
      id: this.inventaireUpdate.id,
      name: this.inventaireUpdate.name,
      site: this.inventaireUpdate.site,
    });
    const openModal = document.getElementById('modal-update-inventaire') as HTMLElement;
    const modalInstance = bootstrap.Modal.getInstance(openModal) || new bootstrap.Modal(openModal);
    modalInstance.show();
  }

  detail(inventaire: any) {
    if (this.userService.checkPermissionExistence(this.firstRoleName + ' faire inventaire Stock')) {
      this.inventaireService.getInventaire(inventaire.id).subscribe(res => {
        let data: any = res;
        localStorage.removeItem('detailInventaire')
        localStorage.setItem('detailInventaire', JSON.stringify(data.inventaire));
        localStorage.removeItem('listeProduitInventaire')
        localStorage.setItem('listeProduitInventaire', JSON.stringify(data.produits));
        localStorage.removeItem('listeFamillesInventaire')
        localStorage.setItem('listeFamillesInventaire', JSON.stringify(data.familles));
        localStorage.removeItem('produitsInventaire')
        this.router.navigate(['/detail-inventaires']);
      });
    } else {
      this.toastrService.error("Vous n'avez pas l'authorisation d'acces !");
    }
  }

  onSubmit() {
    this.inventaireService.create(this.form.value).subscribe(res => {
      this.getInventaires();
      this.form.reset();
      const openModal = document.getElementById('modal-new-inventaire') as HTMLElement;
      const modalInstance = bootstrap.Modal.getInstance(openModal) || new bootstrap.Modal(openModal);
      modalInstance.hide();
      this.toastrService.success('Inventaire Créé avec succès !');
    });
  }


  onUpdate() {
    this.inventaireService.update(this.formUpdate.value, this.formUpdate.value.id).subscribe(res => {
      this.getInventaires();
      const openModal = document.getElementById('modal-update-inventaire') as HTMLElement;
      const modalInstance = bootstrap.Modal.getInstance(openModal) || new bootstrap.Modal(openModal);
      modalInstance.hide();
      this.toastrService.success('Inventaire modifié avec succès !');
    });
  }


  //Get All product
  getInventaires() {
    this.inventaireService.getInventaires().subscribe(res => {
      this.inventaires = res;
      //this.nbrProduit = this.inventaires.length;
      //this.nbrPage = Math.ceil(this.nbrProduit / this.defaultItem);
    });
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Réinitialiser à la première page après modification
  }

  // Étape 1 : clic sur l'icône poubelle -> on mémorise juste la cible et on
  // laisse la modale Bootstrap s'ouvrir (data-bs-toggle="modal" s'en charge
  // déjà dans le HTML). Aucun appel réseau ici.
  delete(inventaire: any) {
    this.inventaireToDelete = inventaire;
  }

  // Étape 2 : clic sur "Supprimer" DANS la modale -> l'action réelle.
  confirmDelete() {
    if (!this.inventaireToDelete || this.isDisableDelete) {
      return;
    }
    this.isDisableDelete = true;

    this.http.delete(`${this.url}/inventaire/${this.inventaireToDelete.id}`).subscribe({
      next: () => {
        this.inventaires = this.inventaires.filter(
          (inv: any) => inv.id !== this.inventaireToDelete.id
        );
        this.toastrService.success('Inventaire supprimé avec succès !');
        this.isDisableDelete = false;
        this.inventaireToDelete = null;
        const openModal = document.getElementById('modal-delete-inventaire') as HTMLElement;
        const modalInstance = bootstrap.Modal.getInstance(openModal) || new bootstrap.Modal(openModal);
        modalInstance.hide();
      },
      error: (err) => {
        this.isDisableDelete = false;
        this.toastrService.error(err?.error?.message ?? "Erreur lors de la suppression.");
      }
    });
  }
}

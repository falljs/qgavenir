import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss']
})
export class FournisseurComponent implements OnInit {

  form!: FormGroup;
  page: number = 1;
  defaultItem: number = 8;
  id_Fournisseur!: any;
  nbrFournisseur: number = 0;
  nbrPage: number = 0;

  // ms erreur
  msg_nom: any;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public fournisseurService: FournisseurService, public userService: UserService,
    public fb: FormBuilder, public router: Router,
    public toastrService: ToastrService, public localStorageService: LocalStorageService) { }
  get f() { return this.form.controls }

  ngOnInit(): void {
    this.initForm();
    this.getAllFournisseurs();
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

  initForm() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      surnom: new FormControl(''),
      email: new FormControl(''),
      address: new FormControl(''),
      phone: new FormControl(''),
      auteur: new FormControl(this.userService.name)
    });
  }

  getAllFournisseurs() {
    this.fournisseurService.getAll().subscribe(
      response => {
        this.fournisseurService.listFournisseur = response;
        this.nbrFournisseur = this.fournisseurService.listFournisseur.length;
        this.nbrPage = Math.ceil(this.nbrFournisseur / this.defaultItem);
      });
  }

  search() {
    this.page = 1;
    let search: any = $("#InputSearch").val();
    if (search) {
      this.fournisseurService.searchFournisseur(search).subscribe(
        res => {
          let data: any = res;
          this.fournisseurService.listFournisseur = data;
          this.nbrFournisseur = this.fournisseurService.listFournisseur.length;
        });
    } else {
      this.getAllFournisseurs();
    }
  }

  addFournisseur() {
    this.initForm();
  }

  onSubmit() {
    this.fournisseurService.createData(this.form.value).subscribe({
      next: data => {
        let resp: any = data;
        if (resp.msg_fournisseur) {
          this.msg_nom = resp.msg_fournisseur;
        } else {
          this.initForm();
          this.getAllFournisseurs();
          this.toastrService.success('Fournisseur ' + resp.data.name + ' ajouté !');
        }

      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  detail(fournisseur: any) {
    localStorage.removeItem('fournisseur');
    localStorage.setItem('fournisseur', JSON.stringify(fournisseur));
    this.router.navigate(['/fournisseur-detail']);
  }

  //  Search Filter
  myFunction() {
    var input: any, filter, table: any, tr, i;

    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableFournisseur");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      var td0 = tr[i].getElementsByTagName("td")[0];

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

  routeFournisseur() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/fournisseur']);
  }
}

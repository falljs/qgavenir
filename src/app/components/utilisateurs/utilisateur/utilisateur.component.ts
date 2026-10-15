import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RolePermissonService } from 'src/app/services/role-permisson.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent {

  form!: FormGroup;
  page: number = 1;
  defaultItem: number = 8;
  showPassword = false;
  id_User!: any;
  nbrUser: number = 0;
  nbrPage: number = 0;

  //ms erreur 
  msg_user: any;

  listeRolePermisson: any[] = [];

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public userService: UserService, public fb: FormBuilder,
    public router: Router, public rolePermissonService: RolePermissonService) { }
  get f() { return this.form.controls }

  ngOnInit(): void {
    this.initForm();
    this.getAllUsers();
    this.loadRoleAndPermissons();
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

  // Méthode pour récupérer les role et permissons
  loadRoleAndPermissons(): void {
    this.rolePermissonService.index().subscribe(
      response => {
        let data: any = response;  // Correction de la syntaxe
        this.listeRolePermisson = data;  // Stocker les role et permissons dans le tableau
      },
      (error) => {
        console.error('Erreur lors de la récupération des role et permissons:', error);
      }
    );
  }

  initForm() {
    this.form = new FormGroup({
      prenom: new FormControl('', [Validators.required]),
      nom: new FormControl(''),
      adresse: new FormControl(''),
      contact: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      c_password: new FormControl('', [Validators.required]),
      role: new FormControl('0', [Validators.min(1)]),
      blocked: new FormControl('0'),
      auteur: new FormControl(this.userService.name)
    });
  }

  getAllUsers() {
    this.userService.getAll().subscribe(
      response => {
        this.userService.listeUtilisateur = response;
        this.nbrUser = this.userService.listeUtilisateur.length;
      });
  }

  search() {
    this.page = 1;
    let search: any = $("#inputSearch").val();
    if (search) {
      this.userService.searchUser(search).subscribe(
        res => {
          let data: any = res;
          this.userService.listeUtilisateur = data;
          this.nbrUser = this.userService.listeUtilisateur.length;
        });
    } else {
      this.getAllUsers();
    }
  }

  addUser() {
    this.initForm();
  }

  onSubmit() {
    this.userService.createData(this.form.value).subscribe({
      next: data => {
        let resp: any = data;
        if (resp.msg_user) {
          this.msg_user = resp.msg_user;
        } else {
          this.initForm();
          this.getAllUsers();
        }

      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  showHidePwd() {
    this.showPassword = !this.showPassword;
  }

  getUtilisateur(user: any) {
    localStorage.removeItem('utilisateur');
    localStorage.setItem('utilisateur', JSON.stringify(user));
    this.router.navigate(['/utilisateur-detail']);
  }

  getUtilisateursss(user: any) {
    this.userService.getData(user.id).subscribe(data => {
      let resp: any = data;
      localStorage.removeItem('dataUser');
      localStorage.setItem('dataUser', this.userService.encrypt(JSON.stringify(resp.user)));
      localStorage.removeItem('roleId');
      localStorage.setItem('roleId', user.roles[0]?.id);
      console.log(user.roles[0]?.id);
      this.router.navigate(['/utilisateur-detail']);
    });

  }

  //  Search Filter
  myFunction() {
    var input: any, filter, table: any, tr, i;

    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableUser");
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
}

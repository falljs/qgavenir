import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/services/client.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent {

  form!: FormGroup;
  page: number = 1;
  defaultItem: number = 8;
  id_Client!: any;
  nbrClient: number = 0;
  nbrPage: number = 0;

  // ms erreur
  msg_nom: any;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public clientService: ClientService, public userService: UserService,
    public fb: FormBuilder, public router: Router,
    public toastrService: ToastrService, public localStorageService: LocalStorageService) { }
  get f() { return this.form.controls }

  ngOnInit(): void {
    this.initForm();
    this.getAllClients();
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
      phone: new FormControl('221'),
      auteur: new FormControl(this.userService.name)
    });
  }

  getAllClients() {
    this.clientService.getAll().subscribe(
      response => {
        this.clientService.listClient = response;
        this.nbrClient = this.clientService.listClient.length;
        this.nbrPage = Math.ceil(this.nbrClient / this.defaultItem);
      });
  }

  search() {
    this.page = 1;
    let search: any = $("#InputSearch").val();
    if (search) {
      this.clientService.searchClient(search).subscribe(
        res => {
          let data: any = res;
          this.clientService.listClient = data;
          this.nbrClient = this.clientService.listClient.length;
        });
    } else {
      this.getAllClients();
    }
  }

  addClient() {
    this.initForm();
  }

  onSubmit() {
    this.clientService.createData(this.form.value).subscribe({
      next: data => {
        let resp: any = data;
        if (resp.msg_client) {
          this.msg_nom = resp.msg_client;
        } else {
          this.initForm();
          this.getAllClients();
          this.toastrService.success('Client ' + resp.data.name + ' ajouté !');
        }

      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  getClient(client: any) {
    localStorage.removeItem('client');
    localStorage.setItem('client', JSON.stringify(client));
    this.router.navigate(['/client-detail']);
  }

  facturer(client: any) {
    localStorage.removeItem('clientFacture');
    localStorage.setItem('clientFacture', JSON.stringify(client));
    this.router.navigate(['/vente']);
  }

  //  Search Filter
  myFunction() {
    var input: any, filter, table: any, tr, i;

    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableClient");
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

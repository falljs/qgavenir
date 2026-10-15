import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FraisService } from 'src/app/services/frais.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-frais',
  templateUrl: './frais.component.html',
  styleUrls: ['./frais.component.scss']
})
export class FraisComponent {

  page: number = 1;
  nbrFrais: number = 0;
  defaultItem: number = 12;
  fraiss!: any[];
  form!: FormGroup;
  id_frais!: any;
  nbrPage: number = 0;
  date: any;
  dateChange: any;
  totalFrais: number = 0;

  date1: any;
  date2: any;

  isDate2: boolean = false;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public fraisService: FraisService, private datePipe: DatePipe,
    public userService: UserService, public fb: FormBuilder,
    public toastrService: ToastrService, public router: Router, public localStorageService: LocalStorageService) { }
  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.date = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    this.getFraisByDate(this.date);
    this.initForm();
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

  //Get All frais
  getFrais() {
    this.date1 = null;
    this.date2 = null;
    this.fraisService.getAllFrais().subscribe(res => {
      let data: any = res;
      this.fraiss = data.frais;
      this.nbrFrais = this.fraiss.length;
      this.nbrPage = Math.ceil(this.nbrFrais / this.defaultItem);

      let totalFrais = 0;

      for (var i = 0; i < this.fraiss.length; i++) {

        if (this.fraiss[i].montant) {
          totalFrais += this.fraiss[i].montant;
          this.totalFrais = totalFrais;
        } else {
          totalFrais += this.fraiss[i].montant;
          this.totalFrais = totalFrais;
        }
      }
    });
  }

  //Get frais by date
  getFraisByDate(date: any) {
    this.date1 = null;
    this.date2 = null;
    this.totalFrais = 0;
    this.fraisService.getFaisByDate(date).subscribe(res => {
      let data: any = res;
      this.fraiss = data.frais;
      this.nbrFrais = this.fraiss.length;
      this.nbrPage = Math.ceil(this.nbrFrais / this.defaultItem);

      let totalFrais = 0;
      for (var i = 0; i < this.fraiss.length; i++) {

        if (this.fraiss[i].montant) {
          totalFrais += this.fraiss[i].montant;
          this.totalFrais = totalFrais;
        } else {
          totalFrais += this.fraiss[i].montant;
          this.totalFrais = totalFrais;
        }
      }
    });
  }

  onChangeDate(ctrl: any) {
    this.totalFrais = 0;
    let date = this.datePipe.transform(ctrl.value, 'yyyy-MM-dd');
    this.fraisService.getFaisByDate(date).subscribe(res => {
      let data: any = res;
      this.fraiss = data.frais;
      this.nbrFrais = this.fraiss.length;
      this.nbrPage = Math.ceil(this.nbrFrais / this.defaultItem);

      let totalFrais = 0;
      for (var i = 0; i < this.fraiss.length; i++) {

        if (this.fraiss[i].net) {
          totalFrais += this.fraiss[i].montant;
          this.totalFrais = totalFrais;
        } else {
          totalFrais += this.fraiss[i].montant;
          this.totalFrais = totalFrais;
        }
      }
    });
  }

  onChangeDate1(ctrl: any) {
    if (ctrl.value) {
      let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.date1 = date;
      this.isDate2 = true;
    } else {
      this.isDate2 = false;
    }
  }

  onChangeDate2(ctrl: any) {
    if (ctrl.value) {
      let date1 = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
      this.date2 = date1;
      this.fraisService.getFraisBy2Date(this.date1, this.date2).subscribe(res => {
        let data: any = res;
        this.fraiss = data.frais;
        this.nbrFrais = this.fraiss.length;
        this.nbrPage = Math.ceil(this.nbrFrais / this.defaultItem);

        let totalFrais = 0;
        for (var i = 0; i < this.fraiss.length; i++) {

          if (this.fraiss[i].net) {
            totalFrais += this.fraiss[i].montant;
            this.totalFrais = totalFrais;
          } else {
            totalFrais += this.fraiss[i].montant;
            this.totalFrais = totalFrais;
          }
        }
      });
    }

  }

  //init form created data
  initForm() {
    this.form = new FormGroup({
      montant: new FormControl(0, [Validators.required]),
      desc: new FormControl('', [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }

  //Created car
  onSubmit() {
    this.fraisService.create(this.form.value).subscribe(
      response => {
        let data: any = response;
        this.initForm();
        this.getFraisByDate(this.date);
        this.toastrService.success('Frais de ' + data.frais.montant + ' ajouté !');
      });
  }

  openModalDelete(id: number) {
    this.id_frais = id;
  }

  deleteFrais() {
    this.fraisService.delete(this.id_frais).subscribe((data) => {
      this.getFraisByDate(this.date);
      this.toastrService.warning('Frais supprimé !');
    });
  }

  routeAcceuil() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/accueil']);
  }

  routeRapport() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/rapport']);
  }

}

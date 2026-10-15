import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StatistiqueService } from 'src/app/services/statistique.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.scss']
})
export class RapportComponent {

  page: number = 1;
  nbrFrais: number = 0;
  defaultItem: number = 12;
  nbrPage: number = 0;
  date: any;
  dateChange: any;

  codeClt: any;
  date1: any;
  date2: any;

  isDate2: boolean = false;

  listeBeneficeByCmd!: any[];
  totalListeBeneficeByCmd: number = 0;

  listeBeneficeByProd!: any[];
  totalListeBeneficeByProd: number = 0;

  frais: number = 0;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public statistiqueService: StatistiqueService, private datePipe: DatePipe,
    public userService: UserService, public fb: FormBuilder,
    public toastrService: ToastrService,
    public router: Router, public localStorageService: LocalStorageService) { }


  ngOnInit(): void {
    this.date = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    this.getBenefice();
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

  //Get Bénéfice
  getBenefice() {
    this.statistiqueService.getBenefice().subscribe(res => {
      let data: any = res;
      this.listeBeneficeByCmd = data.benefice_commandes;
      this.totalListeBeneficeByCmd = data.total_benefice_commandes;

      this.listeBeneficeByProd = data.benefice_produits;
      this.totalListeBeneficeByProd = data.total_benefice_produits;

      this.frais = data.total_frais;

      this.nbrFrais = this.listeBeneficeByProd.length;

      this.nbrPage = Math.ceil(this.nbrFrais / this.defaultItem);
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
      this.statistiqueService.getBeneficeBy2Date(this.date1, this.date2).subscribe(res => {
        let data: any = res;
        this.listeBeneficeByCmd = data.benefice_commandes;
        this.totalListeBeneficeByCmd = data.total_benefice_commandes;

        this.frais = data.total_frais;

        this.listeBeneficeByProd = data.benefice_produits;
        this.totalListeBeneficeByProd = data.total_benefice_produits;

        this.nbrFrais = this.listeBeneficeByProd.length;

        this.nbrPage = Math.ceil(this.nbrFrais / this.defaultItem);
      });
    }

  }

  onChangeDate(ctrl: any) {
    let date = this.datePipe.transform(ctrl.value, 'yyyy-MM-dd');
    this.statistiqueService.getBeneficeByDate(date).subscribe(res => {
      let data: any = res;
      this.listeBeneficeByCmd = data.benefice_commandes;
      this.totalListeBeneficeByCmd = data.total_benefice_commandes;

      this.listeBeneficeByProd = data.benefice_produits;
      this.totalListeBeneficeByProd = data.total_benefice_produits;

      this.frais = data.total_frais;

      this.nbrFrais = this.listeBeneficeByProd.length;

      this.nbrPage = Math.ceil(this.nbrFrais / this.defaultItem);
    });
  }

  //Get All frais
  getAllBenefice() {
    this.statistiqueService.getAllBenefice().subscribe(res => {
      let data: any = res;
      this.listeBeneficeByCmd = data.benefice_commandes;
      this.totalListeBeneficeByCmd = data.total_benefice_commandes;

      this.listeBeneficeByProd = data.benefice_produits;
      this.totalListeBeneficeByProd = data.total_benefice_produits;

      this.frais = data.total_frais;

      this.nbrFrais = this.listeBeneficeByProd.length;

      this.nbrPage = Math.ceil(this.nbrFrais / this.defaultItem);
    });
  }

  routeAcceuil() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/accueil']);
  }

  routeFrais() {
    // Utilisation de la fonction clearLocalStorage
    const exceptions = ['user', 'token', 'payment'];
    this.localStorageService.clearLocalStorage(exceptions);
    this.router.navigate(['/frais']);
  }

}


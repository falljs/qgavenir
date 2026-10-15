import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompteService } from 'src/app/services/compte.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.scss']
})
export class CompteComponent {

  page: number = 1;
  nbrCompte: number = 0;
  defaultItem: number = 4;
  comptes!: any[];
  form!: FormGroup;
  formUp!: FormGroup;
  id_compte!: any;
  nbrPage: number = 0;

  disableVerse: boolean = false;
  disableRetrait: boolean = false;

  formIn!: FormGroup;
  id_in!: any;
  formOut!: FormGroup;
  id_out!: any;
  versers!: any[];
  versement!: number;
  descVerse: any;
  retraits!: any[];
  retrait!: number;
  descRetrait: any;
  isDetail: boolean = false;
  num: any;
  month: any;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public compteService: CompteService, private datePipe: DatePipe,
    public userService: UserService, public fb: FormBuilder,
    public toastrService: ToastrService) { }
  get f() { return this.form.controls; }
  get fUp() { return this.formUp.controls; }
  get fIn() { return this.formIn.controls; }
  get fOut() { return this.formOut.controls; }

  ngOnInit(): void {
    this.getComptes();
    this.initForm();
    this.initFormUp();
    this.initFormIn();
    this.initFormOut();
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

  //Get All product
  getComptes() {
    this.compteService.getAllCompte().subscribe(res => {
      this.comptes = res;
      this.nbrCompte = this.comptes.length;
      this.nbrPage = Math.ceil(this.nbrCompte / this.defaultItem);
    });
  }

  //init form created data
  initForm() {
    this.form = new FormGroup({
      owner: new FormControl('', [Validators.required]),
      sold: new FormControl(0, [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }

  //init form updated data
  initFormUp() {
    this.formUp = new FormGroup({
      owner: new FormControl('', [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }

  //Update
  update(p: any) {
    this.formUp = new FormGroup({
      id: new FormControl(p.id),
      owner: new FormControl(p.owner, [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }

  //Created car
  onSubmit() {
    this.compteService.create(this.form.value).subscribe(
      response => {
        let compte: any = response;
        this.initForm();
        this.getComptes();
        this.toastrService.success('Compte N° ' + compte.num + ' Crée !');
      });
  }

  //Update car
  onUpdate() {
    this.compteService.update(this.formUp.value).subscribe(
      response => {
        let compte: any = response;
        $('#modal-compte-update').toggle();
        this.getComptes();
        this.formUp.reset();
        this.toastrService.success('Compte N° ' + compte.num + ' modifié !');
      });
  }

  detail(compte: any) {
    this.isDetail = true;
    this.num = '';
    this.id_compte = compte.id;
    this.num = compte.num;
    this.getCompte(compte.id);
  }

  getCompte(id: number) {
    this.compteService.getCompte(id).subscribe(response => {
      let data: any = response;
      this.versers = data.versements;
      this.retraits = data.retraits;
    });
  }

  // Cette fonction calcule la somme des versements
  calculateTotalVersements(versements: any) {
    let total = 0;
    for (var i = 0; i < versements?.length; i++) {
      if (versements[i].montant) {
        total += versements[i].montant;
      }
    }
    return total;
  }

  // Cette fonction calcule la somme des retraits
  calculateTotalRetraits(retraits: any) {
    let total = 0;
    for (var i = 0; i < retraits?.length; i++) {
      if (retraits[i].montant) {
        total += retraits[i].montant;
      }
    }
    return total;
  }

  openModalDelete(id: number) {
    this.id_compte = id;
  }

  modalDeleteVerser(id: number) {
    this.id_in = id;
  }

  modalDeleteRetirer(id: number) {
    this.id_out = id;
  }

  deleteCompte() {
    this.compteService.delete(this.id_compte).subscribe((data) => {
      this.isDetail = false;
      this.getComptes();
      this.toastrService.warning('Compte supprimé !');
    });
  }

  deleteVerser() {
    this.compteService.deleteIn(this.id_in).subscribe((data) => {
      let compte: any = data;
      this.versers = compte.versements;
      this.toastrService.warning('Ligne supprimé !');
      this.getComptes();
    });
  }

  deleteRetirer() {
    this.compteService.deleteOut(this.id_out).subscribe((data) => {
      let compte: any = data;
      this.retraits = compte.retraits;
      this.toastrService.warning('Ligne supprimé !');
      this.getComptes();
    });
  }

  search() {
    this.page = 1;
    let search: any = $("#InputSearch").val();
    if (search) {
      this.compteService.searchCompte(search).subscribe(
        res => {
          let data: any = res;
          this.comptes = data;
          this.nbrCompte = this.comptes.length;
        });
    } else {
      this.getComptes();
    }
  }

  //init form created data
  initFormIn() {
    this.formIn = this.fb.group({
      montant: this.versement,
      desc: this.descVerse,
      compt_id: this.id_compte,
      auteur: this.userService.name,
    });
  }

  //init form created data
  initFormOut() {
    this.formOut = this.fb.group({
      montant: this.retrait,
      desc: this.descRetrait,
      compt_id: this.id_compte,
      auteur: this.userService.name,
    });
  }

  onSubmitIn() {
    this.disableVerse = true;
    this.initFormIn();
    this.compteService.createIn(this.formIn.value).subscribe(
      response => {
        let compte: any = response;
        this.versers = compte.versements;
        this.versement = 0;
        this.descVerse = '';
        this.disableVerse = false;
        this.getComptes();
        this.toastrService.success('Versement effectué !');
      });
  }

  onSubmitOut() {
    this.disableRetrait = true;
    this.initFormOut();
    this.compteService.createOut(this.formOut.value).subscribe(
      response => {
        let compte: any = response;
        this.retraits = compte.retraits;
        this.retrait = 0;
        this.descRetrait = '';
        this.disableRetrait = false;
        this.getComptes();
        this.toastrService.success('Retrait effectuée !');
      });
  }

}
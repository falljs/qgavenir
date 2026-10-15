import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ParametreService } from 'src/app/services/parametre.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-parametre',
  templateUrl: './parametre.component.html',
  styleUrls: ['./parametre.component.scss']
})
export class ParametreComponent {

  setting!: any;
  msgError!: any;
  formUpdate!: FormGroup;

  stgFile!: any;
  logoURL!: any;

  listModels!: any[];
  template!: any;

  listYears: any = [];
  yearNow: any;

  maintenance: any;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public parametreService: ParametreService, public userService: UserService,
    public router: Router, public toastrService: ToastrService, private datePipe: DatePipe) { }
  get fUpdate() { return this.formUpdate.controls }

  ngOnInit(): void {
    this.yearNow = this.getYear(new Date(Date.now()));
    this.getYears(this.yearNow);
    this.getSetting();
    this.initFormUp();
    this.getModels();
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

  updateMaintenance(maintenance: any) {
    const data = {
      maintenance: maintenance.value,
    };

    this.parametreService.setMaintenance(data).subscribe({
      next: (response) => {
        let data: any = response;
        localStorage.setItem('setting', this.userService.encrypt(JSON.stringify(data.data)));
        this.toastrService.success(data.message);
      },
      error: (err) => {
        this.toastrService.error(err.error.message || 'Erreur lors de la mise à jour');
      }
    });
  }

  getSetting() {
    if (localStorage.getItem("setting") != null) {
      const data: any = localStorage.getItem('setting');
      this.setting = JSON.parse(this.userService.decrypt(data));
      this.maintenance = this.setting.maintenance;
    }
  }

  initFormUp() {
    this.formUpdate = new FormGroup({
      entreprise: new FormControl(this.setting.entreprise, [Validators.required]),
      phone1: new FormControl(this.setting.phone1, [Validators.required]),
      email: new FormControl(this.setting.email, [Validators.required]),
      adresse: new FormControl(this.setting.adresse, [Validators.required]),
      archive: new FormControl(this.setting.archive, [Validators.required]),

      // Garantie
      garantie_active: new FormControl(this.setting.garantie_active ?? false),
      garantie: new FormControl(this.setting.garantie ?? ''),

      // Politique de retour
      politique_retour_active: new FormControl(this.setting.politique_retour_active ?? false),
      politique_retour: new FormControl(this.setting.politique_retour ?? ''),
    });
  }

  getYears(year: number) {
    for (var i = 2014; i <= year; i++) {
      this.listYears.push(i);
    }
  }

  onSelectFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.stgFile = file;

      var mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        alert('Only images are supported.');
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(this.stgFile);
      reader.onload = (_event) => {
        this.logoURL = reader.result;
      }

      const formData = new FormData();

      formData.append('logo', this.stgFile);
      this.parametreService.updateLogo(formData).subscribe(
        data => {
          localStorage.removeItem('setting');
          localStorage.setItem('setting', JSON.stringify(data));
          this.getSetting();
          this.toastrService.success('Logo changé !');
        });
    }
  }

  getModels() {
    this.parametreService.getModels().subscribe(
      data => {
        let response: any = data;
        this.listModels = response;
      });
  }

  Update_model(id: any) {
    this.parametreService.onUpdate_model(id).subscribe({
      next: data => {
        this.getModels();
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  onDetail(img: any) {
    this.template = img;
    $('#updateModal').modal('toggle');
  }

  onSelect() {
    $('#file').click();
  }

  // =========================================================
  // MISE A JOUR INFORMATIONS ENTREPRISE
  // =========================================================

  onUpdate(): void {

    if (this.formUpdate.invalid) {

      this.formUpdate.markAllAsTouched();

      this.toastrService.warning(
        'Veuillez remplir correctement tous les champs obligatoires.',
        'Formulaire incomplet'
      );

      return;
    }


    this.parametreService
      .updateData(this.formUpdate.value)
      .subscribe({

        next: (response: any) => {

          /*
           * Laravel retourne :
           *
           * {
           *   success: true,
           *   message: "...",
           *   data: {...}
           * }
           */

          const setting = response?.data ?? response;

          // Mise à jour du cache
          localStorage.setItem(
            'setting',
            this.userService.encrypt(
              JSON.stringify(setting)
            )
          );

          // Recharger les paramètres
          this.getSetting();

          // Recharger le formulaire avec les nouvelles valeurs
          this.formUpdate.patchValue({
            entreprise: setting.entreprise ?? '',
            phone1: setting.phone1 ?? '',
            email: setting.email ?? '',
            adresse: setting.adresse ?? '',
            archive: setting.archive ?? '',

            garantie_active: setting.garantie_active ?? true,
            garantie: setting.garantie ?? '',

            politique_retour_active: setting.politique_retour_active ?? false,
            politique_retour: setting.politique_retour ?? '',
          });

          this.toastrService.success(
            response?.message ||
            'Informations mises à jour avec succès !',
            'Succès'
          );

        },

        error: (err: any) => {

          const message =
            err?.error?.message ||
            'Une erreur est survenue lors de la mise à jour des paramètres.';

          this.toastrService.error(
            message,
            'Erreur'
          );

        }

      });
  }


  // =========================================================
  // ANNEE
  // =========================================================

  getYear(date: any) {

    return this.datePipe.transform(
      date,
      'yyyy'
    );
  }


}

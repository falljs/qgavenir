import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RolePermissonService } from 'src/app/services/role-permisson.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-detail-utilsateur',
  templateUrl: './detail-utilsateur.component.html',
  styleUrls: ['./detail-utilsateur.component.scss']
})
export class DetailUtilsateurComponent implements OnInit {

  form!: FormGroup;
  formUpdatePasswordAdmin!: FormGroup;
  formUpdatePasswordUser!: FormGroup;
  formUpdate!: FormGroup;
  user!: any;
  msgError!: any;
  msgErrorConfirme_password!: any;
  msgErrorAncien_password!: any;
  showPassword = false;

  userImg!: any;
  imgURL!: any;

  listeRoles: any[] = [];

  //PERMISSIONS
  isDisable: boolean = false;
  isClick: boolean = false;
  // Les permissions 
  permissions_user: any;

  permissions = [
    {
      module: 'Entête',
      options: [
        { name: 'role avoir accès Entête', checked: false },
        { name: 'role voir notification Entête', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Tableau de bord',
      options: [
        { name: 'role avoir accès Tableau de bord', checked: false },
        { name: 'role voir statistique Tableau de bord', checked: false },
        { name: 'role voir rapport Tableau de bord', checked: false },
        { name: 'role voir frais Tableau de bord', checked: false },
        { name: 'role créer frais Tableau de bord', checked: false },
        { name: 'role supprimer frais Tableau de bord', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Dossier',
      options: [
        { name: 'role avoir accès Dossier', checked: false },
        { name: 'role encaisser Dossier', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Vente',
      options: [
        { name: 'role avoir accès Vente', checked: false },
        { name: 'role voir facture Vente', checked: false },
        { name: 'role voir devis Vente', checked: false },
        { name: 'role voir bon Vente', checked: false },
        { name: 'role voir encaissement Vente', checked: false },
        { name: 'role créer facture et devis Vente', checked: false },
        { name: 'role créer bon Vente', checked: false },
        { name: 'role faire encaissement et décaissement Vente', checked: false },
        { name: 'role supprimer encaissement et décaissement Vente', checked: false },
        { name: 'role voir caisse encaissement et décaissement Vente', checked: false },
        { name: 'role modifier facture et devis Vente', checked: false },
        { name: 'role modifier bon Vente', checked: false },
        { name: 'role supprimer facture et devis Vente', checked: false },
        { name: 'role supprimer bon Vente', checked: false },
        { name: 'role annuler facture Vente', checked: false },
        { name: 'role annuler bon Vente', checked: false },
        { name: 'role convertir devis Vente', checked: false },
        { name: 'role convertir devis bon Vente', checked: false },
        { name: 'role convertir bon Vente', checked: false },
        { name: 'role régler une facture Vente', checked: false },
        { name: 'role supprimer reglement Vente', checked: false },
        { name: 'role faire reduction Vente', checked: false },
        { name: 'role régler un bon Vente', checked: false },
        { name: 'role faire remboursement Vente', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Achat',
      options: [
        { name: 'role avoir accès Achat', checked: false },
        { name: 'role créer achat Achat', checked: false },
        { name: 'role voir facture achat Achat', checked: false },
        { name: 'role modifer achat Achat', checked: false },
        { name: 'role supprimer achat Achat', checked: false },
        { name: 'role annuler achat Achat', checked: false },
        { name: 'role régler une facture Achat', checked: false },
        { name: 'role faire reduction Achat', checked: false },
        { name: 'role voir bon achat Achat', checked: false },
        { name: 'role créer bon achat Achat', checked: false },
        { name: 'role modifer bon achat Achat', checked: false },
        { name: 'role supprimer bon achat Achat', checked: false },
        { name: 'role convertir bon achat Achat', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'CRM',
      options: [
        { name: 'role avoir accès CRM', checked: false },
        { name: 'role voir client CRM', checked: false },
        { name: 'role voir fournisseur CRM', checked: false },
        { name: 'role créer client CRM', checked: false },
        { name: 'role modifier client CRM', checked: false },
        { name: 'role supprimer client CRM', checked: false },
        { name: 'role créer compte client CRM', checked: false },
        { name: 'role verser compte client CRM', checked: false },
        { name: 'role retirer compte client CRM', checked: false },
        { name: 'role supprimer versement compte client CRM', checked: false },
        { name: 'role supprimer retirait compte client CRM', checked: false },
        { name: 'role régler client CRM', checked: false },
        { name: 'role créer fournisseur CRM', checked: false },
        { name: 'role modifier fournisseur CRM', checked: false },
        { name: 'role supprimer fournisseur CRM', checked: false },
        { name: 'role régler fournisseur CRM', checked: false },
        { name: 'role créer compte fournisseur CRM', checked: false },
        { name: 'role verser compte fournisseur CRM', checked: false },
        { name: 'role retirer compte fournisseur CRM', checked: false },
        { name: 'role supprimer versement compte fournisseur CRM', checked: false },
        { name: 'role supprimer retirait compte fournisseur CRM', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Stock',
      options: [
        { name: 'role avoir accès Stock', checked: false },
        { name: 'role voir produit Stock', checked: false },
        { name: 'role voir mouvement Stock', checked: false },
        { name: 'role voir depôt Stock', checked: false },
        { name: 'role voir inventaire Stock', checked: false },
        { name: 'role créer produit Stock', checked: false },
        { name: 'role modifier produit Stock', checked: false },
        { name: 'role supprimer produit Stock', checked: false },
        { name: 'role importer produit Stock', checked: false },
        { name: 'role exporter produit Stock', checked: false },
        { name: 'role detail produit Stock', checked: false },
        { name: 'role créer mouvement Stock', checked: false },
        { name: 'role modifier mouvement Stock', checked: false },
        { name: 'role supprimer mouvement Stock', checked: false },
        { name: 'role annuler mouvement Stock', checked: false },
        { name: 'role supprimer produit depôt Stock', checked: false },
        { name: 'role créer inventaire Stock', checked: false },
        { name: 'role modifier inventaire Stock', checked: false },
        { name: 'role supprimer inventaire Stock', checked: false },
        { name: 'role faire inventaire Stock', checked: false },
        { name: 'role status inventaire Stock', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Compte',
      options: [
        { name: 'role avoir accès Compte', checked: false },
        { name: 'role créer compte Compte', checked: false },
        { name: 'role modifier compte Compte', checked: false },
        { name: 'role supprimer compte Compte', checked: false },
        { name: 'role detail compte Compte', checked: false },
        { name: 'role verser compte Compte', checked: false },
        { name: 'role retirer compte Compte', checked: false },
        { name: 'role supprimer versement compte Compte', checked: false },
        { name: 'role supprimer retrait compte Compte', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Utilisateur',
      options: [
        { name: 'role avoir accès Utilisateur', checked: false },
        { name: 'role avoir accès rôle et permissions Utilisateur', checked: false },
        { name: 'role créer rôle et permissions Utilisateur', checked: false },
        { name: 'role modifier rôle et permissions Utilisateur', checked: false },
        { name: 'role créer utilisateur Utilisateur', checked: false },
        { name: 'role modifier utilisateur Utilisateur', checked: false },
        { name: 'role supprimer utilisateur Utilisateur', checked: false },
        { name: 'role modifier rôle Utilisateur', checked: false },
        { name: 'role modifier mot de passe Utilisateur', checked: false },
        { name: 'role bloquer utilisateur Utilisateur', checked: false },
        { name: 'role modifier permissions utilisateur Utilisateur', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Caisse',
      options: [
        { name: 'role avoir accès Caisse', checked: false },
        { name: 'role voir total ventes Caisse', checked: false },
        { name: 'role voir total encaissements Caisse', checked: false },
        { name: 'role voir ventes encaissés Caisse', checked: false },
        { name: 'role voir total restants Caisse', checked: false },
        { name: 'role voir total remboursements Caisse', checked: false },
        { name: 'role voir dettes encaissées Caisse', checked: false },
        { name: 'role voir total frais Caisse', checked: false },
        { name: 'role voir total bénéfices Caisse', checked: false },
        { name: 'role voir total waves Caisse', checked: false },
        { name: 'role voir total caisses Caisse', checked: false },
        { name: 'role voir liste encaissements Caisse', checked: false },
        { name: 'role voir liste remboursements Caisse', checked: false },
        { name: 'role voir liste dettes payées Caisse', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Paramètre',
      options: [
        { name: 'role avoir accès Paramètre', checked: false },
        { name: 'role modifier information Paramètre', checked: false },
        { name: 'role activer desactiver maintenance Paramètre', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Corbeille',
      options: [
        { name: 'role avoir accès Corbeille', checked: false },
        { name: 'role restaurer Corbeille', checked: false },
        { name: 'role supprimer Corbeille', checked: false },
        { name: 'role vider Corbeille', checked: false },
      ],
      etat: false // pour "All"
    },

  ];

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public userService: UserService, public router: Router,
    private toastrService: ToastrService,
    public rolePermissonService: RolePermissonService, private route: ActivatedRoute) { }
  get fUpdatePasswordAdmin() { return this.formUpdatePasswordAdmin.controls; }
  get fUpdatePasswordUser() { return this.formUpdatePasswordUser.controls; }
  get fUpdate() { return this.formUpdate.controls }

  ngOnInit() {
    this.getUser();
    this.loadRoleAndPermissons();
    this.initFormUpdatePasswordAdmin();
    this.initFormUpdatePasswordUser();
    this.initFormUp();
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

  getUser() {
    if (localStorage.getItem("utilisateur") != null) {
      const data: any = localStorage.getItem('utilisateur');
      this.user = JSON.parse(data);
      this.userService.getData(this.user.id).subscribe(data => {
        let resp: any = data;
        this.permissions_user = resp.user.permissions
        this.permissions.forEach((modulePermission) => {
          modulePermission.options = modulePermission.options.map((subPermission) => {
            return {
              ...subPermission, // Conserver les autres propriétés
              name: subPermission.name.replace('role', resp.user.roles[0].name) // Remplacer 'admin' par la valeur de this.name
            };
          });
        });

        const existingPermissions = this.permissions_user; // Permissions récupérées

        // Mettre à jour l'état des permissions
        this.permissions.forEach((modulePermission) => {
          // Filtrer les permissions récupérées pour ce module
          const modulePermissions = existingPermissions.filter(
            (perm: any) => perm.module != modulePermission.module
          );

          // Mettre à jour l'état des sous-permissions (coché ou non)
          modulePermission.options.forEach((subPermission) => {
            subPermission.checked = modulePermissions.some(
              (perm: any) => perm.name === subPermission.name // Comparaison exacte
            );
          });

          // Vérifier si toutes les sous-permissions de ce module sont cochées
          modulePermission.etat = modulePermission.options.every(
            (subPermission) => subPermission.checked
          );
        });
      });
    }
  }


  // Méthode pour récupérer les role et permissons
  loadRoleAndPermissons(): void {
    this.rolePermissonService.index().subscribe(
      response => {
        let data: any = response;  // Correction de la syntaxe
        this.listeRoles = data;  // Stocker les role et permissons dans le tableau
      },
      (error) => {
        console.error('Erreur lors de la récupération des role et permissons:', error);
      }
    );
  }

  showHidePwd() {
    this.showPassword = !this.showPassword;
  }

  initFormUp() {
    this.formUpdate = new FormGroup({
      id: new FormControl(this.user.id),
      prenom: new FormControl(this.user.prenom, [Validators.required]),
      nom: new FormControl(this.user.nom, [Validators.required]),
      adresse: new FormControl(this.user.adresse),
      contact: new FormControl(this.user.contact),
      email: new FormControl(this.user.email),
      username: new FormControl(this.user.username, [Validators.required]),
      role: new FormControl(this.user.roles[0]?.id),
      auteur: new FormControl(this.userService.name)
    });
  }

  onUpdate() {
    this.userService.updateData(this.formUpdate.value).subscribe({
      next: data => {
        this.getUser();
        this.toastrService.success('Utilisateur modifié(e) !')
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  toggleAll(moduleIndex: number) {
    const module = this.permissions[moduleIndex];
    module.options.forEach((action: any) => {
      action.checked = module.etat;
    });
  }

  checkIfAllSelected(moduleIndex: number) {
    const module = this.permissions[moduleIndex];
    module.etat = module.options.every((action: any) => action.checked);
  }

  updatePermissionUser() {
    this.isDisable = true;
    this.isClick = true;

    const payload = {
      id: this.user.id,
      permissions: this.permissions
        .map(module => ({
          module: module.module,
          name: module.options.filter(action => action.checked).map(action => action.name)
        }))
        .filter(module => module.name.length > 0) // Exclure les modules sans actions sélectionnées
    };

    // Envoyer ce payload à votre backend via un service Angular HTTP
    this.userService.updateUserPermisson(payload).subscribe(
      response => {
        let resp: any = response;
        this.isDisable = false;
        this.isClick = false;
        this.getUser();
        this.refreshRoleAndPermissonsUser();
        this.toastrService.success('Les permissions de ' + resp.data.user.prenom + ' sont modifiées avec succes !');
      },
      (error) => {
        this.isDisable = false;
        this.isClick = false;
        this.toastrService.error("Erreur lors d'enregistrement d'un rôle et ces permissions veuillez réssayer svp !!!");
        console.error("Erreur lors d'enregistrement d'un rôle et ces départements:", error);
      }
    );
  }

  deleteUser(id: number) {
    this.userService.deleteData(id).subscribe(
      data => {
        localStorage.removeItem('utilisateur');
        this.toastrService.warning('Ulisateur supprimé !');
        this.router.navigate(['/utilisateur']);
      },
      error => console.log(error));
  }

  blokedUser(user: any) {
    this.userService.bloked(user).subscribe({
      next: data => {
        let resp: any = data;
        localStorage.removeItem('utilisateur');
        localStorage.setItem('utilisateur', JSON.stringify(resp));
        this.getUser();
        if (resp.blocked) {
          this.toastrService.success('Utilisateur bloqué(e) !');
        } else {
          this.toastrService.success('Utilisateur débloqué(e) !');
        }
      },
      error: err => {
        console.log(err.error.message);
      }

    });
  }

  initFormUpdatePasswordAdmin() {
    this.formUpdatePasswordAdmin = new FormGroup({
      id: new FormControl(this.user.id),
      new_password: new FormControl('', [Validators.required]),
      confirme_password: new FormControl('', [Validators.required]),
    });
  }

  initFormUpdatePasswordUser() {
    this.formUpdatePasswordUser = new FormGroup({
      id: new FormControl(this.user.id),
      old_password_user: new FormControl('', [Validators.required]),
      new_password_user: new FormControl('', [Validators.required]),
      confirme_password_user: new FormControl('', [Validators.required]),
    });
  }

  updatePasswordAdmin() {
    if (this.formUpdatePasswordAdmin.value.new_password != this.formUpdatePasswordAdmin.value.confirme_password) {
      this.msgErrorConfirme_password = 'les mots de passe saisis ne sont pas identiques';
    } else {
      this.userService.updateAdminPassword(this.formUpdatePasswordAdmin.value).subscribe({
        next: data => {
          localStorage.removeItem('utilisateur');
          localStorage.setItem('utilisateur', JSON.stringify(data));
          this.getUser();
          $('#modal-success_update_password_admin').modal('toggle');
          this.toastrService.success('Mot de passe modifié !');
        },
        error: err => {
          console.log(err.error.message);
        }

      });
    }
  }

  updatePasswordUser() {
    if (this.formUpdatePasswordUser.value.new_password_user != this.formUpdatePasswordUser.value.confirme_password_user) {
      this.msgErrorConfirme_password = 'les mots de passe saisis ne sont pas identiques';
    } else {
      this.userService.updateUserPassword(this.formUpdatePasswordUser.value).subscribe({
        next: data => {
          localStorage.removeItem('utilisateur');
          localStorage.setItem('utilisateur', JSON.stringify(data));
          this.getUser();
          $('#modal-success_update_password_user').modal('toggle');
          this.toastrService.success('Mot de passe modifié !');
        },
        error: err => {
          this.msgErrorAncien_password = err.error.message;
        }

      });
    }
  }

  onSelectFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userImg = file;

      var mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        alert('Only images are supported.');
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(this.userImg);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }

      const formData = new FormData();

      formData.append('id', JSON.stringify(this.user.id));
      formData.append('image', this.userImg);
      this.userService.updateImage(formData).subscribe(
        data => {
          localStorage.removeItem('utilisateur');
          localStorage.setItem('utilisateur', JSON.stringify(data));

          this.router.navigate(['/utilisateur-detail']);
          this.getUser();
        });
    }
  }

  onSelect() {
    $('#file').click();
  }
}

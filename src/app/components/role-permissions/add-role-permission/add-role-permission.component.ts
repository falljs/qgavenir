import { Component } from '@angular/core';
import { RolePermissonService } from '../../../services/role-permisson.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-role-permission',
  templateUrl: './add-role-permission.component.html',
  styleUrls: ['./add-role-permission.component.css']
})

export class AddRolePermissionComponent {

  isDisable: boolean = false;
  isClick: boolean = false;

  name: string = ''; // Le nom du rôle
  permissions = [

    {
      module: 'Entête',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'voir notification', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Tableau de bord',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'voir statistique', checked: false },
        { name: 'voir rapport', checked: false },
        { name: 'voir frais', checked: false },
        { name: 'créer frais', checked: false },
        { name: 'supprimer frais', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Dossier',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'encaisser', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Vente',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'voir facture', checked: false },
        { name: 'voir devis', checked: false },
        { name: 'voir bon', checked: false },
        { name: 'voir encaissement', checked: false },
        { name: 'créer facture et devis', checked: false },
        { name: 'créer bon', checked: false },
        { name: 'faire encaissement et décaissement', checked: false },
        { name: 'supprimer encaissement et décaissement', checked: false },
        { name: 'voir caisse encaissement et décaissement', checked: false },
        { name: 'modifier facture et devis', checked: false },
        { name: 'modifier bon', checked: false },
        { name: 'supprimer facture et devis', checked: false },
        { name: 'supprimer bon', checked: false },
        { name: 'annuler facture', checked: false },
        { name: 'annuler bon', checked: false },
        { name: 'convertir devis', checked: false },
        { name: 'convertir devis bon', checked: false },
        { name: 'convertir bon', checked: false },
        { name: 'régler une facture', checked: false },
        { name: 'supprimer reglement', checked: false },
        { name: 'régler un bon', checked: false },
        { name: 'faire reduction', checked: false },
        { name: 'faire remboursement', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Achat',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'créer achat', checked: false },
        { name: 'voir facture achat', checked: false },
        { name: 'modifer achat', checked: false },
        { name: 'supprimer achat', checked: false },
        { name: 'annuler achat', checked: false },
        { name: 'régler une facture', checked: false },
        { name: 'faire reduction', checked: false },
        { name: 'voir bon achat', checked: false },
        { name: 'créer bon achat', checked: false },
        { name: 'modifer bon achat', checked: false },
        { name: 'supprimer bon achat', checked: false },
        { name: 'convertir bon achat', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'CRM',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'voir client', checked: false },
        { name: 'voir fournisseur', checked: false },
        { name: 'créer client', checked: false },
        { name: 'modifier client', checked: false },
        { name: 'supprimer client', checked: false },
        { name: 'créer compte client', checked: false },
        { name: 'verser compte client', checked: false },
        { name: 'retirer compte client', checked: false },
        { name: 'supprimer versement compte client', checked: false },
        { name: 'supprimer retirait compte client', checked: false },
        { name: 'régler client', checked: false },
        { name: 'créer fournisseur', checked: false },
        { name: 'modifier fournisseur', checked: false },
        { name: 'supprimer fournisseur', checked: false },
        { name: 'régler fournisseur', checked: false },
        { name: 'créer compte fournisseur', checked: false },
        { name: 'verser compte fournisseur', checked: false },
        { name: 'retirer compte fournisseur', checked: false },
        { name: 'supprimer versement compte fournisseur', checked: false },
        { name: 'supprimer retirait compte fournisseur', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Stock',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'voir produit', checked: false },
        { name: 'voir mouvement', checked: false },
        { name: 'voir depôt', checked: false },
        { name: 'voir inventaire', checked: false },
        { name: 'créer produit', checked: false },
        { name: 'modifier produit', checked: false },
        { name: 'supprimer produit', checked: false },
        { name: 'importer produit', checked: false },
        { name: 'exporter produit', checked: false },
        { name: 'detail produit', checked: false },
        { name: 'créer mouvement', checked: false },
        { name: 'modifier mouvement', checked: false },
        { name: 'supprimer mouvement', checked: false },
        { name: 'annuler mouvement', checked: false },
        { name: 'supprimer produit depôt', checked: false },
        { name: 'créer inventaire', checked: false },
        { name: 'modifier inventaire', checked: false },
        { name: 'supprimer inventaire', checked: false },
        { name: 'faire inventaire', checked: false },
        { name: 'status inventaire', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Compte',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'créer compte', checked: false },
        { name: 'modifier compte', checked: false },
        { name: 'supprimer compte', checked: false },
        { name: 'detail compte', checked: false },
        { name: 'verser compte', checked: false },
        { name: 'retirer compte', checked: false },
        { name: 'supprimer versement compte', checked: false },
        { name: 'supprimer retrait compte', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Utilisateur',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'avoir accès rôle et permissions', checked: false },
        { name: 'créer rôle et permissions', checked: false },
        { name: 'modifier rôle et permissions', checked: false },
        { name: 'créer utilisateur', checked: false },
        { name: 'modifier utilisateur', checked: false },
        { name: 'supprimer utilisateur', checked: false },
        { name: 'modifier rôle', checked: false },
        { name: 'modifier mot de passe', checked: false },
        { name: 'bloquer utilisateur', checked: false },
        { name: 'modifier permissions utilisateur', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Caisse',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'voir total ventes', checked: false },
        { name: 'voir total encaissements', checked: false },
        { name: 'voir ventes encaissés', checked: false },
        { name: 'voir total restants', checked: false },
        { name: 'voir total remboursements', checked: false },
        { name: 'voir dettes encaissées', checked: false },
        { name: 'voir total frais', checked: false },
        { name: 'voir total bénéfices', checked: false },
        { name: 'voir total waves', checked: false },
        { name: 'voir total caisses', checked: false },
        { name: 'voir liste encaissements', checked: false },
        { name: 'voir liste remboursements', checked: false },
        { name: 'voir liste dettes payées', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Paramètre',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'modifier information', checked: false },
        { name: 'activer desactiver maintenance', checked: false },
      ],
      etat: false // pour "All"
    },
    {
      module: 'Corbeille',
      options: [
        { name: 'avoir accès', checked: false },
        { name: 'restaurer', checked: false },
        { name: 'supprimer', checked: false },
        { name: 'vider', checked: false },
      ],
      etat: false // pour "All"
    },
  ];

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public rolePermissonService: RolePermissonService, public router: Router,
    public userService: UserService, public toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
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

  toggleAll(moduleIndex: number) {
    const module = this.permissions[moduleIndex];
    module.options.forEach(action => {
      action.checked = module.etat;
    });
  }

  checkIfAllSelected(moduleIndex: number) {
    const module = this.permissions[moduleIndex];
    module.etat = module.options.every(action => action.checked);
  }

  saveRole() {
    this.isDisable = true;
    this.isClick = true;
    if (!this.name.trim()) {
      console.error('Le nom du rôle est requis');
      return;
    }

    const payload = {
      name: this.name,
      permissions: this.permissions
        .map(module => ({
          module: module.module,
          name: module.options.filter(action => action.checked).map(action => action.name)
        }))
        .filter(module => module.name.length > 0) // Exclure les modules sans actions sélectionnées
    };

    //console.log('Payload:', payload);
    // Envoyer ce payload à votre backend via un service Angular HTTP
    this.rolePermissonService.store(payload).subscribe(
      response => {
        let data: any = response;  // Correction de la syntaxe
        this.router.navigate(['/role-permission']);
        this.toastrService.success('role ' + this.name + ' ajouté avec ces permisssions ');
      },
      (error) => {
        this.isDisable = false;
        this.isClick = false;
        this.toastrService.error("Erreur lors d'enregistrement d'un rôle et ces permissions veuillez réssayer svp !!!");
        console.error("Erreur lors d'enregistrement d'un rôle et ces départements:", error);
      }
    );
  }



}

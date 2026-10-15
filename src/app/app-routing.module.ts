import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { GuestService } from './services/guest.service';
import { DossierComponent } from './components/dossiers/dossier/dossier.component';
import { VenteComponent } from './components/ventes/vente/vente.component';
import { TicketComponent } from './components/ventes/ticket/ticket.component';
import { DevisComponent } from './components/Devis/devi/devis.component';
import { ProduitComponent } from './components/produit/produit.component';
import { ClientComponent } from './components/clients/client/client.component';
import { UtilisateurComponent } from './components/utilisateurs/utilisateur/utilisateur.component';
import { DetailComponent } from './components/dossiers/detail/detail.component';
import { DetailClientComponent } from './components/clients/detail-client/detail-client.component';
import { DetailUtilsateurComponent } from './components/utilisateurs/detail-utilsateur/detail-utilsateur.component';
import { EditCommandeComponent } from './components/ventes/edit-commande/edit-commande.component';
import { DetailCommandeComponent } from './components/ventes/detail-commande/detail-commande.component';
import { ParametreComponent } from './components/parametre/parametre.component';
import { CaisseComponent } from './components/caisse/caisse.component';
import { DevisDetailComponent } from './components/Devis/devis-detail/devis-detail.component';
import { DevisEditComponent } from './components/Devis/devis-edit/devis-edit.component';
import { DevisNouveauComponent } from './components/Devis/devis-nouveau/devis-nouveau.component';
import { CompteComponent } from './components/compte/compte.component';
import { FraisComponent } from './components/frais/frais.component';
import { CreateBonComponent } from './components/bons/create-bon/create-bon.component';
import { EditBonComponent } from './components/bons/edit-bon/edit-bon.component';
import { DetailBonComponent } from './components/bons/detail-bon/detail-bon.component';
import { ConvertBonComponent } from './components/bons/convert-bon/convert-bon.component';
import { ListBonComponent } from './components/bons/list-bon/list-bon.component';
import { RapportComponent } from './components/rapport/rapport.component';
import { PrintTicketComponent } from './components/printTicket/printTicket.component';
import { ListAchatComponent } from './components/achats/list-achat/list-achat.component';
import { CreateAchatComponent } from './components/achats/create-achat/create-achat.component';
import { DetailAchatComponent } from './components/achats/detail-achat/detail-achat.component';
import { FournisseurComponent } from './components/fournisseurs/fournisseur/fournisseur.component';
import { Depot_I_Component } from './components/depot I/depot_I.component';
import { Depot_II_Component } from './components/depot II/depot_II.component';
import { MouvementNewComponent } from './components/mouvements/mouvement-new/mouvement-new.component';
import { ListMouvementComponent } from './components/mouvements/mouvement-list/mouvement-list.component';
import { MouvementDetailComponent } from './components/mouvements/mouvement-detail/mouvement-detail.component';
import { MouvementEditComponent } from './components/mouvements/mouvement-edit/mouvement-edit.component';
import { EditAchatComponent } from './components/achats/edit-achat/edit-achat.component';
import { NotificationComponent } from './components/notification/notification.component';
import { EncaissementComponent } from './components/encaissement/encaissement.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { DetteComponent } from './components/dette/dette.component';
import { InventaireComponent } from './components/inventaires/inventaire/inventaire.component';
import { InventairesComponent } from './components/inventaires/inventaires/inventaires.component';
import { AddRolePermissionComponent } from './components/role-permissions/add-role-permission/add-role-permission.component';
import { EditRolePermissionComponent } from './components/role-permissions/edit-role-permission/edit-role-permission.component';
import { RolePermissionComponent } from './components/role-permissions/role-permission/role-permission.component';
import { DetailInventairesComponent } from './components/inventaires/detail-inventaires/detail-inventaires.component';
import { PermissionGuard } from './services/permissionGuard.service';
import { DetailFournisseurComponent } from './components/fournisseurs/detail-fournisseur/detail-fournisseur.component';
import { ListBonAchatComponent } from './components/bonsAchat/list-bon-achat/list-bon-achat.component';
import { DetailBonAchatComponent } from './components/bonsAchat/detail-bon-achat/detail-bon-achat.component';
import { EditBonAchatComponent } from './components/bonsAchat/edit-bon-achat/edit-bon-achat.component';
import { CorbeilleComponent } from './components/corbeille/corbeille.component';
import { PrintEncaissementComponent } from './components/printEncaissement/printEncaissement.component';

const appRroutes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [AuthService], children: [
      { path: '', redirectTo: 'vente', pathMatch: 'full' },
      { path: 'accueil', component: DashboardComponent },
      { path: 'parametre', component: ParametreComponent },
      { path: 'corbeille', component: CorbeilleComponent, canActivate: [PermissionGuard], data: { permission: ' avoir accès Corbeille' } },

      { path: 'dossier', component: DossierComponent, canActivate: [PermissionGuard], data: { permission: ' avoir accès Dossier' } },
      { path: 'dossier-detail', component: DetailComponent },

      { path: 'vente', component: VenteComponent, canActivate: [PermissionGuard], data: { permission: ' créer facture et devis Vente' } },
      { path: 'commande-edit', component: EditCommandeComponent },
      { path: 'commande-detail', component: DetailCommandeComponent },
      { path: 'ticket', component: TicketComponent, canActivate: [PermissionGuard], data: { permission: ' voir facture Vente' } },

      { path: 'caisse', component: CaisseComponent, canActivate: [PermissionGuard], data: { permission: ' avoir accès Caisse' } },

      { path: 'devis', component: DevisComponent, canActivate: [PermissionGuard], data: { permission: ' voir devis Vente' } },
      { path: 'devis-nouveau', component: DevisNouveauComponent },
      { path: 'devis-detail', component: DevisDetailComponent },
      { path: 'devis-edit', component: DevisEditComponent },

      { path: 'compte', component: CompteComponent, canActivate: [PermissionGuard], data: { permission: ' avoir accès Compte' } },
      { path: 'frais', component: FraisComponent, canActivate: [PermissionGuard], data: { permission: ' voir frais Tableau de bord' } },
      { path: 'rapport', component: RapportComponent, canActivate: [PermissionGuard], data: { permission: ' voir rapport Tableau de bord' } },

      { path: 'produit', component: ProduitComponent, canActivate: [PermissionGuard], data: { permission: ' voir produit Stock' } },

      { path: 'client', component: ClientComponent, canActivate: [PermissionGuard], data: { permission: ' voir client CRM' } },
      { path: 'client-detail', component: DetailClientComponent },

      { path: 'utilisateur', component: UtilisateurComponent, canActivate: [PermissionGuard], data: { permission: ' avoir accès Utilisateur' } },
      { path: 'utilisateur-detail', component: DetailUtilsateurComponent },

      { path: 'bon-nouveau', component: CreateBonComponent, canActivate: [PermissionGuard], data: { permission: ' créer bon Vente' } },
      { path: 'bon-edit', component: EditBonComponent },
      { path: 'bon-detail', component: DetailBonComponent },
      { path: 'bon-commande', component: ConvertBonComponent, canActivate: [PermissionGuard], data: { permission: ' convertir bon Vente' } },
      { path: 'bon', component: ListBonComponent, canActivate: [PermissionGuard], data: { permission: ' voir bon Vente' } },

      { path: 'fournisseur', component: FournisseurComponent, canActivate: [PermissionGuard], data: { permission: ' voir fournisseur CRM' } },
      { path: 'fournisseur-detail', component: DetailFournisseurComponent },

      { path: 'achat', component: ListAchatComponent, canActivate: [PermissionGuard], data: { permission: ' voir facture achat Achat' } },
      { path: 'achat-nouveau', component: CreateAchatComponent, canActivate: [PermissionGuard], data: { permission: ' créer achat Achat' } },
      { path: 'achat-detail', component: DetailAchatComponent },
      { path: 'achat-edit', component: EditAchatComponent },

      { path: 'bon-achat', component: ListBonAchatComponent, canActivate: [PermissionGuard], data: { permission: ' voir bon achat Achat' } },
      { path: 'bon-achat-detail', component: DetailBonAchatComponent },
      { path: 'bon-achat-edit', component: EditBonAchatComponent },

      { path: 'depot_I', component: Depot_I_Component, canActivate: [PermissionGuard], data: { permission: ' voir depôt Stock' } },
      { path: 'depot_II', component: Depot_II_Component },

      { path: 'mouvement-new', component: MouvementNewComponent, canActivate: [PermissionGuard], data: { permission: ' créer mouvement Stock' } },
      { path: 'mouvement-list', component: ListMouvementComponent, canActivate: [PermissionGuard], data: { permission: ' voir mouvement Stock' } },
      { path: 'mouvement-detail', component: MouvementDetailComponent },
      { path: 'mouvement-edit', component: MouvementEditComponent },

      { path: 'notifications', component: NotificationComponent, canActivate: [PermissionGuard], data: { permission: ' voir notification Entête' } },
      { path: 'encaissement', component: EncaissementComponent, canActivate: [PermissionGuard], data: { permission: ' voir encaissement Vente' } },
      { path: 'dette', component: DetteComponent, canActivate: [PermissionGuard], data: { permission: ' voir notification Entête' } },

      { path: 'inventaire', component: InventaireComponent, canActivate: [PermissionGuard], data: { permission: ' detail produit Stock' } },
      { path: 'inventaires', component: InventairesComponent, canActivate: [PermissionGuard], data: { permission: ' voir inventaire Stock' } },
      { path: 'detail-inventaires', component: DetailInventairesComponent },

      { path: 'add-role-permission', component: AddRolePermissionComponent, canActivate: [PermissionGuard], data: { permission: ' créer rôle et permissions Utilisateur' } },
      { path: 'edit-role-permission', component: EditRolePermissionComponent },
      { path: 'role-permission', component: RolePermissionComponent, canActivate: [PermissionGuard], data: { permission: ' avoir accès rôle et permissions Utilisateur' } },
    ]
  },
  { path: 'login', component: LoginComponent, canActivate: [GuestService] },
  { path: 'print-ticket', component: PrintTicketComponent },
  { path: 'print-encaissement', component: PrintEncaissementComponent },
  { path: 'maintenance', component: MaintenanceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRroutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

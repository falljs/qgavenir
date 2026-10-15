import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { DossierComponent } from './components/dossiers/dossier/dossier.component';
import { VenteComponent } from './components/ventes/vente/vente.component';
import { TicketComponent } from './components/ventes/ticket/ticket.component';
import { DevisComponent } from './components/Devis/devi/devis.component';
import { ProduitComponent } from './components/produit/produit.component';
import { ClientComponent } from './components/clients/client/client.component';
import { UtilisateurComponent } from './components/utilisateurs/utilisateur/utilisateur.component';
import { DetailComponent } from './components/dossiers/detail/detail.component';
import { ToastrModule } from 'ngx-toastr';
import { DetailClientComponent } from './components/clients/detail-client/detail-client.component';
import { DetailUtilsateurComponent } from './components/utilisateurs/detail-utilsateur/detail-utilsateur.component';
import { AngularSplitModule } from 'angular-split';
import { EditCommandeComponent } from './components/ventes/edit-commande/edit-commande.component';
import { DetailCommandeComponent } from './components/ventes/detail-commande/detail-commande.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { ParametreComponent } from './components/parametre/parametre.component';
import { CaisseComponent } from './components/caisse/caisse.component';
import { DevisNouveauComponent } from './components/Devis/devis-nouveau/devis-nouveau.component';
import { DevisDetailComponent } from './components/Devis/devis-detail/devis-detail.component';
import { DevisEditComponent } from './components/Devis/devis-edit/devis-edit.component';
import { CompteComponent } from './components/compte/compte.component';
import { FraisComponent } from './components/frais/frais.component';
import { CreateBonComponent } from './components/bons/create-bon/create-bon.component';
import { EditBonComponent } from './components/bons/edit-bon/edit-bon.component';
import { DetailBonComponent } from './components/bons/detail-bon/detail-bon.component';
import { ConvertBonComponent } from './components/bons/convert-bon/convert-bon.component';
import { ListBonComponent } from './components/bons/list-bon/list-bon.component';
import { RapportComponent } from './components/rapport/rapport.component';
import { PrintTicketComponent } from './components/printTicket/printTicket.component';
import { AddRecuComponent } from './components/achats/add-recu/add-recu.component';
import { DetailAchatComponent } from './components/achats/detail-achat/detail-achat.component';
import { CreateAchatComponent } from './components/achats/create-achat/create-achat.component';
import { ListAchatComponent } from './components/achats/list-achat/list-achat.component';
import { FournisseurComponent } from './components/fournisseurs/fournisseur/fournisseur.component';
import { Depot_I_Component } from './components/depot I/depot_I.component';
import { Depot_II_Component } from './components/depot II/depot_II.component';
import { ListMouvementComponent } from './components/mouvements/mouvement-list/mouvement-list.component';
import { MouvementNewComponent } from './components/mouvements/mouvement-new/mouvement-new.component';
import { MouvementEditComponent } from './components/mouvements/mouvement-edit/mouvement-edit.component';
import { MouvementDetailComponent } from './components/mouvements/mouvement-detail/mouvement-detail.component';
import { EditAchatComponent } from './components/achats/edit-achat/edit-achat.component';
import { NgChartsModule } from 'ng2-charts';
import { MenuVenteComponent } from './components/segments/menu-vente/menu-vente.component';
import { MenuAchatComponent } from './components/segments/menu-achat/menu-achat.component';
import { NotificationComponent } from './components/notification/notification.component';
import { EncaissementComponent } from './components/encaissement/encaissement.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { MenuDetteComponent } from './components/segments/menu-dette/menu-dette.component';
import { DetteComponent } from './components/dette/dette.component';
import { InventairesComponent } from './components/inventaires/inventaires/inventaires.component';
import { InventaireComponent } from './components/inventaires/inventaire/inventaire.component';
import { RolePermissionComponent } from './components/role-permissions/role-permission/role-permission.component';
import { EditRolePermissionComponent } from './components/role-permissions/edit-role-permission/edit-role-permission.component';
import { AddRolePermissionComponent } from './components/role-permissions/add-role-permission/add-role-permission.component';
import { MenuCRMComponent } from './components/segments/menu-crm/menu-crm.component';
import { MenuStockComponent } from './components/segments/menu-stock/menu-stock.component';
import { MenuDashboardComponent } from './components/segments/menu-dashboard/menu-dashboard.component';
import { DetailInventairesComponent } from './components/inventaires/detail-inventaires/detail-inventaires.component';
import { MenuUtilisateurComponent } from './components/segments/menu-utilisateur/menu-utilisateur.component';
import { DetailFournisseurComponent } from './components/fournisseurs/detail-fournisseur/detail-fournisseur.component';
import { ListBonAchatComponent } from './components/bonsAchat/list-bon-achat/list-bon-achat.component';
import { EditBonAchatComponent } from './components/bonsAchat/edit-bon-achat/edit-bon-achat.component';
import { DetailBonAchatComponent } from './components/bonsAchat/detail-bon-achat/detail-bon-achat.component';
import { CorbeilleComponent } from './components/corbeille/corbeille.component';
import { PrintEncaissementComponent } from './components/printEncaissement/printEncaissement.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LayoutComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    DossierComponent,
    VenteComponent,
    TicketComponent,
    DevisComponent,
    ProduitComponent,
    ClientComponent,
    UtilisateurComponent,
    DetailComponent,
    DetailClientComponent,
    DetailUtilsateurComponent,
    EditCommandeComponent,
    DetailCommandeComponent,
    ParametreComponent,
    CaisseComponent,
    DevisNouveauComponent,
    DevisDetailComponent,
    DevisEditComponent,
    PrintTicketComponent,
    CreateBonComponent,
    EditBonComponent,
    DetailBonComponent,
    ConvertBonComponent,
    ListBonComponent,
    CompteComponent,
    FraisComponent,
    RapportComponent,
    AddRecuComponent,
    DetailAchatComponent,
    CreateAchatComponent,
    EditAchatComponent,
    ListAchatComponent,
    FournisseurComponent,
    Depot_I_Component,
    Depot_II_Component,
    ListMouvementComponent,
    MouvementNewComponent,
    MouvementEditComponent,
    MouvementDetailComponent,
    DetteComponent,
    MenuVenteComponent,
    MenuAchatComponent,
    NotificationComponent,
    EncaissementComponent,
    PrintEncaissementComponent,
    MaintenanceComponent,
    MenuDetteComponent,
    InventairesComponent,
    InventaireComponent,
    RolePermissionComponent,
    EditRolePermissionComponent,
    AddRolePermissionComponent,
    MenuCRMComponent,
    MenuStockComponent,
    MenuDashboardComponent,
    DetailInventairesComponent,
    MenuUtilisateurComponent,
    DetailFournisseurComponent,
    ListBonAchatComponent,
    EditBonAchatComponent,
    DetailBonAchatComponent,
    CorbeilleComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularSplitModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgChartsModule,
    ToastrModule.forRoot(), // ToastrModule added
    //PdfViewerModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

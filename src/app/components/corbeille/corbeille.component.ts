import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CorbeilleService } from 'src/app/services/corbeille.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-corbeille',
  templateUrl: './corbeille.component.html',
  styleUrls: ['./corbeille.component.scss']
})
export class CorbeilleComponent implements OnInit {

  commandes: any;
  devis: any;
  bons: any;
  achats: any;
  bonAchats: any;
  produits: any;
  mouvements: any;
  inventaires: any;
  comptes: any;
  utilisateurs: any;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public userService: UserService, public toastrService: ToastrService,
    public router: Router, public corbeilleService: CorbeilleService,) { }

  ngOnInit(): void {
    this.refreshRoleAndPermissonsUser();
    // Vérifier si les rôles existent dans l'utilisateur
    if (this.userService.user.roles && this.userService.user.roles.length > 0) {
      // Extraire le nom du premier rôle
      this.firstRoleName = this.userService.user.roles[0].name;
    }
    this.getAll();
  }

  refreshRoleAndPermissonsUser(): void {
    this.userService.refreshRoleAndPermissonsUser(this.userService.user.id).subscribe(data => {
      let resp: any = data;
      this.userService.user.permissions = resp.user.permissions;
      this.userService.setRoles(resp.user.roles);
    });
  }

  getAll() {
    this.corbeilleService.getAll().subscribe(data => {
      let resp: any = data;
      this.commandes = resp.commandes;
      this.devis = resp.devis;
      this.bons = resp.bons;
      this.achats = resp.achats;
      this.bonAchats = resp.bonAchats;
      this.produits = resp.produits;
      this.mouvements = resp.mouvements;
      this.inventaires = resp.inventaires;
      this.comptes = resp.comptes;
      this.utilisateurs = resp.utilisateurs;
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode Commande ******************************************************/

  // supprimer une commande
  deleteCommande(commande: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive cette commande ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteCommande(commande.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Commande ' + commande.numero + ' est suppriméé avec success');
            Swal.fire({
              title: "Suppression de commande !",
              text: "supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer une commande
  restaurerCommande(commande: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer cette commande ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreCommande(commande.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Commande ' + commande.numero + ' est restaurée avec success');
            Swal.fire({
              title: "Restaurer une commande !",
              text: "restaurer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer toutes les commandes
  viderCorbeilleCommande() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderCommande().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider toutes les commandes !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode Devis ******************************************************/

  // supprimer un devis
  deleteDevis(devis: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive ce devis ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteDevis(devis.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Devis ' + devis.numero + ' est supprimé avec success');
            Swal.fire({
              title: "Suppression d'un devis !",
              text: "supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer un devis
  restaurerDevis(devis: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer ce devis ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreDevis(devis.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Devis ' + devis.numero + ' est restauré avec success');
            Swal.fire({
              title: "Restaurer un devis !",
              text: "restaurer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer tous les devis
  viderCorbeilleDevis() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderDevis().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider tous les devis !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de suppression :', err);
          },
        });
      }
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode Bon ******************************************************/

  // supprimer un bon
  deleteBon(bon: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive ce bon ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteBon(bon.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Bon ' + bon.numero + ' est supprimé avec success');
            Swal.fire({
              title: "Suppression d'un bon !",
              text: "Supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer un bon
  restaurerBon(bon: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer ce bon ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreBon(bon.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Bon ' + bon.numero + ' est restauré avec success');
            Swal.fire({
              title: "Restaurer un bon !",
              text: "restaurer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer tous les bons
  viderCorbeilleBon() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderBon().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider tous les devis !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de suppression :', err);
          },
        });
      }
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode Achat ******************************************************/

  // supprimer un achat
  deleteAchat(achat: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive cet achat ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteAchat(achat.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Achat ' + achat.numero + ' est supprimé avec success');
            Swal.fire({
              title: "Suppression d'un achat !",
              text: "Supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer un achat
  restaurerAchat(achat: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer cette achat ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreAchat(achat.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Achat ' + achat.numero + ' est restauré avec success');
            Swal.fire({
              title: "Restaurer un achat !",
              text: "restaurer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer tous les achats
  viderCorbeilleAchat() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderAchat().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider tous les achats !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de suppression :', err);
          },
        });
      }
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode Bon Achat ******************************************************/

  // supprimer un bon d'achat
  deleteBonAchat(bonAchat: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive ce bon d'achat ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteBonAchat(bonAchat.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Bon Achat ' + bonAchat.numero + ' est supprimé avec success');
            Swal.fire({
              title: "suppression d'un bon d'achat !",
              text: "Supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer un bon d'achat
  restaurerBonAchat(bonAchat: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer ce bon d'achat ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreBonAchat(bonAchat.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Bon achat ' + bonAchat.numero + ' est restauré avec success');
            Swal.fire({
              title: "Restaurer un bon d'achat !",
              text: "restaurer.",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer tous les bons d'achats
  viderCorbeilleBonAchat() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderBonAchat().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider tous les bons d'achats !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode Produit ******************************************************/

  // supprimer un produit
  deleteProduit(produit: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive ce produit ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteProduit(produit.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Produit ' + produit.designation + ' est supprimé avec success');
            Swal.fire({
              title: "suppression d'un produit !",
              text: "Supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer un produit
  restaurerProduit(produit: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer ce produit ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreProduit(produit.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Produit ' + produit.designation + ' est restauré avec success');
            Swal.fire({
              title: "Restaurer un produit !",
              text: "restaurer.",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer tous les produits
  viderCorbeilleProduit() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderProduit().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider tous les produits !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode Mouvement ******************************************************/

  // supprimer un mouvement
  deleteMouvement(mouvement: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive ce mouvement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteMouvement(mouvement.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Mouvement ' + mouvement.numero + ' est supprimé avec success');
            Swal.fire({
              title: "suppression d'un mouvement !",
              text: "Supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer un mouvement
  restaurerMouvement(mouvement: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer ce mouvement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreMouvement(mouvement.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Mouvement ' + mouvement.numero + ' est restauré avec success');
            Swal.fire({
              title: "Restaurer un mouvement !",
              text: "restaurer.",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer tous les mouvements
  viderCorbeilleMouvement() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderMouvement().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider tous les mouvements !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode Inventaire ******************************************************/

  // supprimer un inventaire
  deleteInventaire(inventaire: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive cet inventaire ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteInventaire(inventaire.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Inventaire ' + inventaire.numero + ' est supprimé avec success');
            Swal.fire({
              title: "suppression d'un inventaire !",
              text: "Supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer un inventaire
  restaurerInventaire(inventaire: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer ce mouvement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreInventaire(inventaire.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Inventaire ' + inventaire.numero + ' est restauré avec success');
            Swal.fire({
              title: "Restaurer un inventaire !",
              text: "restaurer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer tous les inventaires
  viderCorbeilleInventaire() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderInventaire().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider tous les inventaires !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode Compte ******************************************************/

  // supprimer un compte
  deleteCompte(compte: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive ce compte ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteCompte(compte.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Compte ' + compte.owner + ' est supprimé avec success');
            Swal.fire({
              title: "suppression d'un compte !",
              text: "Supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer un compte
  restaurerCompte(compte: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer ce compte ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreCompte(compte.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Compte ' + compte.numero + ' est restauré avec success');
            Swal.fire({
              title: "Restaurer un compte !",
              text: "restaurer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer tous les comptes
  viderCorbeilleCompte() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderCompte().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider tous les comptes !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  /**********************************************************************************************************
    *********************************************************************************************************
    ******************************** Methode User ******************************************************/

  // supprimer un utilisateur
  deleteUser(user: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir supprimer de façon définitive cet utilisateur ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.deleteUser(user.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Utilisateur ' + user.prenom + ' ' + user.nom + ' est supprimé avec success');
            Swal.fire({
              title: "suppression d'un utilisateur !",
              text: "Supprimer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }

  // restaurer un utilisateur
  restaurerUser(user: any) {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir restaurer cet utilisateur ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.restoreUser(user.id).subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('Utilisateur ' + user.prenom + ' ' + user.nom + ' est restauré avec success');
            Swal.fire({
              title: "Restaurer un utilisateur !",
              text: "restaurer",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la restauration :', err);
          },
        });
      }
    });
  }

  // supprimer tous les utilisateurs
  viderCorbeilleUser() {
    // Appelle le service pour envoyer les données
    Swal.fire({
      title: "Êtes-vous sûr",
      text: "de vouloir vider toute la corbeille ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E40000FF",
      cancelButtonColor: "#3BD630FF",
      confirmButtonText: "Oui",
      cancelButtonText: "Non"
    }).then((result) => {
      if (result.isConfirmed) {
        this.corbeilleService.viderUser().subscribe({
          next: (response) => {
            this.getAll();
            this.toastrService.success('La corbeille a été vidée avec succès.');
            Swal.fire({
              title: "Vider tous les utilisateurs !",
              text: "Vider",
              icon: "success"
            });
          },
          error: (err) => {
            this.toastrService.success('Erreur lors du traitement');
            console.error('Erreur lors de la suppression :', err);
          },
        });
      }
    });
  }


}

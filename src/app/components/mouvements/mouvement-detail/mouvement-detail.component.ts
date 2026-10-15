import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { ProduitService } from 'src/app/services/produit.service';
import { CommandeService } from 'src/app/services/commande.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mouvement-detail',
  templateUrl: './mouvement-detail.component.html',
  styleUrls: ['./mouvement-detail.component.scss']
})
export class MouvementDetailComponent implements OnInit {

  // Disabled btn
  disableBtn: boolean = false;

  mouvement!: any;
  ligneMouvement!: any[];

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public router: Router, public commandeService: CommandeService,
    public userService: UserService, public produitService: ProduitService,
    private datePipe: DatePipe, public toastrService: ToastrService) { }
  ngOnInit() {
    this.getMouvement();
    this.userService.getUserLoggin();
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

  getMouvement() {
    if (localStorage.getItem('mouvement') != null) {
      this.mouvement = JSON.parse(localStorage.getItem('mouvement')!);
      this.ligneMouvement = JSON.parse(localStorage.getItem('ligneMouvementDetail')!);
    }
  }

  printMouvenement(mouvement: any) {
    this.commandeService.onPrint().subscribe((data) => {
      //let response: any = data;
      window.open('https://www.qg-avenir.iconestock.com/server/public/print/mouvement/numero/' + mouvement.numero, "_blank");
    });
  }

  modifier(commande: any) {
    localStorage.removeItem('mouvement');
    localStorage.removeItem('ligneMouvement');
    localStorage.removeItem('ligneMouvementDetail');
    localStorage.setItem('mouvement', JSON.stringify(commande));
    localStorage.setItem('ligneMouvement', JSON.stringify(this.ligneMouvement));
    this.router.navigate(['/mouvement-edit']);
  }



  deleteMouvement(id: any) {
    if (this.mouvement.type == 'Stock => Depôt') {
      this.produitService.deleteMouvementStock(id).subscribe((data: any) => {
        this.toastrService.warning('Mouvement supprimé !');
        localStorage.removeItem('mouvement');
        localStorage.removeItem('ligneMouvementDetail');
        this.router.navigate(['/mouvement-list']);
      });
    } else {
      this.produitService.deleteMouvementDepot(id).subscribe((data: any) => {
        this.toastrService.warning('Mouvement supprimé !');
        localStorage.removeItem('mouvement');
        localStorage.removeItem('ligneMouvementDetail');
        this.router.navigate(['/mouvement-list']);
      });
    }
  }


  annulerMouvement(id: any) {
    if (this.mouvement.type == 'Stock => Depôt') {
      this.produitService.cancelMouvementStock(id).subscribe((data: any) => {
        this.toastrService.warning('Mouvement annulé !');
        localStorage.removeItem('mouvement');
        localStorage.removeItem('ligneMouvementDetail');
        this.router.navigate(['/mouvement-list']);
      });
    } else {
      this.produitService.cancelMouvementDepot(id).subscribe((data: any) => {
        this.toastrService.warning('Mouvement annulé !');
        localStorage.removeItem('mouvement');
        localStorage.removeItem('ligneMouvementDetail');
        this.router.navigate(['/mouvement-list']);
      });
    }
  }


}

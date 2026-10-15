import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { UserService } from 'src/app/services/user.service';
import { EncaissementService } from 'src/app/services/encaissement.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
declare var $: any;

@Component({
  selector: 'app-encaissement',
  templateUrl: './encaissement.component.html',
  styleUrls: ['./encaissement.component.scss']
})
export class EncaissementComponent implements OnInit {

  @ViewChild('designationInputMotif') designationInputMotif!: ElementRef;
  @ViewChild('designationInputClient') designationInputClient!: ElementRef;

  //keyboard buttons
  keyEnter: any = 13;
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === this.keyEnter) {
      if (this.client == null && this.montant == null) {

      } else {
        //this.keyEnter = null;
        this.save();
      }

      if (this.motif == null && this.montant == null) {

      } else {
        //this.keyEnter = null;
        this.save_decaissement();
      }
    }
  }

  client: any = null;
  motif: any = null;
  montant: any = 0;
  total: any = 0;

  montantTotal_encaissement = 0;
  montantTotal_decaissement = 0;

  listEncaissements: any[] = [];
  listDecaissements: any[] = [];

  id_encaissement!: number;
  id_decaissement!: number;

  firstRoleName: string | null = null; // Contiendra le premier nom de rôle

  constructor(public encaissementService: EncaissementService, public userService: UserService,
    public toastrService: ToastrService, public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.encaissementToday();
    this.decaissementToday();
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

  valide(id: any) {
    var data = {
      id: id,
      etat: 'valide',
    };
    this.encaissementService.valide(data).subscribe(
      data => {
        this.encaissementToday();
        this.decaissementToday();
      });
  }

  invalide(id: any) {
    var data = {
      id: id,
      etat: 'invalide',
    };
    this.encaissementService.invalide(data).subscribe(
      data => {
        this.encaissementToday();
        this.decaissementToday();
      });
  }

  encaissements() {
    this.encaissementService.getEncaissemants().subscribe(
      data => {
        var response: any = data;
        this.listEncaissements = response.encaissements;
        this.montantTotal_encaissement = response.total;
      });
  }

  decaissements() {
    this.encaissementService.getDecaissemants().subscribe(
      data => {
        var response: any = data;
        this.listDecaissements = response.decaissements;
        this.montantTotal_decaissement = response.total;
      });
  }

  OnChangeDate(ctrl: any) {
    let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
    this.encaissementService.getEncaissemantsByDate(date).subscribe(
      data => {
        var response: any = data;
        this.listEncaissements = response.encaissements;
        this.montantTotal_encaissement = response.total;
      });
  }

  OnChangeDate_decaissement(ctrl: any) {
    let date = this.datePipe.transform(ctrl.value, 'dd-MM-yyyy');
    this.encaissementService.getDecaissemantsByDate(date).subscribe(
      data => {
        var response: any = data;
        this.listDecaissements = response.decaissements;
        this.montantTotal_decaissement = response.total;
      });
  }

  encaissementToday() {
    this.encaissementService.getEncaissemantsToday().subscribe(
      data => {
        var response: any = data;
        this.listEncaissements = response.encaissements;
        this.montantTotal_encaissement = response.total;
      });
  }

  decaissementToday() {
    this.encaissementService.getDecaissemantsToday().subscribe(
      data => {
        var response: any = data;
        this.listDecaissements = response.decaissements;
        this.montantTotal_decaissement = response.total;
      });
  }

  // Print Ticket encaissement
  print(encaissement: any) {
    localStorage.removeItem('print-encaissement')
    localStorage.setItem('print-encaissement', JSON.stringify(encaissement));
    window.open('/#/print-encaissement', "_blank");
  };

  // Print Ticket decaissement
  print_decaissement(decaissement: any) {
    localStorage.removeItem('print-decaissement')
    localStorage.setItem('print-decaissement', JSON.stringify(decaissement));
    window.open('/#/print-decaissement', "_blank");
  };

  openModalDelete(id: number) {
    this.id_encaissement = id;
  }

  openModalDelete_decaissement(id: number) {
    this.id_decaissement = id;
  }

  delete() {
    this.encaissementService.deleteData(this.id_encaissement).subscribe({
      next: data => {
        this.encaissementToday();
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  delete_decaissement() {
    this.encaissementService.deleteData_decaisse(this.id_decaissement).subscribe({
      next: data => {
        this.decaissementToday();
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  save() {
    var data = {
      montant: this.montant,
      client: this.client,
      auteur: this.userService.name,
    };
    //console.log(data);
    this.encaissementService.createData(data).subscribe({
      next: data => {
        this.montant = 0;
        this.client = null;
        this.encaissementToday();
        this.designationInputClient.nativeElement.focus();
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

  save_decaissement() {
    var data = {
      montant: this.montant,
      motif: this.motif,
      auteur: this.userService.name,
    };
    //console.log(data);
    this.encaissementService.createData_decaisse(data).subscribe({
      next: data => {
        this.montant = 0;
        this.client = null;
        this.decaissementToday();
        this.designationInputMotif.nativeElement.focus();
      },
      error: err => {
        console.log(err.error.message);
      }
    });
  }

}

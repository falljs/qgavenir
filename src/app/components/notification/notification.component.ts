import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommandeService } from 'src/app/services/commande.service';
import { NotificationService } from 'src/app/services/notification.service';
declare var $: any;

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {

  page: number = 1;
  nbrCompte: number = 0;
  defaultItem: number = 4;
  comptes!: any[];
  filteredNotifications: any[] = [];
  searchTerm: string = '';
  private searchSubject: Subject<string> = new Subject<string>();

  constructor(public notificationService: NotificationService, public commandeService: CommandeService) { }

  ngOnInit(): void {
    this.getNotifications();
  }

  //Get All notifs
  getNotifications() {
    // Récupérer les notifications au démarrage
    this.notificationService.getAllNotifications().subscribe(
      (data) => {
        this.comptes = data.notifications;
        this.filteredNotifications = this.comptes; // Initialiser le tableau filtré
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications :', error);
      }
    );
  }

  onNotificationClick(notification: any): void {
    // Marquer la notification comme envoyée
    this.notificationService.markAsSent(notification.id).subscribe((res) => {
      let data: any = res;
      // Passer l'id de la commande à la méthode detail
      this.getNotifications();
      this.commandeService.detail(data.order);
    });
  }

  // Filtrer les notifications dynamiquement
  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredNotifications = this.comptes.filter((notif) =>
      notif.message.toLowerCase().includes(term) ||
      notif.order.numero.toLowerCase().includes(term) ||
      notif.order.nom_client.toLowerCase().includes(term)
    );
  }

}
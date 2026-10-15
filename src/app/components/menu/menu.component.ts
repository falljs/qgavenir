import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommandeService } from 'src/app/services/commande.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NetworkService } from 'src/app/services/network.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ParametreService } from 'src/app/services/parametre.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
declare var $: any;

const SIDEBAR_STATE_KEY = 'icn-sidebar-collapsed';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  userName: string = '';
  role: string = '';

  notifications: any[] = [];
  total_pending: number = 0;

  isLoading = true;
  error: string = '';

  result: string = '';

  firstRoleName: string | null = null;

  // ===============================
  // MENU MODERNE
  // ===============================
  sidebarCollapsed = false;
  mobileMenuOpen = false;

  // Sous-menu actuellement ouvert
  openedMenu: string | null = null;

  // ===============================
  // ACTIONS RAPIDES (bouton "Créer" du header)
  // Ajoute une entrée ici pour l'exposer dans le menu déroulant —
  // chacune reste filtrée par sa propre permission.
  // ===============================
  readonly quickActions: { label: string; icon: string; route: string; permission: string }[] = [
    { label: 'Nouvelle vente', icon: 'fa-shopping-cart', route: '/vente', permission: 'créer facture et devis Vente' },
    { label: 'Nouvel achat', icon: 'fa-cart-arrow-down', route: '/achat-nouveau', permission: 'créer achat Achat' },
  ];

  private routerSub?: Subscription;

  constructor(
    public commandeService: CommandeService,
    public router: Router,
    public userService: UserService,
    public localStorageService: LocalStorageService,
    public parametreService: ParametreService,
    public notificationService: NotificationService,
    private networkService: NetworkService
  ) { }

  ngOnInit() {
    this.getMaintenance();
    this.userService.getUserLoggin();
    this.userName = this.userService.name;
    this.getNotifications();
    this.refreshRoleAndPermissonsUser();

    if (this.userService.user.roles && this.userService.user.roles.length > 0) {
      this.firstRoleName = this.userService.user.roles[0].name;
      // FIX : "role" était déclaré mais jamais assigné (toujours vide dans le template)
      this.role = this.firstRoleName ?? '';
    }

    // Restaurer l'état réduit/déplié + resynchroniser la classe body
    // (indispensable : c'est cette classe qui pilote la marge du .page-wrapper
    // dans le layout global, donc l'état ts et la classe body doivent TOUJOURS
    // être appliqués ensemble, y compris au chargement)
    let saved = false;
    try {
      saved = localStorage.getItem(SIDEBAR_STATE_KEY) === 'true';
    } catch { /* stockage indisponible */ }
    this.sidebarCollapsed = saved;
    document.body.classList.toggle('sidebar-is-collapsed', this.sidebarCollapsed);

    // Fermer automatiquement le menu mobile après navigation
    // + ouvrir le bon sous-menu selon l'URL
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.mobileMenuOpen = false;
        this.openCurrentMenu();
      });

    this.openCurrentMenu();
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  // ===============================
  // SIDEBAR
  // ===============================
  toggleSidebar(): void {
    this.setCollapsed(!this.sidebarCollapsed);
  }

  /** Source unique de vérité : état ts + classe body + persistance,
   *  toujours mis à jour ensemble pour éviter les désynchronisations. */
  private setCollapsed(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;

    if (collapsed) {
      this.openedMenu = null;
    }

    document.body.classList.toggle('sidebar-is-collapsed', collapsed);

    try {
      localStorage.setItem(SIDEBAR_STATE_KEY, String(collapsed));
    } catch { /* stockage indisponible, on ignore */ }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleSubMenu(menu: string): void {
    // Si la sidebar est réduite, on la réouvre proprement
    // (état + classe body + storage, via setCollapsed) avant d'ouvrir le sous-menu
    if (this.sidebarCollapsed) {
      this.setCollapsed(false);

      setTimeout(() => {
        this.openedMenu = this.openedMenu === menu ? null : menu;
      }, 150);

      return;
    }

    this.openedMenu = this.openedMenu === menu ? null : menu;
  }

  isMenuOpen(menu: string): boolean {
    return this.openedMenu === menu;
  }

  /** Masque entièrement le bouton "Créer" si aucune action rapide
   *  n'est autorisée pour l'utilisateur courant. */
  hasAnyQuickAction(): boolean {
    return this.quickActions.some(a =>
      this.userService.checkPermissionExistence(this.firstRoleName + ' ' + a.permission)
    );
  }

  // ===============================
  // OUVRIR LE BON MENU SELON URL
  // ===============================
  openCurrentMenu(): void {
    const url = this.router.url;

    if (['/vente', '/ticket', '/devis', '/bon'].includes(url)) {
      this.openedMenu = 'vente';
    } else if (['/achat-nouveau', '/achat', '/bon-achat'].includes(url)) {
      this.openedMenu = 'achat';
    } else if (['/client', '/fournisseur'].includes(url)) {
      this.openedMenu = 'crm';
    } else if ([
      '/produit', '/mouvement-list', '/mouvement-list-place', '/depot_I', '/inventaires'
    ].includes(url)) {
      this.openedMenu = 'stock';
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 992) {
      this.mobileMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // =====================================
  // TON CODE EXISTANT RESTE EN DESSOUS
  // =====================================
  getConnexion() {
    this.networkService.currentStatus.subscribe(isOnline => {
      if (isOnline) {
        console.log('Connexion rétablie');
      } else {
        console.log('Pas de connexion');
      }
    });
  }

  refreshRoleAndPermissonsUser(): void {
    this.userService.refreshRoleAndPermissonsUser(this.userService.user.id).subscribe(data => {
      const resp: any = data;
      this.userService.user.permissions = resp.user.permissions;
      this.userService.setRoles(resp.user.roles);
    });
  }

  getMaintenance() {
    this.parametreService.getSetting().subscribe((data) => {
      const response: any = data;
      localStorage.removeItem('setting');
      localStorage.setItem('setting', this.userService.encrypt(JSON.stringify(response.setting)));
    });
  }

  // ===============================
  // NOTIFICATIONS
  // ===============================
  getNotifications() {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe(
      (data) => {
        this.total_pending = data.total_pending ?? 0;
        this.notifications = data.notifications ?? [];
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications :', error);
        this.isLoading = false;
      }
    );
  }

  all() {
    this.router.navigate(['/notifications']);
  }

  trackByNotifId(index: number, notification: any): any {
    return notification?.id ?? index;
  }

  onNotificationClick(notification: any): void {
    this.notificationService.markAsSent(notification.id).subscribe((res) => {
      const data: any = res;
      this.getNotifications();
      this.router.navigate(['/accueil']);
      this.commandeService.detail(data.order);
    });
  }

  // ===============================
  // CALCULATRICE
  // ===============================
  append(value: string): void {
    this.result += value;
  }

  clearAll(): void {
    this.result = '';
  }

  clearEntry(): void {
    this.result = this.result.slice(0, -1);
  }

  calculate(): void {
    try {
      this.result = eval(this.result).toString();
    } catch (e) {
      this.result = 'Erreur';
    }
  }

  logout() {
    this.userService.logout();
  }
}

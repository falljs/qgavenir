import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ParametreService } from 'src/app/services/parametre.service';
import { PaymentService } from 'src/app/services/payment.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: any = {};
  settingIconeStock: any;
  showPassword = false;
  errorMessage = false;
  errorAccess = false;
  isClick = false;
  isLoad = false;
  loginForm: any;

  constructor(private router: Router, public userService: UserService, public datePipe: DatePipe,
    public tokenService: TokenService, public fb: FormBuilder,
    public paymentService: PaymentService, public parametreService: ParametreService) { }

  ngOnInit() {
    this.userService.isloggedIn = false;
    this.isClick = true;
    this.isLoad = false;
    this.getPayment();

    // Initialiser le formulaire de login
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.getSettingIconeStock();

  }

  getSettingIconeStock() {
    this.parametreService.getSettingIconeStock().subscribe(data => {
      let resp: any = data;
      localStorage.setItem('settingIconeStock', this.userService.encrypt(JSON.stringify(resp.setting)));
    });

    const settingIconeStock: any = localStorage.getItem('settingIconeStock');
    this.settingIconeStock = JSON.parse(this.userService.decrypt(settingIconeStock));
  }

  getPayment() {
    this.paymentService.getPayment().subscribe((data) => {
      let response: any = data;
      this.paymentService.next_paiement = response.next_paiement;
      this.paymentService.date_paiement = this.datePipe.transform(response.date_paiement, 'dd-M-yyyy HH\'h\':mm');
      this.paymentService.payment = response.payment;
      this.paymentService.credit = response.credit;
      this.paymentService.check = response.check;
      this.paymentService.difference = response.difference;
      if (this.paymentService.difference > 0 && this.paymentService.difference <= 5) {
        this.paymentService.reste_jour = true;
      } else {
        this.paymentService.reste_jour = false;
      }
    });
  }

  login(loginForm: { value: { username: string; password: string; }; }) {
    this.errorMessage = false; this.errorAccess = false; this.isClick = false; this.isLoad = true;
    this.userService.login(loginForm.value.username, loginForm.value.password)
      .subscribe(data => {
        if (data) {
          this.user = data;
          if (this.user.data.user.blocked == 1) {
            this.errorAccess = true;
            this.isClick = true;
            this.isLoad = false;
          } else {
            localStorage.setItem('user', this.userService.encrypt(JSON.stringify(this.user.data.user)));
            localStorage.setItem('allPermissions', this.userService.encrypt(JSON.stringify(this.user.data.allPermissions)));
            this.tokenService.saveToken("Bearer " + this.user.data.token);
            let jwt = "Bearer " + this.tokenService.getToken();
            localStorage.setItem("token", jwt);

            if (localStorage.getItem("token") != null) {
              this.userService.isloggedIn = true;
              this.router.navigate(['/accueil']);
              this.userService.getUserLoggin();
              window.location.reload();
            } else {
              this.userService.isloggedIn = false;
              this.isClick = true;
              this.isLoad = false;
            }
          }
        } else {
          this.errorMessage = true;
          this.isClick = true;
          this.isLoad = false;
        }
      });
  }

  showHidePwd() {
    this.showPassword = !this.showPassword;
  }

  administrateur() {
    // Remplir les champs avec les informations de l'administrateur
    this.loginForm.get('username')?.setValue('administrateur');
    this.loginForm.get('password')?.setValue('1234');  // Change le mot de passe si nécessaire
    this.isClick = false;
  }

  vendeur() {
    // Remplir les champs avec les informations du vendeur
    this.loginForm.get('username')?.setValue('vendeur');
    this.loginForm.get('password')?.setValue('1234');  // Change le mot de passe si nécessaire
    this.isClick = false;
  }

  caissier() {
    // Remplir les champs avec les informations du caissier
    this.loginForm.get('username')?.setValue('caissier');
    this.loginForm.get('password')?.setValue('1234');  // Change le mot de passe si nécessaire
    this.isClick = false;
  }

  gestionnaire() {
    // Remplir les champs avec les informations du gestionnaire
    this.loginForm.get('username')?.setValue('gestionnaire');
    this.loginForm.get('password')?.setValue('1234');  // Change le mot de passe si nécessaire
    this.isClick = false;
  }
}


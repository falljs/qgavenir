import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { ToastrService } from 'ngx-toastr';
import { ParametreService } from 'src/app/services/parametre.service';
import { LigneAchat } from 'src/app/models/ligne-achat';
import { DatePipe } from '@angular/common';
import { AchatService } from 'src/app/services/achat.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-add-recu',
  templateUrl: './add-recu.component.html',
  styleUrls: ['./add-recu.component.scss']
})
export class AddRecuComponent implements OnInit {

  // Recu 
  formRecu! :FormGroup;
  formUpRecu! :FormGroup;
  // Id Ligne recu
  id_ligneRecu!: number;
  // Var Form recu
  id!:number;
  num_recu: any;
  date_recu!: any;
  heure_recu!: any;
  avance: any;
  auteur: any;
  //Other
  achat: any;
  fournisseur: any;
  dossier: any;
  totalReg: number = 0;

  constructor(public router:Router, public fb: FormBuilder, public userService:UserService,
              public toastrService : ToastrService, public parametreService: ParametreService,
              public achatService: AchatService, private datePipe : DatePipe,){}
              get fRecu() {return this.formRecu.controls}
              get fUpRecu() {return this.formUpRecu.controls}

  ngOnInit(){
    if(localStorage.getItem('achat')!=null){
      this.achat = JSON.parse(localStorage.getItem('achat')!);
      this.achatService.listRecu = JSON.parse(localStorage.getItem('listLigneRecu')!);
      let totalReg = 0;
      for (var i = 0; i < this.achatService.listRecu.length; i++) {
        if (this.achatService.listRecu[i].avance) {
          totalReg += this.achatService.listRecu[i].avance;
          this.totalReg = totalReg;
        }else{
          totalReg += this.achatService.listRecu[i].avance;
          this.totalReg = totalReg;
        }
      }
      this.fournisseur = JSON.parse(localStorage.getItem('fournisseur')!);
      this.dossier = JSON.parse(localStorage.getItem('dossier')!);
      this.InfoFormRecu();
      this.InfoFormUpRecu();
      this.getSetting();
    }
  }

  modalDeleteRecu(id: number){
    this.id_ligneRecu = id;
  }
  
  deleteRecu(){
    this.achatService.deleteRecu(this.id_ligneRecu).subscribe((data) => {
      let response: any = data;
      this.toastrService.warning('Reçu supprimé !');
      localStorage.removeItem('listLigneRecu');
      localStorage.setItem('listLigneRecu',JSON.stringify(response.ligneRecus));
      this.achatService.listRecu = JSON.parse(localStorage.getItem('listLigneRecu')!);
      let totalReg = 0;
      for (var i = 0; i < this.achatService.listRecu.length; i++) {
        if (this.achatService.listRecu[i].avance) {
          totalReg += this.achatService.listRecu[i].avance;
          this.totalReg = totalReg;
        }else{
          totalReg += this.achatService.listRecu[i].avance;
          this.totalReg = totalReg;
        }
      }
    });
  }

  InfoFormRecu() {
    this.formRecu = new FormGroup({
      achat: new FormControl(this.achat.id, [Validators.required]),
      num_recu: new FormControl('', [Validators.required]),
      date_recu: new FormControl('', [Validators.required]),
      heure_recu: new FormControl('', [Validators.required]),
      avance: new FormControl(0, [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }

  InfoFormUpRecu() {
    this.formUpRecu = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      num_recu: new FormControl('', [Validators.required]),
      date_recu: new FormControl('', [Validators.required]),
      heure_recu: new FormControl('', [Validators.required]),
      avance: new FormControl(0, [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }

  addRecu(){
    this.InfoFormRecu();
  }

  updateRecu(recu: any){
    this.formUpRecu = new FormGroup({
      id: new FormControl(recu.id, [Validators.required]),
      num_recu: new FormControl(recu.num_recu, [Validators.required]),
      date_recu: new FormControl(recu.date_recu, [Validators.required]),
      heure_recu: new FormControl(recu.heure_recu, [Validators.required]),
      avance: new FormControl(recu.avance, [Validators.required]),
      auteur: new FormControl(this.userService.name)
    });
  }

  onSubmitRecu(){
    this.fRecu['date_recu'].setValue(this.date_recu);
    this.achatService.createRecu(this.formRecu.value).subscribe(
      data =>{
        let response: any = data;
        this.InfoFormRecu();
        this.toastrService.success('Reçu N° '+response.recu.num_recu+' ajouté !');
        localStorage.removeItem('listLigneRecu');
        localStorage.setItem('listLigneRecu',JSON.stringify(response.ligneRecus));
        this.achatService.listRecu = JSON.parse(localStorage.getItem('listLigneRecu')!);
        let totalReg = 0;
        for (var i = 0; i < this.achatService.listRecu.length; i++) {
          if (this.achatService.listRecu[i].avance) {
            totalReg += this.achatService.listRecu[i].avance;
            this.totalReg = totalReg;
          }else{
            totalReg += this.achatService.listRecu[i].avance;
            this.totalReg = totalReg;
          }
        }
    });
  }

  onUpdateRecu(){
    this.fUpRecu['date_recu'].setValue(this.date_recu);
    this.achatService.updateRecu(this.formUpRecu.value).subscribe(
      data =>{
        let response: any = data;
        this.toastrService.success('Reçu N° '+response.recu.num_recu+' modifié !');
        localStorage.removeItem('listLigneRecu');
        localStorage.setItem('listLigneRecu',JSON.stringify(response.ligneRecus));
        this.achatService.listRecu = JSON.parse(localStorage.getItem('listLigneRecu')!);
        let totalReg = 0;
        for (var i = 0; i < this.achatService.listRecu.length; i++) {
          if (this.achatService.listRecu[i].avance) {
            totalReg += this.achatService.listRecu[i].avance;
            this.totalReg = totalReg;
          }else{
            totalReg += this.achatService.listRecu[i].avance;
            this.totalReg = totalReg;
          }
        }
    });
  }
  
  getDate(date: any){
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }

  getHeure(date: any){
    return this.datePipe.transform(date, 'HH:mm:ss');
  }

  onChangeDate(ctrl: any){
    if(ctrl.value){
      this.date_recu = this.getDate(ctrl.value);
    }
  }

  getSetting(){
    this.parametreService.getSetting().subscribe((data) => {
      localStorage.setItem('setting',JSON.stringify(data));
    });
  }

  getBase64ImageFromURL(url:any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
  
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
  
        var ctx:any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
  
        var dataURL = canvas.toDataURL("image/png");
  
        resolve(dataURL);
      };
  
      img.onerror = error => {
        reject(error);
      };
  
      img.src = url;
    });
  }

  async downloadFactRecu(achat: any) {
    const data: any = localStorage.getItem('setting');
    let entreprise: any = JSON.parse(data);
    let numero_fn: any;
    if(achat.numero_fn != null){
      numero_fn = achat.numero_fn;
    }else{
      numero_fn = "(+221) 000 00 00";
    }
   
    let docDefinition:any = {  
      info: {
        title: 'Achat N° '+achat.id,
      },
      pageSize: 'A5',
      pageMargins: [5,175,5,80],

      background: [
        {
          image: await this.getBase64ImageFromURL('/assets/img/kst_fac.png'),
          width: 100,
          margin: [50,0,0,0],
        }
      ],
      
      header:  function() {
        return [
         {
          alignment: 'center',
          margin:[0,5,0,0],
          columns:[
            [
              {
                table:{
                 body:[
                  [
                    [
                      {
                        text: "Vente Oignons, Pomme de terre",
                        margin:[0,30,0,0],
                        style:'textNormal',
                      },
                      {
                        text: "Foie, Viande, Fritte" +', '+"Ail etc..",
                        style:'textNormal',
                      },
                      {
                        text: "Marché Gueule / Diamalaye - Dakar (Sénégal)",
                        style:'textNormal',
                      },
                      {
                        text: "+221 77 492 31 84" +' / '+"+221 76 157 20 57",
                        style:'textNormal',
                      },
                      {
                        text: "+221 77 691 67 26" +' / '+'+221 76 020 42 68',
                        style:'textNormal',
                      },
    
                    ],
                  ]
                 ]
                },
                layout: {
                  defaultBorder: false,
                }
              }
            ],
            [
              {
                margin:[10,0,10,0],
                table:{
                heights: 75,
                widths:[170,10],
                 body:[
                  [
                    [
                      {
                        columns:[
                          [
                            {
                              text: 'Date',
                              style:'textNormal',
                            },
                            {
                              text: achat.date_achat,
                              style:'textNormal',
                            }
                          ],
                          [
                            {
                              text: 'Heure',
                              style:'textNormal',
                            },
                            {
                              text: achat.heure_achat,
                              style:'textNormal',
                            }
                          ]
                        ]
                      },
    
                      {
                        text: achat.nom_fn,
                        Blob : true,
                        fontSize:15,
                        alignment:'center',
                      },
                      {
                        text: achat.adresse_fn,
                        style:'textNormal',
                      },
                      {
                        text: achat.code_fn,
                        style:'textNormal',
                      },
                      {
                        text: numero_fn,
                        style:'textNormal',
                      },
                    ],
                  ]
                 ]
                },
                layout: {
                  defaultBorder: true,
                }
              }
    
    
            ],
          ],
    
         },
         {
          text : 'Facture',
          Blob : true,
          fontSize:20,
          alignment:'center',
          decoration:'underline',
          lineHeight:1.5,
          margin:[0,-3,0,0],
         },
         {
          alignment: 'center',
          fontSize:10,
          margin:[0,-3,0,0],
          columns:[
            [
              {
                style:'table',
                margin: [10,0,10,0],
                fontSize:10,
                table:{
                  widths:[45,90,'*'],
                  body:[
                    [
                      {
                        text:'Achat',
                      },
                      {
                        text: 'N° 00'+achat.id
                      },
                      {
                        text : 'Facturer par : '+achat.auteur
                      },
    
                    ],
                  ]
                }
               },
            ],
    
    
          ],
         },
    
        ]
      },

      footer: function (currentPage:any, pageCount:any) {
        var columns = [
          {
            text:'__________________________________________________________________________________________________',
            alignment: 'justify',
            fontSize:9,
            margin: [10,-5,0,0],
          },
          {
            text:entreprise.entreprise,
            width: 'auto',
            alignment: 'center',
            style:'lettre'
          },
          {
            text:"Merci pour votre confiance",
            width: 'auto',
            alignment: 'center',
            style:'lettre'
          },
          {
            text:"Et à très Bientôt",
            width: 'auto',
            alignment: 'center',
            style:'lettre'
          },
          {
            text:  'Page ' +currentPage.toString() +' / '+pageCount,
            width: 'auto',
            alignment: 'right',
            margin: [0,-20,15,0],
            style:'lettre'
          },
  
        ]
          var columns_2 = [
              {
                text:  'Page ' +currentPage.toString() +' / '+pageCount,
                alignment: 'right',
                fontSize:10,
                margin: [0,0,0,0],
              },
  
            ]
  
          if (currentPage == pageCount){
            return columns;
          }else{
            return columns_2;
          }
      },
      
      content: [
        {
          columns:[
            [
              {
                margin:[0,-15,0,0],
                table:{
                  heights: 302,
                  widths:[400,-10],
                  body:[
                    [
                      //this.getListLrecu(this.achatService.listRecu),
                    ]
                  ]
                },
                layout: {
                  defaultBorder: true,
                }
  
              }
            ]
          ],
        },
      ],

      /*************************** Start Style **************************/
      styles:{
        textNormal:{
          Blob : true,
          fontSize:9,
          alignment:'center',
        },
      },
      
    }; 
    pdfMake.createPdf(docDefinition).open();  
  }

/*   getListLrecu(lrecu: Recu[]){
    return{
      style:'table',
      margin:[-5,-3,-5,0],
      table:{
        widths:['*',110,'*'],
        body:[
          [
            {
              text:'N° Reçu',
              style:'tableHeader'
            },
            {
              text:'Date Reçu',
              style:'tableHeader'
            },
            {
              text:'Reglement',
              style:'tableHeader'
            },
          ],
        ...lrecu.map(res=>{
          return [res.num_recu,res.date_recu+' à '+res.heure_recu,Number(res.avance).toLocaleString('en-GB') +" F"];
        })
      ]
      }
    };
  }

  async downloadFactRecuOne(recu: Recu){
    const resp: any = localStorage.getItem('achat');
    let achat: any = JSON.parse(resp);
    const data: any = localStorage.getItem('setting');
    let entreprise: any = JSON.parse(data);
    let numero_fn: any;
    if(achat.numero_fn != null){
      numero_fn = achat.numero_fn;
    }else{
      numero_fn = "(+221) 000 00 00";
    }
   
    let docDefinition:any = {  
      info: {
        title: 'Achat N° '+achat.id,
      },
      pageSize: 'A5',
      pageMargins: [5,175,5,80],

      background: [
        {
          image: await this.getBase64ImageFromURL('/assets/img/kst_fac.png'),
          width: 100,
          margin: [50,0,0,0],
        }
      ],
      
      header:  function() {
        return [
         {
          alignment: 'center',
          margin:[0,5,0,0],
          columns:[
            [
              {
                table:{
                 body:[
                  [
                    [
                      {
                        text: "Vente Oignons, Pomme de terre",
                        margin:[0,30,0,0],
                        style:'textNormal',
                      },
                      {
                        text: "Foie, Viande, Fritte" +', '+"Ail etc..",
                        style:'textNormal',
                      },
                      {
                        text: "Marché Gueule / Diamalaye - Dakar (Sénégal)",
                        style:'textNormal',
                      },
                      {
                        text: "+221 77 492 31 84" +' / '+"+221 76 157 20 57",
                        style:'textNormal',
                      },
                      {
                        text: "+221 77 691 67 26" +' / '+'+221 76 020 42 68',
                        style:'textNormal',
                      },
    
                    ],
                  ]
                 ]
                },
                layout: {
                  defaultBorder: false,
                }
              }
            ],
            [
              {
                margin:[10,0,10,0],
                table:{
                heights: 75,
                widths:[170,10],
                 body:[
                  [
                    [
                      {
                        columns:[
                          [
                            {
                              text: 'Date',
                              style:'textNormal',
                            },
                            {
                              text: achat.date_achat,
                              style:'textNormal',
                            }
                          ],
                          [
                            {
                              text: 'Heure',
                              style:'textNormal',
                            },
                            {
                              text: achat.heure_achat,
                              style:'textNormal',
                            }
                          ]
                        ]
                      },
    
                      {
                        text: achat.nom_fn,
                        Blob : true,
                        fontSize:15,
                        alignment:'center',
                      },
                      {
                        text: achat.adresse_fn,
                        style:'textNormal',
                      },
                      {
                        text: achat.code_fn,
                        style:'textNormal',
                      },
                      {
                        text: numero_fn,
                        style:'textNormal',
                      },
                    ],
                  ]
                 ]
                },
                layout: {
                  defaultBorder: true,
                }
              }
    
    
            ],
          ],
    
         },
         {
          text : 'Facture',
          Blob : true,
          fontSize:20,
          alignment:'center',
          decoration:'underline',
          lineHeight:1.5,
          margin:[0,-3,0,0],
         },
         {
          alignment: 'center',
          fontSize:10,
          margin:[0,-3,0,0],
          columns:[
            [
              {
                style:'table',
                margin: [10,0,10,0],
                fontSize:10,
                table:{
                  widths:[45,90,'*'],
                  body:[
                    [
                      {
                        text:'Achat',
                      },
                      {
                        text: 'N° 00'+achat.id
                      },
                      {
                        text : 'Facturer par : '+achat.auteur
                      },
    
                    ],
                  ]
                }
               },
            ],
    
    
          ],
         },
    
        ]
      },

      footer: function (currentPage:any, pageCount:any) {
        var columns = [
          {
            text:'__________________________________________________________________________________________________',
            alignment: 'justify',
            fontSize:9,
            margin: [10,-5,0,0],
          },
          {
            text:entreprise.entreprise,
            width: 'auto',
            alignment: 'center',
            style:'lettre'
          },
          {
            text:"Merci pour votre confiance",
            width: 'auto',
            alignment: 'center',
            style:'lettre'
          },
          {
            text:"Et à très Bientôt",
            width: 'auto',
            alignment: 'center',
            style:'lettre'
          },
          {
            text:  'Page ' +currentPage.toString() +' / '+pageCount,
            width: 'auto',
            alignment: 'right',
            margin: [0,-20,15,0],
            style:'lettre'
          },
  
        ]
          var columns_2 = [
              {
                text:  'Page ' +currentPage.toString() +' / '+pageCount,
                alignment: 'right',
                fontSize:10,
                margin: [0,0,0,0],
              },
  
            ]
  
          if (currentPage == pageCount){
            return columns;
          }else{
            return columns_2;
          }
      },
      
      content: [
        {
          columns:[
            [
              {
                margin:[0,-15,0,0],
                table:{
                  heights: 302,
                  widths:[400,-10],
                  body:[
                    [
                      this.getRecuOne(recu),
                    ]
                  ]
                },
                layout: {
                  defaultBorder: true,
                }
  
              }
            ]
          ],
        },
      ],

      /*************************** Start Style *************************
      styles:{
        textNormal:{
          Blob : true,
          fontSize:9,
          alignment:'center',
        },
      },
      
    }; 
    pdfMake.createPdf(docDefinition).open(); 
  }

  getRecuOne(recu: Recu){
    return{
      style:'table',
      margin:[-5,-3,-5,0],
      table:{
        widths:['*',110,'*'],
        body:[
          [
            {
              text:'N° Reçu',
              style:'tableHeader'
            },
            {
              text:'Date Reçu',
              style:'tableHeader'
            },
            {
              text:'Reglement',
              style:'tableHeader'
            },
          ],
          [
            {
              text: recu.num_recu,
              style:'tableHeader'
            },
            {
              text: recu.date_recu+' à '+recu.heure_recu,
              style:'tableHeader'
            },
  
            {
              text: Number(recu.avance).toLocaleString('en-GB') +" F",
              style:'tableHeader'
            }
          ]
      ]
      }
    };
  } */
}

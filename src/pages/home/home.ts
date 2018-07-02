import { Component, Injectable } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { UsuarioService } from '../../services/domain/usuario.service';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  constructor(public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService,
    public toastCtrl: ToastController,
    public storage: StorageService,
    public usuarioService: UsuarioService
  ) {
  }
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }
  ionViewDidEnter(){
   
   try{
    this.usuarioService.find(this.storage.getUsuarioDTO().email)
    .subscribe(response => {
        let ob = JSON.stringify(response)
        this.storage.setUsuarioDTO(JSON.parse(ob));
        this.auth.isLoggedIn = true;
        this.navCtrl.setRoot('PrincipalPage');
    }, error => {
        alert("Error usurio: " + JSON.stringify(error));
    });
   }catch(error){

   }
      
  }


  login() {
    this.auth.login()
      .then(response => {
        this.toastCtrl.create({ duration: 3000, position: 'bottom', message: 'LOGIN EFETUADO!' });
        this.redirecionaPage();
      })
      .catch((error) => {
        this.toastCtrl.create({ duration: 3000, position: 'bottom', message: 'Erro ao efetuar login' })
      })
  }
  redirecionaPage() {
    if (this.auth.isLoggedIn == true) {
      this.navCtrl.setRoot('PrincipalPage');
    } else {
      this.toastCtrl.create({ duration: 3000, position: 'bottom', message: 'Erro ao efetuar login' })
    }
  }

}


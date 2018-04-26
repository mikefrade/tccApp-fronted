import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
//import { Facebook } from '@ionic-native/facebook';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService,
    private toastCtrl: ToastController
    //public facebook: Facebook
  ) {
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  login() {

    //this.navCtrl.setRoot('PrincipalPage');
    this.auth.loginFacebook()
      .then(() => {
        this.navCtrl.setRoot('PrincipalPage');
      })
      .catch((error) => {
        this.toastCtrl.create({ duration: 3000, position: 'bottom', message: 'Erro ao efetuar login' })
      })
  }
}

//export class Model {
//constructor(objeto?) {
//  Object.assign(this, objeto);
//}
//}
//export class Usuario extends Model {
//codigo: number;
//nome: string;
//email: string;
//login: string;
//enha: string;
//}

import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController, LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public menu: MenuController,
    public auth: AuthService,
    private toastCtrl: ToastController,
    public storage: StorageService,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);

  }
  ionViewDidLeave() {
    this.menu.swipeEnable(true);

  }



  login() {
    this.auth.login()
      .then(() => {

        this.toastCtrl.create({ duration: 3000, position: 'bottom', message: 'LOGIN EFETUADO!' });
        this.redirecionaPage();

      })
      .catch((error) => {
        this.toastCtrl.create({ duration: 3000, position: 'bottom', message: 'Erro ao efetuar login' })
      })
  }

  redirecionaPage() {
    let loader = this.presentLoading();
    //if (this.storage.getLocalUser().email) {
    if (this.auth.isLoggedIn == true){
      this.navCtrl.setRoot('PrincipalPage');
  } else {

  this.toastCtrl.create({ duration: 3000, position: 'bottom', message: 'Erro ao efetuar login' })
}
  }


presentLoading() {
  const loader = this.loadingCtrl.create({
    content: "Aguarde...",
    duration: 2000
  });
  loader.present();
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

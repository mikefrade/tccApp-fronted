import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  email: string;
  nome: string;
  profileimg: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageService, public auth: AuthService) {
  }

  ionViewDidLoad() {
   // let localUser = this.storage.getLocalUser();
  /*  if (localUser && localUser.email){
      this.email = localUser.email;
      this.nome = localUser.nome;
    }*/
    this.profileimg = this.auth.users.picture.data.url;
    this.nome = this.auth.users.name;
    this.email = this.auth.users.email;

  }


  verUserLogado() {
    let usr = this.storage.getLocalUser();
    alert(JSON.stringify(usr));
  }

}

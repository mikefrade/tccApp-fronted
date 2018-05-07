import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PrincipalPage } from '../principal/principal';

/**
 * Generated class for the NotificacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notificacao',
  templateUrl: 'notificacao.html',
})
export class NotificacaoPage  {

  constructor(public navCtrl: NavController, public navParams: NavParams) {  }


  

  ionViewDidLoad() {

    console.log('ionViewDidLoad NotificacaoPage');
  }

  criarNotificacao(){
    var pos = this.navParams.get('posicao');
   // alert(pos);
   // var obj = JSON.parse(pos);
   // this.principalPage.criarMarcador('Criei um marcador', 'red', obj);
    this.navCtrl.pop();
  }



}

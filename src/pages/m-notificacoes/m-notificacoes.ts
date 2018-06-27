import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificacaoDTO } from '../../models/notificacao.dto';
import { NotificacaoService } from '../../services/domain/notificacao.service';
import { API_CONFIG } from '../../config/api.config';
import { StorageService } from '../../services/storage.service';

/**
 * Generated class for the MNotificacoesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-m-notificacoes',
  templateUrl: 'm-notificacoes.html',
})
export class MNotificacoesPage {

  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  items: NotificacaoDTO[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public notificacaoService: NotificacaoService,
    public storage: StorageService,) {
  }

  ionViewDidLoad() {
    this.notificacaoService.findByNotificacaoUser(this.storage.getUsuarioDTO().id)
    .subscribe(response => {
      this.items = response;
    },
    error => {
      alert("Errrorrrrrrr: " + JSON.stringify(error));
    });
  }

  visualizarnotificacao(notificacao_id: string){
    this.navCtrl.push('MapaNotificacaoPage', {notificacao_id: notificacao_id});
  }

}

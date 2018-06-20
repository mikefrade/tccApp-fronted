import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificacaoService } from '../../services/domain/notificacao.service';
import { GoogleMap, GoogleMapsEvent, Marker, LatLng, GoogleMaps } from '@ionic-native/google-maps';
import { NotificacaoDTO } from '../../models/notificacao.dto';

/**
 * Generated class for the MapaNotificacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mapa-notificacao',
  templateUrl: 'mapa-notificacao.html',
})
export class MapaNotificacaoPage {
  map: GoogleMap;
  item: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public notificacaoService: NotificacaoService) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let notificacao_id = this.navParams.get('notificacao_id');
    this.notificacaoService.findByNotificacao(notificacao_id)
      .subscribe(response =>{
        this.item = response;
        let notificacao = this.item;
        let tituloInfo = notificacao.usuario.nome;
        let corpoInfo = 
        'Categoria: ' + notificacao.categoria  + 
        '. Ocorrência: ' + notificacao.descricao +
        '. Data e Hora: ' + notificacao.logHora + 
        '. Endereço: ' + notificacao.endereco ;

        let uluru = { "lat": Number(notificacao.latitude), "lng": Number(notificacao.longitude) };
        let icone = 'red';
        this.loadMap(notificacao.latitude,notificacao.longitude)
        .then(()=>{
          this.criarMarcador(notificacao.categoria, icone, uluru, tituloInfo, corpoInfo);
        });
    },
      error =>{

      });
  }

  loadMap(lat: string, lng: string) {
    let latlng: LatLng = new LatLng(Number(lat), Number(lng));
    this.map = GoogleMaps.create('map_canvas');
    return this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.map.setMyLocationEnabled(true);
      this.map.setOptions({
        'controls': {
          'compass': true, 'myLocationButton': true, 
          'indoorPicker': true, 'zoom': true
        },
        'gestures': { 'scroll': true, 'tilt': true, 'rotate': true, 'zoom': true },
        'camera': { 'target': latlng, 'zoom': 17, 'tilt': 30 }
      });

    });
  }
  criarMarcador(titulo, coricone, posicao, tituloInfo, corpoInfo) {
    this.map.addMarker({
    title: titulo,
    icon: coricone,
    animation: 'DROP',
    position: posicao
  })
    .then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK)
        .subscribe((params) => {
            let marker: Marker = params[1];
            marker.setTitle(tituloInfo);
            marker.setSnippet(corpoInfo);
            marker.showInfoWindow();
          });
    });
}

}

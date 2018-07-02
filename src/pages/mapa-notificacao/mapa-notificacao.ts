import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificacaoService } from '../../services/domain/notificacao.service';
import { GoogleMap, GoogleMapsEvent, Marker, LatLng, GoogleMaps, HtmlInfoWindow } from '@ionic-native/google-maps';
import { NotificacaoDTO } from '../../models/notificacao.dto';
import { API_CONFIG } from '../../config/api.config';

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
  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public notificacaoService: NotificacaoService) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let notificacao_id = this.navParams.get('notificacao_id');
    this.notificacaoService.findByNotificacao(notificacao_id)
      .subscribe(response => {
        this.item = response;
        let notificacao = this.item;
        this.loadMap(notificacao.latitude, notificacao.longitude)
          .then(() => {
            let imagem = this.bucketUrl + "/not" + notificacao.id + ".jpg";
            let htmlInfoWindow = new HtmlInfoWindow();
            let frame: HTMLElement = document.createElement('div');
            frame.innerHTML = [
              '<h3>' + notificacao.usuario.nome + '</h3>' +
              '<p><b> Categoria: ' + notificacao.categoria + '</b></p></p>' +
              '<p> Descrição: ' + notificacao.descricao + '</p>' +
              '<p> Data e Hora: ' + notificacao.logHora + '</p>' +
              '<p> Endereço: ' + notificacao.endereco + '</p>', 
              '<div class=figure>' +
              '<img class=scaled src="'+ imagem +'">' +
              '</div>'  
            ].join("");
            frame.getElementsByTagName("img")[0] ;//.addEventListener("click", () => {
              // htmlInfoWindow.setBackgroundColor('red');
           // });
            htmlInfoWindow.setContent(frame,  { width: "280px", height: "480px" });
            let uluru = { "lat": Number(notificacao.latitude), "lng": Number(notificacao.longitude) };
            this.map.addMarker({
              title: notificacao.categoria,
              position: uluru
            })
              .then(marker => {
                marker.on(GoogleMapsEvent.MARKER_CLICK)
                  .subscribe(() => {
                    htmlInfoWindow.open(marker);
                  });
              });
          });
      },
        error => {

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
 
}

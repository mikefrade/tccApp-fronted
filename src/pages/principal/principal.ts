
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { IonicPage, NavController, NavParams, Searchbar, LoadingController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';

/**
 * Generated class for the PrincipalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import {
  GoogleMaps, GoogleMap, GoogleMapsEvent,
  GoogleMapOptions, CameraPosition, MarkerOptions,
  Marker, LatLng,
  Geocoder, BaseArrayClass, GeocoderResult, GeocoderRequest, HtmlInfoWindow,
} from '@ionic-native/google-maps';
import { NotificacaoDTO } from '../../models/notificacao.dto';
import { NotificacaoService } from '../../services/domain/notificacao.service';
import { API_CONFIG } from '../../config/api.config';
//import { LocationAccuracy} from '@ionic-native/location-accuracy';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  map: GoogleMap;
  clickable: boolean = true;
  lat: any; lng: any;
  endereco: string;
  isRunning: boolean = false;
  search_address: any;
  items: NotificacaoDTO[];
  bucketUrl: string = API_CONFIG.bucketBaseUrl;

  @ViewChild('searchbar', { read: ElementRef }) searchbarRef: ElementRef;
  @ViewChild('searchbar') searchbarElement: Searchbar;
  search: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public auth: AuthService,
    private nativeGeocoder: NativeGeocoder,    //private locationAccuracy: LocationAccuracy
    public notificacaoService: NotificacaoService,
    public loadingCtrl: LoadingController,) {
  }
  ionViewDidLoad() {
    //  this.ativarlocal();
    let loader = this.presentLoading();
    this.loadMap().then(() => {
      loader.dismiss();
      this.geolocateNative();
      this.carregarAllMarcadores();
    });
  }
  /* ativarlocal(){
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {

      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => console.log('Request successful'),
          error => console.log('Error requesting location permissions', error)
        );
      }
    
    });
  } */
  geolocateNative() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      let latlng: LatLng = new LatLng(geoposition.coords.latitude, geoposition.coords.longitude);
      try {
        return this.map.animateCamera({
          'target': latlng,
          'zoom': 17
        })
      } catch {
        alert('Ative a localização do seu celular!');
      }
    }).catch((error) => {
      alert('Erro ao obter a localização: ' + error);
    });
  }
  loadMap() {
    let latlng: LatLng = new LatLng(-19.8157, -43.9542);
    this.map = GoogleMaps.create('map_canvas');
    return this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.map.setMyLocationEnabled(true);
      this.map.setOptions({
        'controls': {
          'compass': true, 'myLocationButton': true, // GEOLOCATION BUTTON
          'indoorPicker': true, 'zoom': true
        },
        'gestures': { 'scroll': true, 'tilt': true, 'rotate': true, 'zoom': true },
        'camera': { 'target': latlng, 'zoom': 11, 'tilt': 30 }
      });

      this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((data) => {
        let obj = JSON.parse(data);
        this.coordenadas_End(obj.lat, obj.lng);
      });
    });
  }

  carregarAllMarcadores() {
    this.notificacaoService.findAll()
      .subscribe(response => {
        this.items = response;
        for (let i in this.items) {
          let notificacao = this.items[i];
          let imagem = this.bucketUrl + "/not" + notificacao.id + ".jpg";
          let htmlInfoWindow = new HtmlInfoWindow();
          let frame: HTMLElement = document.createElement('div');
          frame.innerHTML = [
            '<h3>' + notificacao.nomeuser + '</h3>' +
            '<p><b> Categoria: ' + notificacao.categoria  +  '</b></p></p>' +
            '<p> Descrição: ' + notificacao.descricao + '</p>' +
            '<p> Data e Hora: ' + notificacao.logHora + '</p>' +
            '<p> Endereço: ' + notificacao.endereco + '</p>' ,
            '<div class=figure>' +
            '<img class=scaled src="'+ imagem +'">' +
            '</div>'         
          ].join("");
          frame.getElementsByTagName("img")[0] ;//.addEventListener("click", () => {
           // htmlInfoWindow.setBackgroundColor('red');
        // });
          htmlInfoWindow.setContent(frame, { width: "280px", height: "480px" });
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
        }
      },
        error => {
          alert("Erro ao Carregar os marcadores: " + JSON.stringify(error));
        });
  }

  coordenadas_End(lt, lg) {
    this.nativeGeocoder.reverseGeocode(lt, lg)
      .then((result: NativeGeocoderReverseResult) => {
        let obj = JSON.stringify(result);
        let r = obj.substring(1, (obj.length - 1));
        let resultado = JSON.parse(r);
        this.endereco = resultado.thoroughfare + ', ' + resultado.subThoroughfare + '. Bairro: ' + resultado.subLocality + '. ' + resultado.locality + ' - ' + resultado.administrativeArea;
        this.showCriarNotificacao(this.endereco, lt , lg);
      })
      .catch((error: any) => console.log(error));
  }

  showCriarNotificacao(endereco: string, lat: string, lng: string) {
    this.navCtrl.push('NotificacaoPage', { endereco: endereco,
    latitude: lat, longitude: lng });
  }

  procurarEnd_click(event) {
    Geocoder.geocode({
      "address": this.search_address
    }).then((results: GeocoderResult[]) => {
      if (!results.length) {
        this.isRunning = false;
        return null;
      }
      return this.map.animateCamera({
        'target': results[0].position,
        'zoom': 16
      }).then(() => {
        this.isRunning = false;
      });
    })
    this.search = false;
  }

  toggleSearch() {
    if (this.search) {
      this.search = false;
    } else {
      this.search = true;
      this.searchbarElement.setFocus();
    }
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde...",
    });
    loader.present();
    return loader;
  }
}


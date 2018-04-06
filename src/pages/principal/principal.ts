
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Component } from '@angular/core/';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PrincipalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  map: GoogleMap;
  clickable: boolean = true;
  lat: any; lang: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    this.geolocateNative();
  }

  geolocateNative() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      console.log(geoposition);
      this.loadMap(geoposition);
    }).catch((error) => {
      console.log('Erro ao obter a localização', error);
    });
  }

  loadMap(position) {
    let latlng: LatLng = new LatLng(position.coords.latitude, position.coords.longitude);
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: latlng,
        zoom: 17,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log("Map is ready!");
      this.criarMarcador('Eu estou aqui!! Iuuuu', 'blue', latlng)
      this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((data) => {
        var obj = JSON.parse(data);
        this.criarMarcador('Criei um marcador', 'red', obj);
      });
    });
  }
  criarMarcador(titulo, coricone, posicao) {
    this.map.addMarker({
      title: titulo,
      icon: coricone,
      animation: 'DROP',
      position: posicao
    })//.then(marker => {
     // marker.on(GoogleMapsEvent.MARKER_CLICK)
     //   .subscribe(() => {
      //    alert('Eu cliquei no marcador!Iuuu');
     //   });
   // });
  }
}


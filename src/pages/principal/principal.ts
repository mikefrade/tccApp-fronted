
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
  lat:any; lang:any;
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
  console.log("Entrei no carregamento do Mapa");
    let latlng: LatLng  = new LatLng( position.coords.latitude, position.coords.longitude );
    console.log( "Posição: ", position.coords.latitude, position.coords.longitude );
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: latlng,
        zoom: 17,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create('map_canvas', mapOptions);
    console.log("Passei map create");

   //   this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
   //     console.log('Map is ready!')
   //   });
      this.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
        console.log("Passei map one");
        this.map.addMarker({
          title: 'Eu estou aqui!! Iuuuu',
          icon: 'blue',
          animation: 'DROP',
          position: latlng
        })
        .then(marker => {
          marker.on(GoogleMapsEvent.MARKER_CLICK)
            .subscribe(() => {
              alert('clicked');
            });
        });
      });
   }
}


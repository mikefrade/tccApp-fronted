
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
  GoogleMaps, GoogleMap, GoogleMapsEvent,
  GoogleMapOptions, CameraPosition, MarkerOptions,
  Marker, LatLng,
  Geocoder, BaseArrayClass, GeocoderResult,
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

  isRunning: boolean = false;
  search_address: any;

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

    this.search_address = 'Belo Horizonte, Minas Gerais';


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


  procurarEnd_click(event) {
    // Address -> latitude,longitude
    Geocoder.geocode({
      "address": this.search_address
    }).then((results: GeocoderResult[]) => {
      //  console.log(results);
      //  alert(results);
      if (!results.length) {
        this.isRunning = false;
        return null;
      }
      return this.map.animateCamera({
        'target': results[0].position,
        'zoom': 17
      }).then(() => {
        this.isRunning = false;
      });
      // Add a marker
      //  return this.map.addMarker({
      //  'position': results[0].position,
      //  'title':  JSON.stringify(results[0].position)
      //});
    })
    // .then((marker: Marker) => {
    // Move to the position
    // this.map.animateCamera({
    //   'target':
    //   marker.getPosition(),
    //   'zoom': 17
    //  }).then(() => {
    //    marker.showInfoWindow();
    //    this.isRunning = false;
    //  });
    //  });
  }
}


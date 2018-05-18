
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Component } from '@angular/core/';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
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
  Geocoder, BaseArrayClass, GeocoderResult, GeocoderRequest,
} from '@ionic-native/google-maps';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {
  map: GoogleMap;
  clickable: boolean = true;
  lat: any; lng: any;

  isRunning: boolean = false;
  search_address: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public auth: AuthService,
    private nativeGeocoder: NativeGeocoder) {
  }

  ionViewDidLoad() {

    this.geolocateNative();
  }

  geolocateNative() {
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition) => {
      // console.log(geoposition);
      this.loadMap(geoposition);
    }).catch((error) => {
      // console.log('Erro ao obter a localização', error);
      // alert ('Erro ao obter a localização'+  error);
    });
  }

  loadMap(position) {
    this.search_address = 'Barro Preto, BH';
    let latlng: LatLng = new LatLng(position.coords.latitude, position.coords.longitude);
    this.map = GoogleMaps.create('map_canvas');
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.map.setMyLocationEnabled(true);
      this.map.setOptions({
        'controls': {
          'compass': true, 'myLocationButton': true, // GEOLOCATION BUTTON
          'indoorPicker': true, 'zoom': true
        },
        'gestures': { 'scroll': true, 'tilt': true, 'rotate': true, 'zoom': true },
        'camera': { 'target': latlng, 'zoom': 16, 'tilt': 30 }
      });
      this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((data) => {
       let obj = JSON.parse(data);
       let endereco = this.coordenadas_End(obj.lat,obj.lng);
      // alert( ' A: ' + a  + 'B: ' + b + ' B.lat: '+ b.lat);
     
      //this.navCtrl.push('NotificacaoPage', { enderco: endereco });
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

  coordenadas_End(lt,lg) {

    this.nativeGeocoder.reverseGeocode(lt, lg)
    .then((result: NativeGeocoderReverseResult) => 
      alert(JSON.stringify(result))
  )
    .catch((error: any) => {
     return null
    });
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
        'zoom': 16
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


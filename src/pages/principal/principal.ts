
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';
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
  Geocoder, BaseArrayClass, GeocoderResult, GeocoderRequest,
} from '@ionic-native/google-maps';
import { StorageService } from '../../services/storage.service';
import { UsuarioService } from '../../services/domain/usuario.service';
import { NotificacaoDTO } from '../../models/notificacao.dto';
import { NotificacaoService } from '../../services/domain/notificacao.service';
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

  @ViewChild('searchbar', { read: ElementRef }) searchbarRef: ElementRef;
  @ViewChild('searchbar') searchbarElement: Searchbar;
  search: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    public auth: AuthService,
    private nativeGeocoder: NativeGeocoder,    //private locationAccuracy: LocationAccuracy
    public usuarioService: UsuarioService,
    public notificacaoService: NotificacaoService
  ) {
  }

  ionViewDidLoad() {
    //  this.ativarlocal();
    this.notificacaoService.findAll()
      .subscribe(response => {
        this.items = response;
      },
        error => {
          alert("Errrorrrrrrr: " + JSON.stringify(error));
        });
    //  alert(auth.a);
    this.usuarioService.find(this.auth.users.email) .subscribe(response => {
      alert(JSON.stringify(response));
    }, error => {
      alert("Error usurio: " + JSON.stringify(error));
    });
    this.loadMap();
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
      // console.log(geoposition);

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
      // console.log('Erro ao obter a localização', error);
      alert('Erro ao obter a localização: ' + error);
    });
  }

  loadMap() {
    // this.search_address = 'Barro Preto, BH';
    let latlng: LatLng = new LatLng(-19.8157, -43.9542);
    this.map = GoogleMaps.create('map_canvas');
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      this.map.setMyLocationEnabled(true);
      this.map.setOptions({
        'controls': {
          'compass': true, 'myLocationButton': true, // GEOLOCATION BUTTON
          'indoorPicker': true, 'zoom': true
        },
        'gestures': { 'scroll': true, 'tilt': true, 'rotate': true, 'zoom': true },
        'camera': { 'target': latlng, 'zoom': 14, 'tilt': 30 }
      });
      this.map.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((data) => {
        let obj = JSON.parse(data);
        this.coordenadas_End(obj.lat, obj.lng);
      });
    });
    this.geolocateNative();
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

  coordenadas_End(lt, lg) {

    this.nativeGeocoder.reverseGeocode(lt, lg)
      .then((result: NativeGeocoderReverseResult) => {
        let obj = JSON.stringify(result);

        let r = obj.substring(1, (obj.length - 1));
        let resultado = JSON.parse(r);
        this.endereco = resultado.thoroughfare + ', ' + resultado.subThoroughfare + '. Bairro: ' + resultado.subLocality + '. ' + resultado.locality + ' - ' + resultado.administrativeArea;
        this.navCtrl.push('NotificacaoPage', { endereco: this.endereco });;
      }

      )
      .catch((error: any) => console.log(error));
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
    this.search = false;
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

  toggleSearch() {
    if (this.search) {
      this.search = false;
    } else {
      this.search = true;
      this.searchbarElement.setFocus();
    }
  }

  doRefresh(refresher) {
    this.loadMap();
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

}


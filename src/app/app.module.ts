import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { AuthService } from '../services/auth.service';
import { Facebook } from '@ionic-native/facebook';
import { StorageService } from '../services/storage.service';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { HttpClientModule } from '@angular/common/http';  
import { UsuarioService } from '../services/domain/usuario.service';
import { NotificacaoService } from '../services/domain/notificacao.service';
import { ImageUtilService } from '../services/domain/image-util.service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GoogleMaps,
    AuthService,
    Facebook,
     {provide: ErrorHandler, useClass: IonicErrorHandler},
    StorageService,
    NativeGeocoder,
    UsuarioService,
    NotificacaoService,
    ImageUtilService
  ]
})
export class AppModule {}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
// import { PrincipalPage } from '../principal/principal';

/**
 * Generated class for the NotificacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notificacao',
  templateUrl: 'notificacao.html',
})
export class NotificacaoPage  {

  foto: string;
  cameraOn: boolean = false;
  end: string;
  categoria: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
  public camera: Camera) {  }


  

  ionViewDidLoad() {
    this.end = this.navParams.get('endereco');

    console.log('ionViewDidLoad NotificacaoPage');
  }

  criarNotificacao(){
  
   // alert(pos);
   // var obj = JSON.parse(pos);
   // this.principalPage.criarMarcador('Criei um marcador', 'red', obj);
    this.navCtrl.pop();
  }

  getCameraPicture(){
    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.foto = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
     // Handle error
    });
  
  }

  getGalleryPicture(){
    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     this.foto = 'data:image/png;base64,' + imageData;
     this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
     // Handle error
    });
  
  }



}

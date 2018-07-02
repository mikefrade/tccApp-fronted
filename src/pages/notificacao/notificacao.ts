import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { NotificacaoService } from '../../services/domain/notificacao.service';
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
export class NotificacaoPage {

  foto: string;
  cameraOn: boolean = false;
  end: string;
  latitude: string;
  longitude: string;
  descricao: string;
  categoria: any;
  codNotificacao: string;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public notificacaoService: NotificacaoService,
    public camera: Camera,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController) {

      this.foto = null;
     }

  ionViewDidLoad() {
    this.end = this.navParams.get('endereco');
    this.latitude = this.navParams.get('latitude');
    this.longitude = this.navParams.get('longitude');
  }

  criarNotificacao() {
    let loader = this.presentLoading();
    this.notificacaoService.criarNotificacao(this.latitude, this.longitude, this.end, this.categoria, this.descricao)
      .subscribe(response => {
        this.codNotificacao = this.notificacaoService.extractId(response.headers.get('location'));
       if(this.foto != null){
        this.sendPicuture()
        .subscribe(response => {
          this.foto = null;
          loader.dismiss();
          this.showInsertOk();
        }, error => {
          loader.dismiss();
        })
       } else{
        loader.dismiss();
        this.showInsertOk();
       }
      },
        error => {
          alert(error.text());
        });
  }

  sendPicuture() {
    return this.notificacaoService.uploadPicture(this.foto, this.codNotificacao);
  }

  showInsertErro() {
    let alert = this.alertCtrl.create({
      title: 'Erro!',
      message: 'Notificação não foi criada. Tente novamente!',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
           
          }
        }
      ]
    });
    alert.present();
  }

  showInsertOk() {
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      message: 'Notificação criada com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot('PrincipalPage');
          }
        }
      ]
    });
    alert.present();
  }


  getCameraPicture() {
    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.foto = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
      // Handle error
    });

  }

  getGalleryPicture() {
    this.cameraOn = true;
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.foto = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
      // Handle error
    });
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde...",
    });
    loader.present();
    return loader;
  }
}

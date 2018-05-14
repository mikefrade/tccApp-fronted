import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificacaoPage } from './notificacao';
import { Camera } from '@ionic-native/camera'

@NgModule({
  declarations: [
    NotificacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificacaoPage),
  ],
  providers: [
    Camera
  ]
})
export class NotificacaoPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificacaoPage } from './notificacao';

@NgModule({
  declarations: [
    NotificacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificacaoPage),
  ],
})
export class NotificacaoPageModule {}

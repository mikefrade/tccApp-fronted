import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapaNotificacaoPage } from './mapa-notificacao';

@NgModule({
  declarations: [
    MapaNotificacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(MapaNotificacaoPage),
  ],
})
export class MapaNotificacaoPageModule {}

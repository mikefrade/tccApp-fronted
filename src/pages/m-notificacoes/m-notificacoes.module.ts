import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MNotificacoesPage } from './m-notificacoes';

@NgModule({
  declarations: [
    MNotificacoesPage,
  ],
  imports: [
    IonicPageModule.forChild(MNotificacoesPage),
  ],
})
export class MNotificacoesPageModule {}

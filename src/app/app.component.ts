import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';

  pages: Array<{title: string, component: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar,
     public splashScreen: SplashScreen,  public auth: AuthService
     ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Página Inicial', component: 'PrincipalPage' },
      { title: 'Minhas Notificações', component: 'MNotificacoesPage'},
      { title: 'Perfil', component: 'ProfilePage' },
      { title: 'Sair', component: '' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page: {title: string, component: string}) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    switch (page.title){
      case 'Sair':
      this.auth.logoffFacebook();
      this.nav.setRoot(HomePage);
      break;

      default:
      this.nav.setRoot(page.component);
    }
  }
}

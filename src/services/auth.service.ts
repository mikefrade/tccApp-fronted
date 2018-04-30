import { ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Injectable } from '@angular/core';


@Injectable()
export class AuthService {

    constructor(public facebook: Facebook,
    private toastCtrl: ToastController) {

    }

    loginFacebook() {
        console.log('entrei no login facebook')
        return this.facebook.login(['public_profile', 'email'])
            .then((res: FacebookLoginResponse) => {
                console.log(res.authResponse.accessToken);
                this.toastCtrl.create({ duration: 3000, position: 'bottom', message: 'LOGIN EFETUADO!' });

            })
    }


    logoffFacebook() {
        return this.facebook.logout()
            .then(() => {
                this.toastCtrl.create({ duration: 3000, position: 'bottom', message: 'lOGOFF EFETUADO!' });
            })
    }
}

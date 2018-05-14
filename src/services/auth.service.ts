import { ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Injectable } from '@angular/core';
import { LocalUser } from '../models/local_user';
import { StorageService } from './storage.service';


@Injectable()
export class AuthService {

    constructor(public facebook: Facebook,
        private toastCtrl: ToastController,
        public storage: StorageService) {

    }

    loginFacebook() {
        return this.facebook.login(['public_profile', 'email'])
            .then((res: FacebookLoginResponse) => {
                let user: LocalUser = {
                    token: res.authResponse.accessToken
                };
                this.storage.setLocalUser(user);
            })
    }


    logoffFacebook() {
        this.storage.setLocalUser(null);
        return this.facebook.logout();  
    }
}

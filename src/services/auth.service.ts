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
            .then((response: FacebookLoginResponse) => {
                let params = new Array<string>();
                this.facebook.api("/me?fields=name,email", params)
                    .then(res => {
                        let user: LocalUser = {
                            token: response.authResponse.accessToken,
                            nome: res.name,
                            email: res.email,
                            senha: res.id
                        };
                        this.storage.setLocalUser(user);
                    }, (error) => {
                        alert(error);
                        console.log('ERRO LOGIN: ', error);
                    })
            }, (error) => {
                alert(error);
            });
    }

    logoffFacebook() {
        this.storage.setLocalUser(null);
        return this.facebook.logout();
    }
}

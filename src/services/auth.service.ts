import { ToastController, LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Injectable } from '@angular/core';
import { LocalUser } from '../models/local_user';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';


@Injectable()
export class AuthService {


    isLoggedIn: boolean = false;
    users: any;


    constructor(public fb: Facebook,
        private toastCtrl: ToastController,
        public http: HttpClient,
        public storage: StorageService
    ) {

        fb.getLoginStatus()
            .then(res => {
                console.log(res.status);
                if (res.status === "connect") {
                    this.isLoggedIn = true;
                } else {
                    this.isLoggedIn = false;
                }
            })
            .catch(e => console.log(e));

    }

    /*loginFacebook() {
        return this.facebook.login(['public_profile', 'email'])
            .then((response: FacebookLoginResponse) => {
                let params = new Array<string>();
                this.facebook.api("/me?fields=name,email", params)
                    .then(res => {
                        let loader = this.presentLoading();
                        let user: LocalUser = {
                            token: response.authResponse.accessToken,
                            nome: res.name,
                            email: res.email,
                            senha: res.id
                        };
                        this.storage.setLocalUser(user);
                        loader.dismiss();
                    }, (error) => {
                        alert(error);
                    })
            }, (error) => {
                alert(error);
            });
    }*/

    login() {
        return this.fb.login(['public_profile', 'user_friends', 'email'])
            .then(res => {
                if (res.status === "connected") {
                    this.isLoggedIn = true;
                    this.getUserDetail(res.authResponse.userID);
                } else {
                    this.isLoggedIn = false;
                }
            })
            .catch(e => console.log('Error logging into Facebook', e));
    }

    getUserDetail(userid) {
        this.fb.api("/" + userid + "/?fields=id,email,name,picture", ["public_profile"])
            .then(res => {
                this.users = res;

                let body = {
                    "nome": this.users.name,
                    "email": this.users.email
                };
                this.http.put(`${API_CONFIG.baseUrl}/usuarios/${this.users.email}`,
                    body).subscribe(
                        response => {
                            console.log(response);
                        },
                        error => {
                            alert(error.text());
                            console.log(error);
                        });

                /* let loader = this.presentLoading();
                        let user: LocalUser = {
                            token: res.authResponse.accessToken,
                            nome: res.name,
                            email: res.email,
                            senha: res.id,
                            imgprofile: res.picture.data.url
                        };
                        this.storage.setLocalUser(user);
                        loader.dismiss();*/
            })
            .catch(e => {
                alert(e);
            });
    }

    logoffFacebook() {
        //s this.storage.setLocalUser(null);
        return this.fb.logout().then(res => this.isLoggedIn = false)
            .catch(e => console.log('Error logout from Facebook', e));
    }
}

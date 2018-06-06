import { ToastController, LoadingController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { UsuarioService } from './domain/usuario.service';
import { UsuarioDTO } from '../models/usuario.dto';


@Injectable()
export class AuthService {

    isLoggedIn: boolean = false;
    users: any;

    constructor(public fb: Facebook,
        private toastCtrl: ToastController,
        public http: HttpClient,
        public storage: StorageService,
        public usuarioService: UsuarioService, ) {

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
                    let userid = res.authResponse.userID;
                    this.fb.api("/" + userid + "/?fields=id,email,name,picture", ["public_profile"])
                        .then(res => {
                            this.users = res;
                            let body = {
                                "nome": this.users.name,
                                "email": this.users.email
                            };
                            this.http.put(`${API_CONFIG.baseUrl}/usuarios/${this.users.email}`,
                                body,
                                {
                                    observe: 'response',
                                    responseType: 'text'
                                }).subscribe(
                                    response => {
                                        console.log(response);
                                        this.successfulLogin();
                                    },
                                    error => {
                                        alert(error.text());
                                        console.log(error);
                                    });
                        })
                        .catch(e => {
                            alert(e);
                        });
                } else {
                    this.isLoggedIn = false;
                }
            })
            .catch(e => console.log('Error logging into Facebook', e));
    }

    /* getUserDetail(userid) {
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
             })
             .catch(e => {
                 alert(e);
             });
     }*/

    successfulLogin() {
        this.usuarioService.find(this.users.email)
            .subscribe(response => {
                let ob = JSON.stringify(response)
                this.storage.setUsuarioDTO(JSON.parse(ob));
                //alert("Bem vindo! " + localStorage.getItem('usuarioDTO'));
            }, error => {
                alert("Error usurio: " + JSON.stringify(error));
            });
    }

    logoffFacebook() {
        this.storage.setUsuarioDTO(null);
        return this.fb.logout().then(res => this.isLoggedIn = false)
            .catch(e => console.log('Error logout from Facebook', e));
    }
}


import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { Injectable } from '@angular/core';


@Injectable () 
export class AuthService {

    constructor(public facebook: Facebook) {

    }

    loginFacebook() {
        console.log('entrei no login facebook')
        return this.facebook.login(['public_profile', 'email'])
            .then((res: FacebookLoginResponse) => {
                console.log(res.authResponse.accessToken)
                alert(res.authResponse.accessToken);

            })
    }


    logoffFacebook() {
        return this.facebook.logout()
            .then(() => {
                alert('saiu!');
            })
    }
}

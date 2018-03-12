import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginPage } from '..//login/login';
import { UsersService } from '../../providers/users-service';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html'
})

export class ResetPasswordPage {

  public emailField: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public usersService: UsersService) {}


ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

resetPassword(){
  this.usersService.resetUser(this.emailField).then(authData => {
    alert("Please check your email for password reset")
    this.navCtrl.setRoot(LoginPage);
    loader.dismiss();
    
  }, error => {
    alert("error reset: " + error.code +" "+ error.message);
    loader.dismiss();
  }
  );

    let loader = this.loadingCtrl.create({
    dismissOnPageChange: false,
    })
    loader.present();

  }

}

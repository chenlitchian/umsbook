import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UsersService } from '../../providers/users-service';
//import { HomePage } from '../home/home';

  @Component({
  selector: 'page-user-register',
  templateUrl: 'user-register.html',
  providers: [UsersService]
})

export class UserRegisterPage {

    public emailField: any;
    public passwordField: any;
     public confirmPasswordField: any;
    public contactField: any;
    public nameField: any;
    public schoolField: any;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public navParams: NavParams, private usersService: UsersService, private alert: AlertController) {}


ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegisterPage');
  }

signUserUp(){
  
  if(this.passwordField == this.confirmPasswordField){
  this.usersService.signUpUser(this.emailField, this.passwordField, this.contactField, this.nameField, this.schoolField).then(authData => {

    //this.navCtrl.push(HomePage);
    
    this.usersService.showToast("Sign Up Successfully", 'middle');
    loader.dismiss();
    
  }, error => {
    alert("error sign up:"+ error.message);
    loader.dismiss();
  }
  );
    let loader = this.loadingCtrl.create({
    dismissOnPageChange: false,
})

loader.present();

}
}


}

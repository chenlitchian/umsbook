import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, ToastController, MenuController } from 'ionic-angular';
import { UsersService } from '../../providers/users-service';
//import { TabsPage } from '../tabs/tabs';
import { UserRegisterPage } from '../user-register/user-register';
import { ResetPasswordPage } from '../reset-password/reset-password';
//import * as firebase from 'firebase';


@Component({
  
  templateUrl: 'login.html',
  //providers: [UsersService]
})

export class LoginPage {

  public emailField: any;
  public passwordField: any;
  public error: any;
 
  constructor(private alert: AlertController,  private menuCtrl: MenuController, private loadingCtrl: LoadingController, private toastCtrl:ToastController, private navCtrl: NavController, private modalCtrl: ModalController, private usersService: UsersService) {     
this.menuCtrl.enable(false); 
}

ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
}

submitLogin(){
  	
  	this.usersService.loginUser(this.emailField, this.passwordField).then(authData => {
    
  	this.showToast("logged in successfully", 'middle');    
    
		 loader.dismiss().then(()=>{

		 });
    	}, error => {
  		
			alert("error logging in: "+ error.message);
      
			loader.dismiss();
      console.log('error login');
  	});
  	
  	let loader = this.loadingCtrl.create({
  		dismissOnPageChange: false,
  	});
  	
  	loader.present();
    }
    

redirectToUserRegisterPage(){
  	this.navCtrl.push(UserRegisterPage);
  }

redirectToPasswordReset(){
  	this.navCtrl.push(ResetPasswordPage);
  }

showToast(message, position) {      
    let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: position,
  });
  toast.present();
  }
 
}

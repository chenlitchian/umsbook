import { Component,  ViewChild } from '@angular/core';
import { App, Nav, Platform, AlertController, ToastController } from 'ionic-angular';
import { /*StatusBar,*/ Splashscreen} from 'ionic-native';

import { LoginPage } from '../pages/login/login';
import * as firebase from 'firebase';
import { AngularFire } from 'angularfire2';
import { UsersService } from '../providers/users-service';
import { TabsPage } from '../pages/tabs/tabs';
//import { PostBookPage } from '../pages/post-book/post-book';
//import { SearchBookPage } from '../pages/search-book/search-book';
//import { UserDetail2Page } from '../pages/user-detail2/user-detail2';
import { SettingPage } from '../pages/setting/setting';

@Component({
  templateUrl: 'app.html',
  
})

export class MyApp {
    @ViewChild(Nav) nav: Nav;
alert;
user;
photoURL;
email;
name;
//= "img/userpic.png";
 public rootPage:any; 
 //= TabsPage;
 pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public toastCtrl: ToastController, public af: AngularFire, public app: App, public usersService: UsersService, public alertCtrl: AlertController) {

this.user = firebase.auth().currentUser;
//this.photoURL = "img/userpic.png";
   platform.ready().then(() => {
     platform.registerBackButtonAction(() => {


            //uncomment this and comment code below to to show toast and exit app
            // if (this.backButtonPressedOnceToExit) {
            //   this.platform.exitApp();
            // } else if (this.nav.canGoBack()) {
            //   this.nav.pop({});
            // } else {
            //   this.showToast();
            //   this.backButtonPressedOnceToExit = true;
            //   setTimeout(() => {

            //     this.backButtonPressedOnceToExit = false;
            //   },2000)
            // }

            if(this.nav.canGoBack()){
              this.nav.pop();
            }else{
              if(this.alert){ 
                this.alert.dismiss();
                this.alert =null;     
              }else{
                this.showAlert();
               }
            }
          });
     
     
     this.pages = [
      { title: 'Homepage', component: TabsPage },
    ];
this.hideSplashScreen();
});
  
firebase.auth().onAuthStateChanged((user) => {
 
		if(user){
      this.rootPage = TabsPage;
      console.log('user logged in');
      
      this.photoURL = firebase.auth().currentUser.photoURL;
      this.name = firebase.auth().currentUser.displayName;
      this.email = firebase.auth().currentUser.email;
      console.log(this.name + " " + this.email + " "+this.photoURL);
		}else {
			this.rootPage = LoginPage;
       this.photoURL = "img/userpic.png";
      console.log('no user is logged in, display LoginPage')
		}
		
	});

 // this.photoURL = "img/userpic.png";

}
myHandlerFunction(){
     let toast = this.toastCtrl.create({
      message: "Press Again to Confirm Exit",
      duration: 3000
    });
    toast.present(); 
     }

openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    
  }

open(i){
this.app.getRootNav().getActiveChildNav().select(i);
}
 
setting(){
    this.nav.push(SettingPage);
}


showAlert() {
      this.alert = this.alertCtrl.create({
        title: 'Exit?',
        message: 'Do you want to exit the app?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              this.alert =null;
            }
          },
          {
            text: 'Exit',
            handler: () => {
              this.platform.exitApp();
            }
          }
        ]
      });
      this.alert.present();
    }

      showToast() {
        let toast = this.toastCtrl.create({
          message: 'Press Again to exit',
          duration: 2000,
          position: 'bottom'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      }

logOut(){

let alert = this.alertCtrl.create({
    title: 'Confirm Log Out',
    message: 'Are you sure you want to log out?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Log Out',
        handler: () => {
            this.usersService.logoutUser().then(() =>{
    // this.nav.setRoot(LoginPage);   
    }).catch(function(err) {
  console.error(err)
});
          console.log('Logged out');
        }
      }
    ]
  });
  alert.present();
}

hideSplashScreen() {
  
  
    if (Splashscreen) {
        setTimeout(() => {
            Splashscreen.hide();
        }, 10000);
    }
  
}


}
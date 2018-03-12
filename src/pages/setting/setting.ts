import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, AlertController,App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { UsersService } from '../../providers/users-service';
import { HintModalPage } from './hint-modal/hint-modal';
import { WalkthroughModalPage } from './walkthrough-modal/walkthrough-modal';
//import { Feedback } from '../feedback/feedback';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {
  rootPage: any;
    items: Array<{ title: string, page: any }>;
shownGroup = null;
Feedback;
pep;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public app: App, public navParams: NavParams, public alertCtrl: AlertController, public usersService: UsersService) {
    this.pep = true;
    //this.Feedback = Feedback;
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

openHintModal(){
  let myModal = this.modalCtrl.create(HintModalPage);
  myModal.present();
}

  openWalkthroughModal() {
        let myModal = this.modalCtrl.create(WalkthroughModalPage);
        myModal.present();
    }

logUserOut(){
  	
    let prompt = this.alertCtrl.create({
      title: 'Log Out',
      message: "Logging Out...",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
          this.usersService.logoutUser().then(() => {
          this.app.getRootNav().setRoot(LoginPage);
  });
          console.log('logged out');
          this.usersService.showToast('logged out successfully','top');
           
        },
        }
      ]
    });
        prompt.present();
      }
  
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
};
isGroupShown(group) {
    return this.shownGroup === group;
};

pushToFeedback() {
  console.log("to feedback")
  this.navCtrl.push('feedback');
}
show(){
  this.pep = !this.pep;
 // console.log(this.pep);
  console.log("toggle")
}

updatePassword(){

  let alert = this.alertCtrl.create({
    title: 'Please enter your password',
    inputs: [
      {
        name: 'password',
        placeholder: 'Password',
        type: 'password'
      },
       {
        name: 'newPassword',
        placeholder: 'New Password',
        type: 'password'
      },
       {
        name: 'confirmPassword',
        placeholder: 'Confirm New Password',
        type: 'password'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'OK',
        handler: data => {

          
          console.log(data.password);
          console.log(data.newPassword);
          console.log(data.confirmPassword);
          if(data.confirmPassword == data.newPassword){
            this.usersService.updatePassword(data.password, data.newPassword);
          }
          if(data.confirmPassword != data.newPassword){
            this.usersService.showToast("password not matched, Please try again","middle");
          }

        }
      }
    ]
  });
  alert.present();


}

}

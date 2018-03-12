import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { SettingPage } from '../setting/setting';
import { LoginPage } from '../login/login';
import { UserdetailpagePage } from '../userdetailpage/userdetailpage';
import { UsersService } from '../../providers/users-service';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class PopoverContentPage {

  constructor(public viewCtrl: ViewController, public usersService: UsersService, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

close() {
    this.viewCtrl.dismiss();
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
            this.navCtrl.setRoot(LoginPage).then(() => {
              this.usersService.logoutUser();

            });
         // this.usersService.logoutUser().then(() => {
          
 // });
          console.log('logged out');
          this.usersService.showToast('logged out successfully','middle');
        },
        }
      ]
    });
        prompt.present();
        }

redirectToSettingPage(){

  	this.navCtrl.push(SettingPage);
    console.log('settingpage page');
  }  

redirectToUserDetailPage(){

  	this.navCtrl.push(UserdetailpagePage);
    console.log('userdetailpage page');      
  }

}

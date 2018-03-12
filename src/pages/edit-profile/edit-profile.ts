import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, App, AlertController } from 'ionic-angular';
import { UsersService } from '../../providers/users-service';
//import { UserdetailpagePage } from '../userdetailpage/userdetailpage';
//import { HomePage } from '../home/home';
//import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})

export class EditProfilePage {

name: string = this.navParams.get("username");
email: string = this.navParams.get("email");
contact: string = this.navParams.get("contact");
school: string = this.navParams.get("school");
password;
public nameField: any = this.name;
public emailField: any = this.email;
public contactField: any = this.contact;
public schoolField: any = this.school;
public passwordField: any = this.password;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public app: App, public navParams: NavParams, public toastCtrl: ToastController, public viewCtrl: ViewController, public usersService: UsersService) {
    
  }

ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }


showToast(message, position) {
          
    let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: position,

  });
  toast.present();
}

closeModal(password) {
    var myUserId = this.usersService.getUserId();
    this.usersService.updateUser(myUserId, this.nameField, this.emailField, this.contactField, this.schoolField, password);  
    this.viewCtrl.dismiss(); 
}

 returnToUserDetailPage(){
      this.viewCtrl.dismiss();
  }

presentPrompt() {
  let alert = this.alertCtrl.create({
    title: 'Please enter your password',
    inputs: [
      {
        name: 'password',
        placeholder: 'Password',
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

          this.passwordField = data.password; 
          this.closeModal(data.password);
        }
      }
    ]
  });
  alert.present();
}


}

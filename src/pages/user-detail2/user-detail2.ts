import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, App, ToastController, AlertController, ActionSheetController, ModalController, ViewController } from 'ionic-angular';
import { UsersService } from '../../providers/users-service';
//import { LoginPage } from '../login/login';
import { SettingPage } from '../setting/setting';
import * as firebase from 'firebase';
import { Camera } from 'ionic-native';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { TabsPage } from '../tabs/tabs';
//import { HttpModule } from '@angular/http';

import {
    AngularFire,
    FirebaseObjectObservable
} from 'angularfire2';

@Component({
  selector: 'page-user-detail2',
  templateUrl: 'user-detail2.html'
})
export class UserDetail2Page {

  
userId: any;
myUserProfile: any;
myUserId: any;
subscription;
password;
public currentUser: any;
public myPhotosRef: any;
public myPhoto: any;
private userPhotoUrl:any;
public usernewPhotoUrl:any;
public userDisplayName:any;
public userName:any;
private userContact:any;
private userEmail:any;
private userSchool:any;
user: FirebaseObjectObservable<any>;
user1: FirebaseObjectObservable<any>;
photo;

  constructor(public navCtrl: NavController, public af: AngularFire,  public app: App, private toastCtrl: ToastController,private loadingCtrl: LoadingController, public viewCtrl: ViewController, public navParams: NavParams, public usersService: UsersService, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController) {

 this.myUserId = firebase.auth().currentUser.uid; 
    this.user = af.database.object('/user/' + this.myUserId);
    this.user1 = af.database.object('/user/' + this.myUserId, { preserveSnapshot: true });
this.myPhotosRef = firebase.storage().ref('/UserPhotos/');
    this.myUserProfile = firebase.database().ref('user');
    //this.photo = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRSu4Rq5MxHblfGgFxZOYMkTo0Qt8cvajNlzUDoNhF8WoAyl6OyUQ';
    this.photo = 'http://i66.tinypic.com/66b2xg.jpg';
    }

ionViewDidLoad() {
 
     let loader = this.loadingCtrl.create({
    content: 'Loading...',
  });

  loader.present().then(() => {
   this.subscription = this.user1.subscribe(snapshot => {
    this.currentUser = snapshot.val();
   this.currentUser.key = snapshot.key;
    this.userPhotoUrl = this.currentUser.photo; //get user photo
    this.userDisplayName = this.currentUser.username;
    this.userContact = this.currentUser.contact;
    this.userName = this.currentUser.username;
    this.userEmail = this.currentUser.email;
    this.userSchool = this.currentUser.school;
   console.log('current user key',snapshot.key);
    console.log('current user',snapshot.val());
    this.update();
    loader.dismiss();
    });
    
  });

    console.log('ionViewDidLoad UserdetailpagePage');
}

ngOnDestroy(){

      this.subscription.unsubscribe();
      console.log('ng destroy subscription');

}

ionViewWillEnter() { 
    
    console.log('ionViewWillEnter UserdetailpagePage'); 
  }
  
openModal() {
    
    let obj = this.currentUser;
    let myModal = this.modalCtrl.create(EditProfilePage, obj);
    myModal.onDidDismiss(data => {
      
    });
    myModal.present();
}

takePhoto() {
    Camera.getPicture({
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.PNG,
      saveToPhotoAlbum: false,
       allowEdit : true, 
        targetWidth: 100,
  targetHeight: 100,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
 
selectPhoto(): void {
    Camera.getPicture({
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.DATA_URL,
      quality: 50,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 200,
  targetHeight: 200,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });

  }
 
 private uploadPhoto(): void {
    this.myPhotosRef.child(this.generateUUID()).child('myPhoto.png')
      .putString(this.myPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.usernewPhotoUrl = savedPicture.downloadURL;
      });
  }

private generateUUID(): any{
  var uuid = firebase.auth().currentUser.uid;
  return uuid;
}

redirectToHomePage(){
  	this.navCtrl.push(SettingPage);
   
    console.log('Setting page'); 
}

presentPrompt() {
  let alert = this.alertCtrl.create({
    title: 'Remove Account',
      message: "Are you sure want to remove account? This action cannot be undone. Please enter your password",
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
         this.subscription.unsubscribe();
         this.password = data.password;
        // this.removeAcc();
        this.usersService.removeUserAccount(data.password, this.myUserId);
        }
      }
    ]
  });
  alert.present();
}

editUserPhoto(){
  this.selectPhoto();
  {

    let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: "Edit your photo",
      
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {

          
          
          this.usersService.updatePhoto(this.myUserId, this.usernewPhotoUrl).then(() => {

          });
          this.showToast('Profile pic updated','middle');
          console.log('Saved photo');
        }
       }
      ]
    });
    prompt.present();
    }
}

editUserPhotoCamera(){
      
      this.takePhoto();
      let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: "Edit your photo",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {

         // var userId = firebase.auth().currentUser.uid;
          this.usersService.updatePhoto(this.myUserId, this.usernewPhotoUrl).then(() => {
        
            this.app.getRootNav().setRoot(TabsPage);


          });
          this.showToast('Photo updated', 'middle');
          console.log('Saved clicked');
        }
       }
      ]
    });
    prompt.present();
}

 presentActionSheet(){
   let alert = this.alertCtrl.create({
     title: 'Edit Profile Picture',
     buttons: [
       {
         text: 'Camera',
         handler: () => {
           this.editUserPhotoCamera();
           console.log(' take photo clicked');
         }
       },
       {
         text: 'Gallery',
         handler: () => {
           this.editUserPhoto();
           console.log('select photo clicked');
         }
       }, 
     ]
   });
          alert.present();
}

showToast(message, position) {
          
    let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: position,

  });
  toast.present();
}

update(){
  var user = firebase.auth().currentUser;

user.updateProfile({
  displayName:  this.userDisplayName,
  photoURL:  this.userPhotoUrl,
}).then(function() {
  // Update successful.
}, function(error) {
  // An error happened.
});
}


}

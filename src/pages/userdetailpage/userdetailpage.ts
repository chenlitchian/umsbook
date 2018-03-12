import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, NavParams, App, ToastController, AlertController, ActionSheetController, ModalController, ViewController } from 'ionic-angular';
import { UsersService } from '../../providers/users-service';
//import { LoginPage } from '../login/login';
import { SettingPage } from '../setting/setting';
import * as firebase from 'firebase';
import { Camera } from 'ionic-native';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { TabsPage } from '../tabs/tabs';


@Component({
  selector: 'page-userdetailpage',
  templateUrl: 'userdetailpage.html',
})

export class UserdetailpagePage {

userId: any;
myUserProfile: any;
myUserId: any;
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

  constructor(public navCtrl: NavController,  public app: App, private platform: Platform, private toastCtrl: ToastController, public loadingCtrl: LoadingController, public viewCtrl: ViewController, public navParams: NavParams, public usersService: UsersService, private alertCtrl: AlertController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController) {


    this.myUserId = firebase.auth().currentUser.uid; 
    //var myUser = firebase.auth().currentUser;
    this.myPhotosRef = firebase.storage().ref('/UserPhotos/');
    this.myUserProfile = firebase.database().ref('user');
    
    }

ionViewDidLoad() {
      
  let loader = this.loadingCtrl.create({
      spinner : 'bubbles',
      content : `Loading...`
    });
    loader.present().then(() => {
      this.displayUser();
      loader.dismiss().then(() => {
        console.log("Loading dismissed");
      });
    })
    
    console.log('ionViewDidLoad UserdetailpagePage');
}
  
openModal() {
    
    let obj = this.currentUser;
    let myModal = this.modalCtrl.create(EditProfilePage, obj);
    myModal.onDidDismiss(data => {
      
    });
    myModal.present();
  }

displayUser(){
  
  return this.usersService.getUserDetail().once('value', snapshot => {

    this.currentUser = snapshot.val();
    this.currentUser.key = snapshot.key;
    this.userPhotoUrl = this.currentUser.photo; //get user photo
    this.userDisplayName = this.currentUser.username;
    this.userContact = this.currentUser.contact;
    this.userName = this.currentUser.username;
    this.userEmail = this.currentUser.email;
    this.userSchool = this.currentUser.school;
  });  
   
}

takePhoto() {
    Camera.getPicture({
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.PNG,
      saveToPhotoAlbum: true,
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
      allowEdit: true,
      quality: 50,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 100,
  targetHeight: 100,
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

          //var userId = firebase.auth().currentUser.uid;
          
          this.usersService.updatePhoto(this.myUserId, this.usernewPhotoUrl).then(() => {

          this.app.getRootNav().setRoot(TabsPage);
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
}

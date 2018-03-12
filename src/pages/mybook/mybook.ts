
import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController, AlertController, ModalController, ActionSheetController, ViewController, ToastController  } from 'ionic-angular';
import { BooksService } from '../../providers/books-service';
import * as firebase from 'firebase';
//import { UsersService } from '../../providers/users-service';
import { SampleModalPage } from '../sample-modal/sample-modal';
import { Camera } from 'ionic-native';

@Component({
  selector: 'page-mybook',
  templateUrl: 'mybook.html'
})
export class MybookPage {

currentEvent: any;
bookList: any;
bookid: any;
title;
author;
isbn;
photo;
category;
postedby;
postedon;
detail;
status;
price;
currentBook: any;
id;
public myBookPhotosRef: any;
public myBookPhoto: any;
public bookNewPhotoUrl:any;
public book: any;

constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public booksService: BooksService, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController) {

  this.bookid = this.navParams.get('book');
//  this.displayBook(this.bookid); 
  
 // this.bookList = firebase.database().ref('books');
  this.myBookPhotosRef = firebase.storage().ref('/BookPhotos/');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookDetailByidPage');
     this.displayBook(this.bookid);
  }

  displayBook(myBookId){

   this.booksService.getBookDetail(myBookId).on('value', snapshot => {
    this.currentEvent = snapshot.val();
   // this.currentEvent.key = snapshot.key;
    this.title = snapshot.val().title;
    this.photo= snapshot.val().photo;
    this.status = snapshot.val().status;
    this.price = snapshot.val().price;
    this.isbn = snapshot.val().isbn;
    this.author = snapshot.val().author;
    this.category = snapshot.val().category;
    this.postedon = snapshot.val().postedon;
    this.postedby = snapshot.val().postedby;
    this.detail = snapshot.val().detail;
    this.id  = this.currentEvent.key;
   // console.log(snapshot.key);
  //  console.log(this.currentEvent.status);
  //  console.log(this.title);
  //  console.log('book object',snapshot.val());
  });
}


presentEditActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Action',
     buttons: [
       {
         text: 'Edit Book',
         handler: () => {
          this.openModal();
           
         }
       },
       {
         text: 'Change Picture',
         handler: () => {
          this.presentdEditphotoActionSheet();
           
         }
       },
       {
         text: 'Remove Book',
         handler: () => {
           this.removeMyBook();
           console.log('remove clicked');
         }
       },
       {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });

   actionSheet.present();
 }


showToast(message, position) {
        
      
    let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: position,
  });
  toast.present();
}


presentdEditphotoActionSheet(){

    let prompt = this.alertCtrl.create({
     title: 'Edit Book Picture',

     buttons: [
       {
         text: 'Camera',
         handler: data => {
           this.editMyBookPhotoCamera();
           console.log(' take photo clicked');
         }
       },
       {
         text: 'Gallery',
         handler: data => {
           this.editMyBookPhoto();
           console.log('select photo clicked');
         }
       }, 
     ]
   });

    prompt.present();
 }

takePhoto() {
   return Camera.getPicture({
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.PNG,
      saveToPhotoAlbum: false,
       allowEdit : true, 
        targetWidth: 100,
  targetHeight: 100,
    }).then(imageData => {
      this.myBookPhoto = imageData;
      this.uploadPhoto();
    }).catch(function(err) {
  console.error(err);
  alert("ERROR -> " + JSON.stringify(err));
});
  }
 
  selectPhoto(): void {
    Camera.getPicture({
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.DATA_URL,
      quality: 50,
      encodingType: Camera.EncodingType.PNG,
        allowEdit : true, 
      targetWidth: 200,
  targetHeight: 200,
    }).then(imageData => {
      this.myBookPhoto = imageData;
      this.uploadPhoto();
    }).catch(function(err) {
  console.error(err);
  alert("ERROR -> " + JSON.stringify(err));
});

  }
 
private uploadPhoto(): void {
    this.myBookPhotosRef.child(this.generateUUID()).child('myBookPhoto.png')
      .putString(this.myBookPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.bookNewPhotoUrl = savedPicture.downloadURL;
      }).catch(function(err) {
  console.error(err)
});
  }

private generateUUID(): any{
    
    var uuid = this.currentEvent.id;
    return uuid;
}

editMyBookPhoto(){

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

          var mybookId = this.currentEvent.id;
          this.booksService.updatePhoto(mybookId, this.bookNewPhotoUrl).then(() => {
          
          this.navCtrl.pop();
}).catch(function(err) {
  console.error(err)
});
          this.showToast('book photo updated', 'middle');
          console.log('Saved clicked, photo updated');
        }
       }
      ]
    });
    prompt.present();
}

}


editMyBookPhotoCamera(){

this.takePhoto().then(() =>{
  var mybookId = this.currentEvent.id;
 this.booksService.updatePhoto(mybookId, this.bookNewPhotoUrl).then(() => {
       
          this.navCtrl.pop();
           loading.dismiss();
     
}).catch(function(err) {
  console.error(err)
});
let loading = this.loadingCtrl.create({content:'Uploading'});
      loading.present();
}).catch(function(err) {
  console.error(err)
});
}



openModal() {
 
    let obj = {id: this.id, category: this.category, price: this.price, title: this.title, author: this.author, isbn: this.isbn, detail: this.detail, status: this.status};
    let myModal = this.modalCtrl.create(SampleModalPage, obj);
    myModal.onDidDismiss(data => {
     
     //this.currentEvent = this.navParams.get('book');
     console.log(obj);
    });
    myModal.present();
  }


removeMyBook(){
 
 let prompt = this.alertCtrl.create({
      title: 'Remove Book',
      message: "You are about to remove this book. This action cannot be undone",
      
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove',
          handler: data => {

           // var mybookId = this.bookid;
              
            this.booksService.removeBookGlobal(this.bookid).then(() => {
    
            this.showToast('book removed', 'bottom');
           console.log('book removed');       
    }).catch(function(err) {
       alert("error2!!!");
  console.error(err);
});
         
            this.viewCtrl.dismiss();
          },
        }
      ]
    });
    prompt.present();
}

}


import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController, ActionSheetController, ViewController, ToastController } from 'ionic-angular';
import { BooksService } from '../../providers/books-service';
import * as firebase from 'firebase';
import { SampleModalPage } from '../sample-modal/sample-modal';
import { Camera } from 'ionic-native';

@Component({
  selector: 'page-my-book-detail',
  templateUrl: 'my-book-detail.html'
})

export class MyBookDetailPage {

currentBook: any;
bookList: any;
bookid: any;
public myBookPhotosRef: any;
public myBookPhoto: any;
public bookNewPhotoUrl:any;
public book: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public booksService: BooksService, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController){

     this.book = this.navParams.get('book');
    this.myBookPhotosRef = firebase.storage().ref('/BookPhotos/');
  }

ionViewDidLoad() {
  this.book = this.navParams.get('book');
  console.log('the book selected' ,this.book);
  console.log('the book id',this.book.id);
}

openModal() {
 
    let obj = this.book;
    let myModal = this.modalCtrl.create(SampleModalPage, obj);
    myModal.onDidDismiss(data => {
     

      this.book = data;
     console.log(data);
    });
    myModal.present();
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
    
    var uuid = this.book.id;
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

          var mybookId = this.book.id;
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
/*
var mybookId = this.book.id;
this.takePhoto().then(() =>{
  
 this.booksService.updatePhoto(mybookId, this.bookNewPhotoUrl).then(() => {
       
       alert("this is book photo url:  " +  this.bookNewPhotoUrl);
        //  this.navCtrl.pop();
          // loading.dismiss();
     
}).catch(function(err) {
  console.error(err);
  alert(err);
});
//let loading = this.loadingCtrl.create({content:'Uploading'});
  //    loading.present();
}).catch(function(err) {
  console.error(err);
  alert(err);
});
*/
this.takePhoto();
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

          var mybookId = this.book.id;
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




showToast(message, position) {
        
      
    let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: position,
  });
  toast.present();
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
            var mybookId = this.book.id;
            this.booksService.removeBook(mybookId).then(() => {
        this.viewCtrl.dismiss().then(() =>{
            this.showToast('book removed', 'bottom');
        });
    }).catch(function(err) {
  console.error(err)
});
            console.log('book removed');         
          },
        }
      ]
    });
    prompt.present();
}

}



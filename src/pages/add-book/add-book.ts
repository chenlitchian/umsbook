import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, LoadingController, AlertController, ViewController, ActionSheetController } from 'ionic-angular';
import { BooksService } from '../../providers/books-service';
import firebase from 'firebase';
import { Camera } from 'ionic-native';
import { UsersService } from '../../providers/users-service';
import { PostBookPage } from '../post-book/post-book';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})

export class AddBookPage {

  public myUserId: any;
  public myBookPhotosRef: any;
  public bookPhoto: any;
  public bookPhotoUrl:any;
  public bookPhotoUrl1:any;

 public booktitleField: any;
 public bookauthorField: any;
 public bookisbnField: any;
 public bookpriceField: any;
 public bookcategoryField: any; 
 public bookdetailField: any;

 public bookpic: any;
 public userId: any;
 public username: any;


  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public navParams: NavParams, public viewCtrl: ViewController, public usersService: UsersService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private booksService: BooksService) {
    
      this.myUserId = firebase.auth().currentUser.uid; 
      this.myBookPhotosRef = firebase.storage().ref('/BookPhotos/');
      
  }
  
  ionViewDidLoad() {
    this.displayUser(this.myUserId);
    console.log('ionViewDidLoad AddBookPage');
  }


displayUser(theUserId){

 var that = this;
 
 this.usersService.viewUser(theUserId).then(snapshot => {

 that.username = snapshot.val().username;

  console.log('username2', this.username);  
  
}); 
  console.log("this is user detail");
}



addBook(){
console.log('add button clicked');
console.log(this.booktitleField);
console.log(this.bookauthorField);
console.log(this.bookisbnField);
console.log(this.bookpriceField);
console.log(this.bookcategoryField);
console.log(this.bookdetailField);
 console.log('username4', this.username);  
this.bookPhotoUrl ="img/book-default-image.jpg";
var myUserId = firebase.auth().currentUser.uid;
 

 let prompt = this.alertCtrl.create({
      title: 'Sell Book',
      message: "Please Confirm your item",
      
      
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Okay',
          handler: data => {
            
    this.booksService.postBook(this.username, this.booktitleField, this.bookauthorField, this.bookisbnField, this.bookpriceField, this.bookcategoryField, this.bookdetailField, this.bookPhotoUrl, myUserId).then(() => {
        
    });
    console.log('Your book has been added.');
    
    this.presentdEditphotoActionSheet();
    this.showToast('Book added successfully', 'bottom');

    console.log(this.booksService.getBookKey());
    console.log('book added');
            
          },
        }
      ]
    });
    prompt.present();
}


 showToast(message, position) {
          
    let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: position,

  });
  toast.present();
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
      this.bookPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });

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
      this.bookPhoto = imageData;
      this.uploadPhoto();
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
 
 
  uploadPhoto(): void {

     let loader = this.loadingCtrl.create({
      spinner : 'bubbles',
      content : `Loading...`
    });
    
    loader.present().then(() => {
    this.myBookPhotosRef.child(this.generateUUID()).child('myBookPhoto.png')
      .putString(this.bookPhoto, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.bookPhotoUrl1 = savedPicture.downloadURL;
      });
       loader.dismiss();
    });

    
  }
 
  private generateUUID(): any {
   var uuid = this.booksService.getBookKey();
    return uuid;
  }


presentdEditphotoActionSheet(){

  let prompt = this.alertCtrl.create({
     title: 'Add Book Picture',

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


editMyBookPhoto(){


    this.selectPhoto();
  {
    
    let prompt = this.alertCtrl.create({
      title: 'Upload Photo',
      
      
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

          var mybookId =  this.booksService.getBookKey();
          var burl = this.bookPhotoUrl1;
          this.booksService.updatePhoto(mybookId, burl).then(() => {
        
          
          this.navCtrl.pop();
          console.log('Photo updated');
          this.showToast('book photo added successfully','bottom');
          console.log('Saved clicked');
          
        });
        
       }
        }
      ]
    });
    prompt.present();
  

}
}


editMyBookPhotoCamera(){


    this.takePhoto();
  {
    
    let prompt = this.alertCtrl.create({
      title: 'Upload Photo',
      
      
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
            
this.navCtrl.setRoot(HomePage).then(() => {
this.navCtrl.push(PostBookPage);
});
          }
        },
        {
          text: 'Save',
          handler: data => {

          var mybookId =  this.booksService.getBookKey();
          var burl = this.bookPhotoUrl1;
          this.booksService.updatePhoto(mybookId, burl).then(() => {
        
this.navCtrl.setRoot(HomePage).then(() => {
this.navCtrl.push(PostBookPage);
});
             
          console.log('Photo updated');
          this.showToast('book photo added successfully','middle');
          console.log('Saved clicked');
          
        });
        
       }
        }
      ]
    });
    prompt.present();
  

}
}

}

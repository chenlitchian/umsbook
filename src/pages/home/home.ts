import { Component, ViewChild } from '@angular/core';
import { Platform, Content, NavController, ToastController, NavParams, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { UsersService } from '../../providers/users-service';
import { SearchBookPage } from '../search-book/search-book';
import { InboxPage } from '../inbox/inbox';
import { BooksService } from '../../providers/books-service';
import { Network } from '@ionic-native/network';
import { Category } from '../category/category';
import firebase from 'firebase';
import { BookDetailPage } from '..//book-detail/book-detail';

@Component({
  selector: 'page-home', 
  templateUrl: 'home.html',
 // providers: [UsersService, Network]
 providers: [Network]
})

export class HomePage {
  
	@ViewChild(Content) content: Content;
  showToolbar: boolean = false;

  searchBookPage = SearchBookPage;
  Inbox;
  Wishlist;
	public user: any;
bookRef: any;
bookList: any;
sorting: any;
userChatRef;
userId;
userRef;
noti;
currentUser;

  constructor(private network: Network, private toastCtrl: ToastController, private platform: Platform, private alertCtrl: AlertController, public popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams, private usersService: UsersService, private loadingCtrl: LoadingController, private booksService: BooksService) {
   
   this.Inbox = InboxPage;
   this.sorting = 5;
  // this.Wishlist = FavoriteBookPage;
//   this.user = this.navParams.get('user');
this.user = firebase.auth().currentUser;
this.userId = firebase.auth().currentUser.uid;
//this.noti = false;
  // this.platform.ready().then(() => {
 // });
 this.bookRef = firebase.database().ref('/books'); 
 this.userChatRef = firebase.database().ref('/user/' + this.userId + '/chat/');
 this.userRef = firebase.database().ref('/user/' + this.userId);
}
/*
displayNetworkUpdate(connectionState: string){
 // let networkType = this.network.type;
  
  this.toastCtrl.create({
    message: 'You are now ' + connectionState,
    duration: 3000,
    position: 'middle',
  }).present();

}*/

ionViewDidLoad(){
let loader = this.loadingCtrl.create({
      content: 'Loading book...',
  		dismissOnPageChange: false,
  	  });

     loader.present().then(() => {
//this.checkNewMessage();
this.checkNotification();
    this.bookRef.on('value', bookList =>{

      let books = []; 
      bookList.forEach( book => {
      books.push({
        
            key: book.key,
            title: book.val().title,
            author: book.val().author,
            photo: book.val().photo,
            isbn: book.val().isbn,
            postedby: book.val().postedby,
            postedon: book.val().postedon,
            status: book.val().status,
            detail: book.val().detail,
            price: book.val().price,
            category: book.val().category,
            sellerId: book.val().sellerId,
       
          });  
      });
      loader.dismiss().then(()=>{
     // this.checkUserVerified();  
    });
 
      this.bookList = books; 
      this.sort(); 
     // this.showToolbar = true;
    
    }); 
     
     

      });
    
      //console.log("notification2: " + this.noti);
  console.log('homepage')
 

}  



sort(){

  this.bookList.sort(function(a, b){

    var nameA=a.postedon, nameB=b.postedon
    //return new Date(nameB.start).getTime() - new Date(nameA.start).getTime()
  return nameB - nameA;
});
  

console.log("sort complete");
}


    checkUserVerified(){
  if(this.user.emailVerified == false){
    this.doConfirm();
   // alert("please check your email for account verification");
  }
  console.log(firebase.auth().currentUser.emailVerified);
    }


  doConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Verification needed',
      message: 'To verify your account, all you have to do is click the link sent to you in the verification email. ',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.usersService.logoutUser();
          }
        }
      ],
      enableBackdropDismiss: false,
    });

    alert.present();
  }

toggleToolbar() {
    this.showToolbar = !this.showToolbar;
    this.content.resize();
  } 

/*
this.network.onConnect().subscribe(data => {
  console.log(data)
  this.displayNetworkUpdate(data.type);
}, error => console.error(error));

this.network.onDisconnect().subscribe(data => {
  console.log(data)
  this.displayNetworkUpdate(data.type);
}, error => console.error(error)); */

ToWishlist(){
  	this.navCtrl.push('favorite');
  }


 ToInbox(){
   console.log("to inbox")
this.userRef.update(
  {
    "notification": false
  });
  this.navCtrl.push('inbox');
 }
ToCategory(){
  	this.navCtrl.push(Category);
  } 

goToDetail(item){
  this.navCtrl.push(BookDetailPage, {
    item:item
  });
}

checkNotification(){
   console.log("checking notication.....");
   
    
  this.userRef.on("value", snapshot => {

  //  this.currentUser = snapshot.val();
   // this.noti = this.currentUser.notification;
    this.noti =  snapshot.val().notification;
    //alert("notification: " + this.noti);
     //console.log("notification: " + this.noti);
   
    this.presentToast();
  });  
}

presentToast(){
   if(this.noti === true){
this.toastCtrl.create({
    message: 'You have new message',
    duration: 2000,
    position: 'center',
    showCloseButton: true,
  }).present();
   console.log("toast...");
}
}

}


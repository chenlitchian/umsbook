import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController, ActionSheetController } from 'ionic-angular';
import { BooksService } from '../../providers/books-service';
import * as firebase from 'firebase';
import { UsersService } from '../../providers/users-service';

@Component({
  selector: 'page-book-detail-byid',
  templateUrl: 'book-detail-byid.html'
})
export class BookDetailByidPage {

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
sellerId;
chatexist;
usersRef;
existingChatId;
name;
chatId;
anyUser;
userphoto2url;
userphoto1url;

firstMessage;


constructor(public navCtrl: NavController, public LoadingCtrl: LoadingController, public usersService: UsersService, public navParams: NavParams, public alertCtrl: AlertController, public booksService: BooksService, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController) {

  this.bookid = this.navParams.get('bookId');
//  this.displayBook(this.bookid); 
  this.bookList = firebase.database().ref('books');
  this.usersRef = firebase.database().ref('/user/' + firebase.auth().currentUser.uid + '/chat/');
 this.chatexist = false;
 this.userphoto1url = firebase.auth().currentUser.photoURL;

  

  }

  ionViewDidLoad() {
     let loader = this.LoadingCtrl.create({
      spinner : 'bubbles',
      content : `Loading...`
    });
    loader.present().then(() => {
    this.displayBook(this.bookid);
    this.getSenderName(this.sellerId);
      this.checkExist(this.sellerId);
       this.getUser2Photo();
        this.createMessage();
       loader.dismiss();
    });
    
    
    console.log('ionViewDidLoad BookDetailByidPage');
  }


createMessage(){
  this.firstMessage = "Hi, I'm interested in buying " + this.title;
  console.log(this.firstMessage);
}

  displayBook(myBookId){

   return this.booksService.getBookDetail(myBookId).on('value', snapshot => {
    this.currentEvent = snapshot.val();
    this.currentEvent.key = snapshot.key;
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
   this.sellerId = snapshot.val().sellerId;
  });
}



getSenderName(senderId){

 var that = this;
 
 this.usersService.viewUser(senderId).then(snapshot => {

 that.name = snapshot.val().username;

  console.log('username2', this.name);  
  return this.name;
}); 
}

 textSeller(): any{

if(this.chatexist == false){

var newPostKey = firebase.database().ref().child('chat').push().key;
//var newPostKey2 = firebase.database().ref().child('chat').push().key;

var postData = {
   	
  };
var chatData = {
   	chatid: newPostKey,
     user: this.postedby,
     photo: this.userphoto2url,
      date: Date.now().toString(),
  }
  var chat2Data = {
   	chatid: newPostKey,
     user: this.name,
      photo: this.userphoto1url,
       date: Date.now().toString(),
  }
 

  var id = firebase.auth().currentUser.uid;
  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/chat/' + newPostKey] = postData;
  updates[ '/user/' + id + '/chat/' + this.sellerId] = chatData;
  updates[ '/user/' + this.sellerId + '/chat/' + id] = chat2Data;
//	updates[ '/user/' + user2id + '/chat/' + newPostKey] = postData;
//this.newmessage = " ";
  this.chatId = newPostKey; 
  firebase.database().ref().update(updates);
  this.goToChatbox(this.chatId);

}else{
   this.goToChatbox(this.existingChatId);
}

} 


goToChatbox(chatId){

  if(this.chatexist == false){


 let alert = this.alertCtrl.create({
    title: 'Send Message',
    message: 'Do you want to send message to seller?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
         
        }
      },
      {
        text: 'Yes',
        handler: () => {
          
          this.navCtrl.push("chat", 
          {
            chatId: chatId,
            username2: this.postedby,
            firstMessage: this.firstMessage,
            user2Id: this.sellerId,
          });
          this.chatexist = true;
          this.existingChatId = this.chatId;
        }
      }
    ]
  });
  alert.present();
  
  }else{
   this.navCtrl.push("chat", {
    chatId: this.existingChatId,
    username2: this.postedby,
     firstMessage: this.firstMessage,
      user2Id: this.sellerId,
  });
  }
 
}


  addToFavorite(){
    this.usersService.showToast('already in wishlist','middle');
     //console.log(this.currentEvent.status);
     // console.log(this.currentEvent);
  }


checkExist(sellerId){
  this.usersRef.once('value', snapshot => {
  if (snapshot.hasChild(sellerId)) {
    console.log('exists');
    this.chatexist = true;
    this.checkContact(sellerId);
  }

});
}

getUser2Photo(){
  console.log("getUser2Photo........");

  return this.usersService.getAnyUserDetail(this.sellerId).once('value', snapshot => {

    this.anyUser = snapshot.val();
   this.userphoto2url = this.anyUser.photo; //get user photo
   console.log(this.userphoto2url);
  });  
   
}

checkContact(sellerId){
console.log("checking contact exist ....");

if(this.chatexist == true){
return this.usersRef.child(sellerId).once('value', snapshot =>{

var existingchatid = snapshot.val().chatid;
this.existingChatId = snapshot.val().chatid;
console.log("contact exist, =>",existingchatid);
});
}

}





}


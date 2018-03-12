import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { BooksService } from '../../providers/books-service';
import { UsersService } from '../../providers/users-service';

import * as firebase from 'firebase';

@Component({
  selector: 'page-book-detail',
  templateUrl: 'book-detail.html'
})

export class BookDetailPage {

public item: any;
chatId;
name;
username2;
mybook;
chatexist;
existingChatId;
usersRef;
user2Id;
userphoto2url;
userphoto1url;
anyUser;
myUserId;
firstMessage;

  constructor(public navCtrl: NavController, public ToastController: ToastController, public loadingCtrl: LoadingController, public navParams: NavParams, public usersService: UsersService, public alertCtrl: AlertController, public booksService: BooksService) {
   
    this.usersRef = firebase.database().ref('/user/' + firebase.auth().currentUser.uid + '/chat/');
    this.myUserId = firebase.auth().currentUser.uid;
     this.name = firebase.auth().currentUser.displayName;
    this.item = this.navParams.get('item');
    //this.existingChatId = "nlncnlnln";
    this.userphoto1url = firebase.auth().currentUser.photoURL;
    this.mybook = false;
    this.chatexist = false;
   this.user2Id = this.item.sellerId;
    if(this.item.key == undefined){
      this.item.key = this.item.$key;
}
this.username2 = this.item.postedby;

  }

  


  ionViewDidLoad(){
     let loader = this.loadingCtrl.create({
      spinner : 'bubbles',
      content : `Loading...`
    });
    
    loader.present().then(() => {
    
      this.checkExist(this.item.sellerId);
      this.checkMyBook();
       this.getUser2Photo();
       this.createMessage();
       loader.dismiss();
    });
    console.log('ionViewDidLoad BookDetailPage');
    
    
  }


  
createMessage(){
  this.firstMessage = "Hi, I'm interested in buying " + this.item.title;
  console.log(this.firstMessage);
}
sendMessage(): any{

if(this.chatexist == false){
var newPostKey = firebase.database().ref().child('chat').push().key;
var newPostKey2 = firebase.database().ref().child('chat').push().key;

var postData = {
   	//user1: firebase.auth().currentUser.uid,
   //  user2: this.item.sellerId,
    // user1name: this.name,
     //user2name: this.user2name,
   //  name: this.name,
  //	message: this.firstMessage,
  //  userId: this.myUserId,
   // date: Date.now().toString(),
  };
/*var messageData = {
   	name: this.name,
  	message: "Hi",
    userId: firebase.auth().currentUser.uid,
    date: Date.now().toString(),
  };
*/
var chatData = {
   	chatid: newPostKey,
     user: this.username2,
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
  
  updates['/chat/' + newPostKey + '/message/' + newPostKey2 ] = postData;
  updates[ '/user/' + id + '/chat/' + this.item.sellerId] = chatData;
  updates[ '/user/' + this.item.sellerId + '/chat/' + id] = chat2Data;
 // updates['/chat/' + newPostKey + '/message/'] = messageData;
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
            username2: this.username2,
            firstMessage: this.firstMessage,
            user2Id: this.item.sellerId,
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
     username2: this.username2,
     firstMessage: this.firstMessage,
      user2Id: this.item.sellerId,
     
  });
  }
 
}

  addToFavorite(){
    this.booksService.addFavorite(this.item).then(() =>{
      this.usersService.showToast('added to wishlist','middle');
    })
    console.log('add to favorite');


  }


getUser2Photo(){
  console.log("getUser2Photo........");

  return this.usersService.getAnyUserDetail(this.item.sellerId).once('value', snapshot => {

    this.anyUser = snapshot.val();
   this.userphoto2url = this.anyUser.photo; //get user photo
   console.log(this.userphoto2url);
  });  
   
}

getUser2PhotoURL(userId){

var that = this;
var photoURL;
this.usersService.viewUser(userId).then(snapshot => {
photoURL = snapshot.val().photo;
 that.userphoto2url = photoURL;
  return this.userphoto2url;
});
console.log("this is user2photoURL" + this.userphoto2url + this.userphoto2url + photoURL);
}

checkMyBook(){

  if(this.item.sellerId == firebase.auth().currentUser.uid){
    this.mybook = true;
  }
  console.log(this.mybook);

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

checkExist(sellerId){
  this.usersRef.once('value', snapshot => {
  if (snapshot.hasChild(sellerId)) {
    console.log('exists');
    this.chatexist = true;
    this.checkContact(sellerId);
  }

});
}

}
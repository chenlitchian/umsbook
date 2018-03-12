import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Content } from 'ionic-angular';
import * as firebase from 'firebase';
import { UsersService } from '../../providers/users-service';

@IonicPage({
  name: 'chat',
})

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})

export class Chat {

@ViewChild(Content) content: Content;
	ref;
	name;
	newmessage;
	messagesList;
  chatId;
  userId;
  user2Id;
  toUserId;
  username2;
  firstMessage;
  userChatRef1;
userChatRef2;
userChatRef3;
userRef1;
userRef2;
userphoto2url

  constructor(public navCtrl: NavController, public alert: AlertController, public usersService: UsersService, public navParams: NavParams) {
      
      this.userId = firebase.auth().currentUser.uid;
      this.chatId = this.navParams.get('chatId');
  	  this.ref = firebase.database().ref('chat' +'/'+ this.chatId + '/message/');
      this.user2Id = this.navParams.get('user2Id');
      this.name = firebase.auth().currentUser.displayName;
      this.username2 = this.navParams.get('username2');
       this.firstMessage = this.navParams.get('firstMessage');
       this.newmessage = this.firstMessage;
       this.userChatRef1 = firebase.database().ref('/user/' + this.userId + '/chat/' + this.user2Id);
       this.userChatRef2 = firebase.database().ref('/user/' + this.user2Id + '/chat/' + this.userId);
       this.userChatRef3 = firebase.database().ref('/user/' + this.userId + '/chat/');
       this.userRef1 = firebase.database().ref('/user/' + this.userId);
        this.userRef2 = firebase.database().ref('/user/' + this.user2Id);
  }
  ionViewDidLoad(){
  
  this.getUser2Photo();
   this.userChatRef1.update(
  {
    "new": false,
    
  });
  

  console.log("update new to 'false' ");
  console.log("update notification to 'false' ");
  	
    this.ref.on('value',data => {
  		let tmp = [];
  		data.forEach( data => {
  			tmp.push({
  				key: data.key,
  				name: data.val().name,
  				message: data.val().message,
          date: data.val().date,
          userId: data.val().userId
          
  			})
  	
    });
  		this.messagesList = tmp;
        console.log("messageList push....");
  	});   
        console.log("ionViewDidLoad");
}

ionViewDidEnter() {
    this.content.scrollToBottom(0);
    console.log("ionViewDidEnter");
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave Chat ");
/*
this.userRef1.update(
  {
    "notification": false
  }); */
     
 }

postMessage(): any{

this.userRef1.update(
  {
    "notification": false
  });

  this.userRef2.update(
  {
    "notification": true
  });

var postData = {
   	name: this.name,
  	message: this.newmessage,
    userId: this.userId,
    date: Date.now().toString(),
  };


  // Get a key for a new Book.
  var newPostKey = firebase.database().ref().child('/chat' + '/'+ this.chatId + '/message/' ).push().key;
  //var id = firebase.auth().currentUser.uid;
  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/chat' + '/' +this.chatId+ '/message/' +newPostKey] = postData;
   //updates[ '/user/' + id + '/chat/' + this.user2Id] = lastDate;
  //updates[ '/user/' + this.user2Id + '/chat/' + id] = lastDate;
 // updates[ '/user/' + id + '/chat' +'/' + this.user2Id +'/' +newPostKey] = postData;
//	updates[ '/user/' + user2id + '/chat/' + newPostKey] = postData;

  this.userChatRef1.update(
  {
    "date": Date.now().toString(),
    "lastMessage": this.newmessage,
    "new": false,
  }); 

  this.userChatRef2.update(
  {
    "lastMessage": this.newmessage,
    "date": Date.now().toString(),
    "new": true,
  });

this.newmessage = " ";
if(this.content._scroll){
this.f();
} 

  //this.addBookKey = newPostKey; 
firebase.database().ref().update(updates);



} 

  toBottom(){
     setTimeout(() => {
      this.content.scrollToBottom(0);
    }, 100); 
    
  }
f(){
  this.toBottom();
  
}


getUser2Photo(){
  console.log("getUser2Photo........");
var anyUser;
  return this.usersService.getAnyUserDetail(this.user2Id).once('value', snapshot => {

    anyUser = snapshot.val();
   this.userphoto2url = anyUser.photo; //get user photo
   console.log(this.userphoto2url);

this.userChatRef1.update(
  {
    "photo": this.userphoto2url,
  });  
});  

   
}


}

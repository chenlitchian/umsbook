import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import { UsersService } from '../../providers/users-service';


@IonicPage({
  name: 'inbox',
})

@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html'
})
export class InboxPage {

  
ref;
messagesList;
currentUser;
name;
//userChatRef;
userId;
userRef;

  constructor(public navCtrl: NavController, public usersService: UsersService, public navParams: NavParams, public loadingCtrl: LoadingController, public platform: Platform) {

this.userId = firebase.auth().currentUser.uid;
this.ref = firebase.database().ref('user/'+ firebase.auth().currentUser.uid + '/chat/');
//this.userChatRef = firebase.database().ref('/user/' + this.userId + '/chat/' + this.user2Id);
 this.userRef = firebase.database().ref('/user/' + this.userId);
  }
  ionViewDidLoad() {

    /* this.userRef.update(
  {"notification": false}
  );*/
    	this.ref.on('value',data => {
  		let tmp = [];
  		data.forEach( data => {
  			tmp.push({
  				key: data.key,
          chatId: data.val().chatid,
          user: data.val().user,
          photo: data.val().photo,
          date: data.val().date,
          message: data.val().lastMessage,
          new: data.val().new,
  			})
  		});

  		this.messagesList = tmp;
      this.sort(); 
  	});
    console.log('ionViewDidLoad InboxPage');
  }

 ionViewWillLeave() {
 this.userRef.update(
  {"notification": false}
  );
     
 }
goToChatbox(chatId, username2, user2Id){

 
  this.navCtrl.push("chat", {
    chatId: chatId,
    username2: username2,
    user2Id: user2Id, 
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


sort(){
  console.log("sorting....");

  this.messagesList.sort(function(a, b){

    var nameA=a.date, nameB=b.date
    //return new Date(nameB.start).getTime() - new Date(nameA.start).getTime()
  return nameB - nameA;
});
  

console.log("sort complete");
}

}

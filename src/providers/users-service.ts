import { Injectable } from '@angular/core';
import { ToastController, App } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
//import {Observable} from 'rxjs/Observable';
//import { LoginPage } from '../pages/login/login';

@Injectable()
export class UsersService {

public fireAuth: any;
public userProfile: firebase.database.Reference;
public currentUser: firebase.User;
username: any;
userID: any;


  constructor(private http: Http, public app: App, private toastCtrl: ToastController){
  console.log('Hello UsersService Provider');
  this.fireAuth = firebase.auth();
  this.userProfile = firebase.database().ref('user');
	this.currentUser = firebase.auth().currentUser;
//	this.userID = firebase.auth().currentUser.uid;
  }

getUserId(){
	return firebase.auth().currentUser.uid;
}
getUserDetail(): firebase.database.Reference {
  return this.userProfile.child(firebase.auth().currentUser.uid);
	
}
getAnyUserDetail(anyUserId): firebase.database.Reference {
  return this.userProfile.child(anyUserId);
	
}

updateUser(userId, newName:any, newEmail:any, newContact:any, newSchool:any, userProvidedPassword){

	var user = firebase.auth().currentUser;
	const credential = firebase.auth.EmailAuthProvider.credential(
    user.email, 
    userProvidedPassword
);

user.reauthenticate(credential).then(() => {
  console.log("user authenticated, now updating....");


user.updateProfile({
  displayName: newName,
  photoURL: firebase.auth().currentUser.photoURL
}).then(function() {
  // Update successful.
}, function(error) {
  // An error happened.
});
 

this.userProfile.child(this.getUserId()).update({
	
			username: newName,
			email: newEmail,
			contact: newContact,
			school: newSchool,
  }).then(() =>{this.showToast("user data updated","middle")}).catch(function(error){
 console.error(error);
 alert(error);
});
	if(newEmail != user.email){
		console.log("email changed, updating email....")
		user.updateEmail(newEmail).then(() => {
	user.sendEmailVerification().then(function() {
  // Email sent.
	console.log(' account verification email sending...')
}, function(error) {
  // An error happened.
});
	console.log("update email successfully");
}, function(error) {
	console.log("update email failed");
}).catch(function(error){
 console.error(error);
 alert(error);
});
	}
}, function(error) {
	console.log("user not authenticated, profile cannot not be updated");
	alert(error);
	console.error(error);
}).catch(function(error){
	alert(error);
 console.error(error);
 alert(error);
});

}
updatePhoto(userId: string, photoUrl:string){

	return this.userProfile.child(userId).update({

			photo: photoUrl
		});
}
viewUser(userId: any){

			var userRef = this.userProfile.child(userId);
			console.log("getting user detail")
			return userRef.once('value'); 
}


signUpUser(email: string , password: string , contact: string, name: string, school: string ){

	var username = name;
	var contact = contact;
	var photo = photo;
	var school = school;

	return this.fireAuth.createUserWithEmailAndPassword(email, password).then((newUser) => {
		//sign in the user
		this.fireAuth.signInWithEmailAndPassword(email, password).then((authenticatedUser) => {
			//successful login, create user profile
		//	var user = firebase.auth().currentUser;

/*user.updateProfile({
  displayName: username,
  photoURL: "img/userpic.png"
}).then(function() {
  // Update successful.
}, function(error) {
  // An error happened.
}); */
		this.userProfile.child(authenticatedUser.uid).set({

			email: email,
			password: password,
			username: username,
			contact: contact,
			photo:"img/userpic.png", 
			school: school
		});	
	});
	var user = firebase.auth().currentUser;
	user.sendEmailVerification().then(function() {
  // Email sent.
	console.log('verify account')
}, function(error) {
  // An error happened.
});
	});
}

loginUser(email: string, password: string): any {
	return firebase.auth().signInWithEmailAndPassword(email, password);	
  }

logoutUser(){
	 return firebase.auth().signOut().then(function() {
  // Sign-out successful.
}, function(error) {
  // An error happened.
});
 	//redirection
 }

resetUser(email: any){
 	return this.fireAuth.sendPasswordResetEmail(email);	 
 }

showToast(message, position) {
          
    let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: position,

  });
  toast.present();
}

updatePassword(Password, newPassword){
	var user = firebase.auth().currentUser;
	
	const credential = firebase.auth.EmailAuthProvider.credential(
    user.email, 
    Password
);
user.reauthenticate(credential).then(()=> {
user.updatePassword(newPassword).then(() => {
  // Update successful.
	this.showToast("password updated successfully","middle");
}, function(error) {
  // An error happened.
	this.showToast("update failed");
});
}).catch(function(error) {
 console.error(error);
 alert(error);
});	
}

removeUserAccount(password, userId){
	var user = firebase.auth().currentUser;
	
	const credential = firebase.auth.EmailAuthProvider.credential(
    user.email, 
    password
);

user.reauthenticate(credential).then(()=> {

	this.userProfile.child(userId).remove();
	user.delete().then(()=>{

this.showToast("user removed successfully", "middle");
	}, function(error){
		this.showToast("removed failed", "middle");
	});
	
}).catch(function(error) {
 console.error(error);
 alert(error);
});	

}


}
 
 
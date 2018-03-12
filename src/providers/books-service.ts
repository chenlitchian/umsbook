import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

@Injectable()
export class BooksService {

public bookProfile: firebase.database.Reference;
public userProfile: firebase.database.Reference;
public currentUser: firebase.User;
public bookList: firebase.database.Reference;
public userId: any;
public globalBook: any;
public user: any;
public defaultPhoto: any = "img/userpic.png";
public addBookKey: any;
public bookRef: any;
public allBook: any;
public favBook: any;


constructor(public http: Http) {
    console.log('Hello BooksService Provider');
  
  this.userProfile = firebase.database().ref('user');
	this.currentUser = firebase.auth().currentUser;
  this.globalBook = firebase.database().ref('books' );
  
}

removeBook(bookId){
 
  var userId = firebase.auth().currentUser.uid;
  this.bookList = firebase.database().ref('user/' + userId + '/book/' );
  this.removeBookGlobal(bookId);
  
  return this.bookList.child(bookId).remove().then(function() {
}, function(error) {
   alert(error);
  });

}

removeBookGlobal(bookId){

   return this.globalBook.child(bookId).remove();

}

updateBook(bookId, newTitle:any, newAuthor:any, newPrice:any, newIsbn:any, newCategory:any, newDetail:any, newStatus:any){
 
 var userId = firebase.auth().currentUser.uid;
 this.bookList = firebase.database().ref('user/' + userId + '/book/' );
  this.bookList.child(bookId).update({

			title : newTitle,
      author : newAuthor,
      price : newPrice,
      isbn : newIsbn,
      category : newCategory,
      detail : newDetail,
      status : newStatus,
		});


  return this.globalBook.child(bookId).update({
	  title : newTitle,
    author : newAuthor,
    price : newPrice,
    isbn : newIsbn,
    category : newCategory,
    detail : newDetail,

  }).then(function() {

  }, function(error) { 

});
}

postBook(username: any, title: string, author: string, isbn: any, price: any, category: any,  detail: string, photo: any, userId: any): any{

var postData = {

    title: title,
    author: author,
    isbn: isbn,
    price: price,
    category: category,
    detail: detail,
    postedby: username,
    postedon:Date.now(),
    status: 'available',
    photo: photo,
    sellerId: userId,
  };

  // Get a key for a new Book.
  var newPostKey = firebase.database().ref().child('books').push().key;
  var id = firebase.auth().currentUser.uid;
  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/books/' + newPostKey] = postData;
  updates[ '/user/' + id + '/book/' + newPostKey] = postData;

  this.addBookKey = newPostKey; 
  return firebase.database().ref().update(updates);

}
addFavorite(book){

var id = firebase.auth().currentUser.uid;
this.favBook = firebase.database().ref('user/' + id + '/favbook/' + book.key);
return this.favBook.set({

		title:book.title,
    photo:book.photo,
    price:book.price,

    

		}).then(function() {

  }, function(error) { 

});	

}
addFavorite1(book){

var id = firebase.auth().currentUser.uid;
this.favBook = firebase.database().ref('user/' + id + '/favbook/' + book.key);
return this.favBook.set({

		title:book.title,
    photo:book.photo,
    price:book.price,

    

		}).then(function() {

  }, function(error) { 

});	

}

removeFavorite(book){

var id = firebase.auth().currentUser.uid;
this.favBook = firebase.database().ref('user/' + id + '/favbook/' + book);
return this.favBook.remove().then(function() {

  }, function(error) { 

});	

}
getBookKey(){
  return this.addBookKey;
}

getBookList(userId): firebase.database.Reference {
  return firebase.database().ref('user/' + userId + '/book/' );
}

getAllBook(){
   this.bookRef = firebase.database().ref('/books'); //database reference
    this.bookRef.on('value', bookList =>{

      let books = []; // books array  --store data temporary
      bookList.forEach( book => {
      books.push(book.val());  //loop the list and push to books array
      });

      this.allBook = books;
});
return this.allBook;
}

getBookDetail(bookId): firebase.database.Reference {
  return this.globalBook.child(bookId);
}

updateBookList(userId: string, book:any){
	return this.userProfile.child(userId).update({
			book: book
		});
}

updatePhoto(bookId: string, photoUrl:string){

  var userId = firebase.auth().currentUser.uid;
  this.bookList = firebase.database().ref('user/' + userId + '/book/' );
  this.bookList.child(bookId).update({

  photo: photoUrl
  });

	return this.globalBook.child(bookId).update({
  photo: photoUrl
  });
}
}

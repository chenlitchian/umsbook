import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { BookDetailPage } from '..//book-detail/book-detail';
import { SearchBook2Page } from '..//search-book2/search-book2';
import { BooksService } from '../../providers/books-service';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-search3',
  templateUrl: 'search3.html'
})

export class Search3Page {

bookRef: any; //creating database reference so we can pull the data from firebase 
bookList: any; //store the list of books we're pulling from firebase
loadedBookList: any;
public books    : FirebaseListObservable<any[]>;


  constructor(public navCtrl: NavController, private angFire: AngularFire, private loadingCtrl: LoadingController, public alertCtrl: AlertController ,public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public platform: Platform, public booksService: BooksService) {

platform.ready().then(() => {   

    this.bookRef = firebase.database().ref('/books'); //database reference
      
    this.bookRef.on('value', bookList =>{

      let books = []; // books array  --store data temporary
      bookList.forEach( snap => {
      books.push({
        
            key: snap.key,
            title: snap.val().title,
            author: snap.val().author,
            photo: snap.val().photo,
            isbn: snap.val().isbn,
            postedby: snap.val().postedby,
            postedon: snap.val().postedon,
            status: snap.val().status,
            detail: snap.val().detail,
            price: snap.val().price,
            category: snap.val().category,
            sellerId: snap.val().sellerId,
       
          });
      });

      //this.bookList = books;  
      this.loadedBookList = books;
});
});
 
}

ionViewDidLoad() {
    console.log('ionViewDidLoad SearchBookPage'); 
  }


getItems(searchbar){
  
   this.initializeItems(); 

  // set q to the value of the searchbar
  var q = searchbar.srcElement.value;

  // if the value is empty string don't filter the items
 /* if (q == null){
    return this.initializeItems();
   
  }
  if (q == '*'){
    return this.initializeItems();
  } */
if(q!=null){

  this.bookList = this.bookList.filter( v =>{

    if(v.title && q){
  if (v.title.toLowerCase().indexOf(q.toLowerCase()) > -1){
    return true;
  }
  return false;
}

});
}
 
  console.log(q, this.bookList.length);

} 

initializeItems(){
  this.bookList = this.loadedBookList;
}

goToDetail(item){
  this.navCtrl.push(BookDetailPage, {
    item:item
  });
  
  console.log('go th book detail...');
}

 presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Search by',
     buttons: [
       {
         text: 'Category',
         role: 'destructive',
         handler: () => {
            this.goToSearch2()
           console.log('Category clicked');
         }
       },
       {
         text: 'Author',
         handler: () => {
           console.log('Author clicked');
         }
       },
       {
         text: 'ISBN',
         handler: () => {
           console.log('ISBN clicked');
         }
       },
       {
         text: 'Price',
         handler: () => {
           console.log('Price clicked');
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

goToSearch2(){
  	this.navCtrl.push(SearchBook2Page);
    console.log('search 2 page');
  }

}

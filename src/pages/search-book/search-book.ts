import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Platform, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { BookDetailPage } from '..//book-detail/book-detail';
import { SearchBook2Page } from '..//search-book2/search-book2';
import { Search3Page } from '..//search3/search3';
import { FavoriteBookPage } from '..//favorite-book/favorite-book';
import { BooksService } from '../../providers/books-service';


@Component({
  selector: 'page-search-book',
  templateUrl: 'search-book.html'
})
export class SearchBookPage {

bookRef: any; //creating database reference so we can pull the data from firebase 
bookList: any; //store the list of books we're pulling from firebase
loadedBookList: any;
nobook = false;
subscription;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public alertCtrl: AlertController ,public navParams: NavParams, public actionSheetCtrl: ActionSheetController, public platform: Platform, public booksService: BooksService) {

this.bookRef = firebase.database().ref('/books'); 

      let loader = this.loadingCtrl.create({
      content: 'Loading book...',
  		dismissOnPageChange: false,
  	  });

    loader.present().then(() => {

    this.bookRef.on('value', bookList =>{

      let books = []; // books array  --store data temporary
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
       
          });  //loop the list and push to books array
     
    });
      loader.dismiss();
      this.bookList = books;  
      this.loadedBookList = books;
      console.log('constructor SearchBookPage');
    }); 
      
    });
      
      
      
      
}

ionViewWillEnter() {
    console.log('ionViewWillEnter SearchBookPage'); 
  }

ngOnDestroy(){

      //this.subscription.unsubscribe();
     // console.log('ng destroy subscription');

}

ionViewDidLoad() {
    console.log('ionViewDidLoad SearchBookPage'); 
  }


getItems(searchbar){
  
   this.initializeItems(); 

  // set q to the value of the searchbar
  var q = searchbar.srcElement.value;

  // if the value is empty string don't filter the items
 
if(q){
  this.bookList = this.bookList.filter( v =>{

    if(v.title && q){
  if (v.title.toLowerCase().indexOf(q.toLowerCase()) > -1){
    return true;
  }
  return false;
}

});
if(!q){
  this.bookList = this.loadedBookList;
}
}
  console.log('bookList', this.bookList);
  console.log('loadedBookList', this.loadedBookList);
  console.log(q, this.bookList.length);
  if(this.bookList.length === 0){
    this.nobook = true;
  }else{
    this.nobook = false;
  }

} //Every time the function gets called, it:

//Initializes the countryList array.
//Sets q as what’s currently inside the search bar.
//Checks if q is empty (if you were deleting) and returns nothing if it is.
//It checks the string against the value of the name property of our countries.

//click to go book detail function

initializeItems(){
  this.bookList = this.loadedBookList;
}// initialize function use in filter

goToDetail(item){
  this.navCtrl.push(BookDetailPage, {
    item:item
  });
  
  console.log(item);
}

 presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Search by',
     buttons: [
       {
         text: 'Category',
         handler: () => {
            this.ToCategory();
           console.log('Category clicked');
         }
       },
       {
         text: 'Author',
         handler: () => {
           this.goToSearch3();
           console.log('Author clicked');
         }
       },
       {
         text: 'ISBN',
         handler: () => {
           this.goToSearch4();
           console.log('ISBN clicked');
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


goToSearch3(){
  	this.navCtrl.push(Search3Page);
    console.log('search 3 page');
  }

goToSearch4(){
  	this.navCtrl.push(FavoriteBookPage);
    console.log('FavoriteBookPage page');
  }

ToCategory(){
  	this.navCtrl.push('category');
  } 
}

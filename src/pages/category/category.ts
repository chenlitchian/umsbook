import { Component, ViewChild } from '@angular/core';
import { NavController, Content, NavParams, Platform, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import firebase from 'firebase';
import { BookDetailPage } from '..//book-detail/book-detail';
//import { ExpandableHeader } from '../../components/expandable-header/expandable-header';


@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
  
})
export class Category {
  
@ViewChild(Content) content: Content;
showFilter: boolean = false;
bookRef: any;
bookList: any; 
bookList1: any;
bookList2: any;
loadedBookList: any;
category: any;
nobook;
sorting: any;
query: any;
qo: any;
arrange: any;
grid;
list;
  constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  this.arrange = "list";
  this.category = "All";
  this.sorting = "6";
  this.list = true;
  this.grid = false;
  this.bookRef = firebase.database().ref('/books'); 
   this.query = false;      
      let loader = this.loadingCtrl.create({
      content: 'Loading book...',
  		dismissOnPageChange: false,
  	  });

     loader.present().then(() => {

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
      loader.dismiss();
      this.bookList = books;  
      this.loadedBookList = books;
      this.bookList1 = books;
      this.bookList2 = books;
      console.log('constructor SearchBookPage');
      }); 
      });
      
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad Category');
  }

  arrangeBy(){
    if (this.grid == false){
      this.grid = true;
      this.list = false;
      this.arrange = "grid";
    }else{
      this.arrange = "list";
      this.grid = false;
      this.list = true;
    }
  }
toggleFilter() {

  if(this.showFilter == false){
    this.showFilter = !this.showFilter;
  }
    this.content.resize();
    this.content.scrollToTop();
  }

initializeItems(){
  this.bookList = this.loadedBookList;
  console.log('reset')
  
}// initialize function use in filter


getItems(searchbar){
  
   this.initializeItems(); 

  // set q to the value of the searchbar
  var q = searchbar.srcElement.value;
this.qo = searchbar.srcElement.value;
  // if the value is empty string don't filter the items
 
if(q){
  this.query = true;
  this.bookList = this.loadedBookList.filter( v =>{

   if(v.title && q){
  if (v.title.toLowerCase().indexOf(q.toLowerCase()) > -1 || v.author.toLowerCase().indexOf(q.toLowerCase()) > -1 || v.isbn.toLowerCase().indexOf(q.toLowerCase()) > -1 ){
    if(this.category === "All"){
      return true;
    }
    if(v.category == this.category){
      return true;
    }
    return false;
  }
  return false;
}
});
this.bookList1 = this.bookList;
console.log('booklist12',this.bookList1)
//this.filter();
} 

if(!q){
  
  this.query = false;
  this.bookList = this.loadedBookList;
  //
  if(this.category != "All"){
   // this.initializeItems();
  
    this.filter();
  }else{

      this.filter();
    }

}

  //console.log('bookList', this.bookList);
  //console.log('bookList1', this.bookList1);
  //console.log('loadedBookList', this.loadedBookList);
  console.log(q, this.bookList.length);
  if(this.bookList.length === 0){
    this.nobook = true;
  }else{
    this.nobook = false;
  }
console.log(this.query);
} 

filter(){
  console.log(this.query)
  
  if(this.query == false ){


  this.bookList = this.loadedBookList.filter( v =>{

    if(v.category === this.category ){
  
    return true;
    }
  return false;
 
});

if(this.category === 'All'){
this.initializeItems();
}


 //this.bookList2 = this.bookList;

  console.log(this.category,' has ',this.bookList.length, 'books');
}


if(this.query == true){


if(this.category == "All"){

  this.bookList = this.loadedBookList.filter( v =>{  
  if (v.title.toLowerCase().indexOf(this.qo.toLowerCase()) > -1 || v.author.toLowerCase().indexOf(this.qo.toLowerCase()) > -1 || v.isbn.toLowerCase().indexOf(this.qo.toLowerCase()) > -1){
    return true;
  }
  return false;
});
}else{

 this.bookList = this.loadedBookList.filter( v =>{
   
  if (v.title.toLowerCase().indexOf(this.qo.toLowerCase()) > -1 || v.author.toLowerCase().indexOf(this.qo.toLowerCase()) > -1 || v.isbn.toLowerCase().indexOf(this.qo.toLowerCase()) > -1){
    if(v.category == this.category){
      return true;
    }
    return false;
  }

});
}
console.log("books", this.bookList.length);
}
if(this.bookList.length === 0){
    this.nobook = true;
  }else{
    this.nobook = false;
  }
}

sort(){

if(this.sorting === "1"){
this.bookList.sort(function(a, b){

  
    var nameA=a.title.toLowerCase(), nameB=b.title.toLowerCase()
    if (nameA < nameB) //sort string ascending
        return -1 
    if (nameA > nameB)
        return 1
    return 0 //default return value (no sorting)
});
}
else if(this.sorting === "2"){

this.bookList.sort(function(a, b){

  
    var nameA=a.title.toLowerCase(), nameB=b.title.toLowerCase()
    if (nameA > nameB) //sort string ascending
        return -1 
    if (nameA < nameB)
        return 1
    return 0 //default return value (no sorting)
});

}else if(this.sorting === "3"){


this.bookList.sort(function(a, b){

  
    var nameA=a.price, nameB=b.price
    //return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
    return nameA - nameB;

});
}else if(this.sorting === "4"){

this.bookList.sort(function(a, b){

  
    var nameA=a.price, nameB=b.price
    //return nameA > nameB ? 1 : nameA < nameB ? -1 : 0;
    return nameB - nameA;
 
});
}else if(this.sorting === "5"){

this.bookList.sort(function(a, b){

    var nameA=a.postedon, nameB=b.postedon
    //return new Date(nameB.start).getTime() - new Date(nameA.start).getTime()
  return nameB - nameA;
});
}else if(this.sorting === "6"){

this.bookList.sort(function(a, b){

    var nameA=a.postedon, nameB=b.postedon    
     return nameA - nameB;
 
});
}else{

return 0
}
console.log(this.bookList.length);
}


goToDetail(item){
  this.navCtrl.push(BookDetailPage, {
    item:item
  });
}

goToFavorite(){
  this.navCtrl.push("favorite");
}


 presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Search by',
     buttons: [
       {
         text: 'Photo',
         handler: () => {
           this.ToSearch2();
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
 

ToSearch2(){
  	this.navCtrl.push('search2');
  }
 

}

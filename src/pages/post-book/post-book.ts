import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, LoadingController, ToastController } from 'ionic-angular';
import { AddBookPage } from '../add-book/add-book';
import { MyBookDetailPage } from '..//my-book-detail/my-book-detail';
import firebase from 'firebase';
import { BooksService } from '../../providers/books-service';
//import { AngularFire } from 'angularfire2';
import { MybookPage } from '../mybook/mybook';

@Component({
  selector: 'page-post-book',
  templateUrl: 'post-book.html'
})
export class PostBookPage {

bookRef: any;
mybookList: any;
message: any;
bookid;
subscription;


constructor(public navCtrl: NavController, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private platform: Platform, public navParams: NavParams, public alertCtrl: AlertController, public booksService: BooksService) {

        
}


presentToast(num: any) {

      if(num == 0){
        
        this.message = 'You have no book. Add book to sell';
      }else if(num == 1){
       
        this.message = 'You have posted ' + num + ' book, Please mark any item sold';
        
      }else{
        this.message = 'You have posted ' + num + ' books, Please mark any item sold'
        
      }
      console.log(this.message);
}

ionViewDidLoad() {

  var userId: any = firebase.auth().currentUser.uid;
    let loader = this.loadingCtrl.create({
     spinner : 'bubbles',
      content : `Loading...`
  });

  loader.present().then(() => {
    
       this.subscription = 
       this.booksService.getBookList(userId).on('value', snapshot => {
    
          let rawList = [];
    
          snapshot.forEach( snap => {
          
          rawList.push({
        
            id: snap.key,
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
       
          });
          
          return false;
          
          });
                this.mybookList = rawList;
                          
              loader.dismiss();
                this.presentToast(this.mybookList.length); 
                
          });
          
  })
         
      
    console.log('ionViewDidLoad PostBookPage');
}


/*ngOnDestroy(){

      this.subscription.unsubscribe();
      console.log('ng destroy subscription');

}*/

goToBookDetail(book): void {
  this.navCtrl.push(MyBookDetailPage, {
    book: book,
  });
}


goToBookIdDetail(book){
  console.log(book);
  this.navCtrl.push(MybookPage, {
    book: book,
  });
}

toAddBookPage(){
  	this.navCtrl.push(AddBookPage);
    console.log('addbook page');
  }

goToDetail(item){
  
  this.navCtrl.push(MyBookDetailPage, {
    item:item
  });
  console.log('to my bookdetail');
}



showToast(message, position) {
        
      
    let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position: position,
  });
  toast.present();
}

}
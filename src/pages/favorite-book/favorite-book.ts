import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BookDetailPage } from '..//book-detail/book-detail';
import { UsersService } from '../../providers/users-service';
import { BookDetailByidPage } from '..//book-detail-byid/book-detail-byid';
import { BooksService } from '../../providers/books-service';

@IonicPage({
  name: 'favorite',
})
@Component({
  selector: 'page-favorite-book',
  templateUrl: 'favorite-book.html'
})
export class FavoriteBookPage {

   public books    : FirebaseListObservable<any[]>;
   nobook = false;
   books1;
   message: any;
   userId;

  constructor(public navCtrl: NavController, public booksService: BooksService, public usersService: UsersService, public loadingCtrl: LoadingController, private angFire: AngularFire, private platform: Platform, public navParams: NavParams, public alertCtrl: AlertController) {

    this.userId = this.usersService.getUserId();
  }


  ionViewDidLoad() {
    
      let loader = this.loadingCtrl.create({
      spinner : 'bubbles',
      content : `Loading...`
    });
    loader.present().then(() => {
   
 this.books = this.angFire.database.list('user/' + this.userId +  '/favbook');

 this.books1 = this.angFire.database.list('user/' + this.userId +  '/favbook', {preserveSnapshot:true});


         this.books1.subscribe(snapshots => {
           
           let book = [];
    
        snapshots.forEach(snapshot => {

        book.push(snapshot.key);
        return false; 
        
    });
   
        this.presentMessage(book.length);
         console.log("Array Length = ", book.length);
      });
 loader.dismiss();
       
    });
      
     
         
         
  }
presentMessage(num: any) {

      if(num == 0){
        //toast2.present();
        this.message = 'Your Wishlist is empty';
      }else if(num == 1){
        //toast1.present();
        this.message = 'You have ' + num + ' book in your Wishlist';
        console.log('t1');
      }else{
        this.message = 'You have ' + num + ' books in your Wishlist.'
        //toast.present();
      }
      }

goToDetail(item){
 this.navCtrl.push(BookDetailPage, {
    item:item
  });  
  console.log(item);
}

goToBookDetail(bookId){
 this.navCtrl.push(BookDetailByidPage, {
    bookId: bookId,
  });
}

remove(book){
  this.booksService.removeFavorite(book).then(() =>{

  });
  this.usersService.showToast('item removed','middle');
    console.log('remove favorite');

}
}

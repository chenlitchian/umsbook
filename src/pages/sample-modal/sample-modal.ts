import { Component } from '@angular/core';
import { NavController, App, NavParams, ViewController, ToastController } from 'ionic-angular';
import { BooksService } from '../../providers/books-service';
//import { MyBookDetailPage } from '..//my-book-detail/my-book-detail';
//import { TabsPage } from '../tabs/tabs';
//import { PostBookPage } from '../post-book/post-book';
//import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-sample-modal',
  templateUrl: 'sample-modal.html'
})

export class SampleModalPage {

    title: string = this.navParams.get('title');
    author: string = this.navParams.get('author');
    price: string = this.navParams.get('price');
    isbn: string = this.navParams.get('isbn');
    category: string = this.navParams.get('category');
    detail: string = this.navParams.get('detail');
    status: string = this.navParams.get('status');
 
  public titleField: any = this.title;
  public authorField: any = this.author;
  public priceField: any = this.price;
  public isbnField: any = this.isbn;
  public categoryField: any = this.category;
  public detailField: any = this.detail;
  public statusField: any = this.status;
  

  constructor(public navCtrl: NavController, public app: App, public toastCtrl: ToastController, public navParams: NavParams, public viewCtrl: ViewController, public booksService: BooksService) {
  }


closeModal(){
  
  var mybookId = this.navParams.get('id');
   
    this.booksService.updateBook(mybookId, this.titleField, this.authorField, this.priceField, this.isbnField, this.categoryField, this.detailField, this.statusField).then(() => {

          this.viewCtrl.dismiss({
            title: this.titleField, 
            author: this.authorField, 
            photo: this.navParams.get('photo'),
            isbn: this.isbnField,
            price: this.priceField,
            detail: this.detailField,
            category: this.categoryField,
            status: this.statusField,
          id: mybookId
         });
    });
          this.showToast("updated successfully", "middle");
          console.log('update successfully');
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad SampleModalPage');
  }

  returnToBookDetailPage(){

    var mybookId = this.navParams.get('id');
    
          this.viewCtrl.dismiss({
            title: this.titleField, 
            author: this.authorField, 
            photo: this.navParams.get('photo'),
            isbn: this.isbnField,
            price: this.priceField,
            detail: this.detailField,
            category: this.categoryField,
            status: this.statusField,
          id: mybookId
         });
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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { BookDetailPage } from '..//book-detail/book-detail';


@IonicPage({
  name: 'search2',
})

@Component({
  selector: 'page-search-book2',
  templateUrl: 'search-book2.html'
})
export class SearchBook2Page {

  public books    : FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private angFire: AngularFire, private platform: Platform, public navParams: NavParams, public alertCtrl: AlertController) {}
/*
  ionViewDidLoad() {

    this.platform.ready()
      .then(() =>
      {
         this.books = this.angFire.database.list('/books');
         //loading.dismiss();
      });
       let loading = this.loadingCtrl.create({content:'My message', duration: 3000});
      loading.present();
      console.log(this.angFire.database.list('/books'));
  }*/
ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      spinner : 'bubbles',
      content : `Loading...`
    });
    loader.present().then(() => {
      this.books = this.angFire.database.list('/books');
      loader.dismiss().then(() => {
        console.log("Loading dismissed");
      });
    })
  }

goToDetail(item){
 this.navCtrl.push(BookDetailPage, {
    item:item
  });
  
  console.log(item);
}

}

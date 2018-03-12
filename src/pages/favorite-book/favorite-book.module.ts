import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoriteBookPage } from './favorite-book';

@NgModule({
  declarations: [
    FavoriteBookPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoriteBookPage),
  ],
  exports: [
    FavoriteBookPage
  ]
})
export class FavoriteBookPageModule {}

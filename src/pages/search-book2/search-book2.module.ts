import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchBook2Page } from './search-book2';

@NgModule({
  declarations: [
    SearchBook2Page,
  ],
  imports: [
    IonicPageModule.forChild(SearchBook2Page),
  ],
  exports: [
    SearchBook2Page
  ]
})
export class SearchBook2PageModule {}

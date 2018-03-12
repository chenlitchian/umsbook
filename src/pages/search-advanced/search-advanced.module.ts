import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchAdvanced } from './search-advanced';

@NgModule({
  declarations: [
    SearchAdvanced,
  ],
  imports: [
    IonicPageModule.forChild(SearchAdvanced),
  ],
  exports: [
    SearchAdvanced
  ]
})
export class SearchAdvancedModule {}

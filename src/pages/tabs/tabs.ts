import { Component } from '@angular/core';
import { HomePage } from '../home/home';
//import { MybookPage } from '../mybook/mybook';
import { PostBookPage } from '../post-book/post-book';
//import { SearchBookPage } from '../search-book/search-book';
//import { UserdetailpagePage } from '../userdetailpage/userdetailpage';
import { UserDetail2Page } from '../user-detail2/user-detail2';
import { MenuController } from 'ionic-angular';
import { Category } from '../category/category';
@Component({
  
  templateUrl: 'tabs.html',
  
})

export class TabsPage {

  tab1Root: any = HomePage;
 // tab2Root: any = SearchBookPage;
  tab2Root: any = Category;
  tab3Root: any = PostBookPage;
  tab4Root: any = UserDetail2Page;

  constructor( private menuCtrl: MenuController) {
this.menuCtrl.enable(true);
  }

}

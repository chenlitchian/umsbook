import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { BrowserModule } from '@angular/platform-browser';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UserdetailpagePage } from '../pages/userdetailpage/userdetailpage';
import { UserRegisterPage } from '../pages/user-register/user-register';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { UsersService } from '../providers/users-service';
import { BooksService } from '../providers/books-service';
import { AddBookPage } from '../pages/add-book/add-book';
import { PostBookPage } from '../pages/post-book/post-book';
import { SearchBookPage } from '../pages/search-book/search-book';
//import { InboxPage } from '../pages/inbox/inbox';
import { SettingPage } from '../pages/setting/setting';
import { HintModalPage } from '../pages/setting/hint-modal/hint-modal';
import { WalkthroughModalPage } from '../pages/setting/walkthrough-modal/walkthrough-modal';

import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { BookDetailPage } from '../pages/book-detail/book-detail';
import { MyBookDetailPage } from '../pages/my-book-detail/my-book-detail';
import { SampleModalPage } from '../pages/sample-modal/sample-modal';
//import { SearchBook2Page } from '../pages/search-book2/search-book2';
import { Search3Page } from '../pages/search3/search3';
import { PopoverContentPage } from '../pages/popover/popover';
import { TabsPage } from '../pages/tabs/tabs';
import { UserDetail2Page } from '../pages/user-detail2/user-detail2';
import { MybookPage } from '../pages/mybook/mybook';
import { BookDetailByidPage } from '../pages/book-detail-byid/book-detail-byid';
import { HttpModule } from '@angular/http';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Category } from '../pages/category/category';

 export const firebaseConfig = {
 
    apiKey: "AIzaSyBH9xkSP0gJRqZZjUHDf20c7z8MATqJvw0",
    authDomain: "umsbook.firebaseapp.com",
    databaseURL: "https://umsbook.firebaseio.com",
    storageBucket: "umsbook.appspot.com",
    messagingSenderId: "781664221259" 
  };


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    UserdetailpagePage,
    UserRegisterPage,
    ResetPasswordPage,
    AddBookPage,
    SearchBookPage,
   // InboxPage,
    SettingPage,
    EditProfilePage,
    BookDetailPage,
    PostBookPage,
    MyBookDetailPage,
    SampleModalPage,
   // SearchBook2Page,
    PopoverContentPage,
    Search3Page,
    TabsPage,
    UserDetail2Page,
    MybookPage,
    BookDetailByidPage,
    Category,
    HintModalPage,
    WalkthroughModalPage,
  ],
  
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    IonicImageViewerModule
    
  ],
  
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    UserdetailpagePage,
    UserRegisterPage,
    ResetPasswordPage,
    AddBookPage,
    SearchBookPage,
    //InboxPage,
    SettingPage,
    EditProfilePage,
    BookDetailPage,
    PostBookPage,
    MyBookDetailPage,
    SampleModalPage,
    //SearchBook2Page,
    PopoverContentPage,
    Search3Page,
    TabsPage,
    UserDetail2Page,
    MybookPage,
    BookDetailByidPage,
    Category,
    HintModalPage,
    WalkthroughModalPage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, UsersService, BooksService]
})
export class AppModule {}

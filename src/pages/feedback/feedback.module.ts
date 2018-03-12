import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Feedback } from './feedback';

@NgModule({
  declarations: [
    Feedback,
  ],
  imports: [
    IonicPageModule.forChild(Feedback),
  ],
  exports: [
    Feedback
  ]
})
export class FeedbackModule {}

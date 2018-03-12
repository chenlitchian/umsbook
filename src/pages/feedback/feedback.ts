import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@IonicPage({
  name: 'feedback',
})
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class Feedback {


    feedbackForm: FormGroup;
    submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, formBuilder: FormBuilder) {
  
      this.feedbackForm = formBuilder.group({
          name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
          email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
          feedback: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])]
      })
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Feedback');
  }

  onSubmit(value: string): void {
      console.log('Thanks for your feedback!', value);
  }
}



  


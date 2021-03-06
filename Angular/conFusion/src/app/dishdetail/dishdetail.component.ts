import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Comment } from '../shared/comment'
import { visibility, expand, flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visibility(),
    expand(),
    flyInOut()
  ]
})

export class DishdetailComponent implements OnInit {
  @ViewChild('fform') commentFormDirective;

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  dishcopy: Dish;

  commentForm: FormGroup;
  comment: Comment;

  visibility = 'shown';

  formErrors = {
    'name':'',
    'text_comment':''
  }
  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'FName must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'text_comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 5 characters long.',
      'maxlength':     'Comment cannot be more than 200 characters long.'
    }
  }

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('baseURL') private baseURL) {
      this.createForm();
    }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
    }
  
    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
    createForm() {
      this.commentForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        slider : ['1'],
        text_comment: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)] ],
      })

      this.commentForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

      this.onValueChanged(); // (re)set validation messages now
    }

    onSubmit() {
      this.comment = this.commentForm.value;
      console.log(this.comment);
      this.commentForm.reset({
        name: '',
        lastname: '',
        text_comment: '',
      });
      this.commentFormDirective.resetForm();
      this.dishcopy.comments.push(this.comment);
      this.dishservice.putDish(this.dishcopy)
        .subscribe(dish => {
          this.dish = dish; this.dishcopy = dish;
        },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    }
  
    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }
}

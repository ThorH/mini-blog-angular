import { Component } from '@angular/core';
import { FormBuilder, 
         Validators } from '@angular/forms';
import { Post } from 'src/app/interfaces/post';
import { FakeDataApiService } from 'src/app/services/fake-data-api.service';
import { ToastrService } from 'ngx-toastr'
import { catchError, of, Subscription } from 'rxjs';
import { ErrorStateMatcherPost } from 'src/app/modules/utils/errorStateMatcher';

@Component({
  selector: 'app-post-register',
  templateUrl: './post-register.component.html',
  styleUrls: ['./post-register.component.scss']
})
export class PostRegisterComponent {

  registerForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required]
  });
  private subscription = new Subscription();

  matcher = new ErrorStateMatcherPost();

  constructor(private formBuilder: FormBuilder, 
              private fakeDataApi: FakeDataApiService,
              private toastr: ToastrService) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    const title = this.registerForm.get('title')!.value;
    const body = this.registerForm.get('description')!.value;
    const newPost: Post = { id:'2', userId: '2', title: title, body: body };
    this.registerForm.reset();
    
    this.subscription.add(this.fakeDataApi.createPost(newPost).pipe(catchError(error => { 
      this.toastr.error(error.message, 'Unable to publish!'); 
      return of(null)
    })).subscribe(post => {
      if(post){
        this.toastr.success('Post published.', 'Success!');
      } 
    }))
  }

}

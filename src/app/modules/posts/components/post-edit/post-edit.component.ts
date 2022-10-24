import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize, of, Subscription } from 'rxjs';
import { FormBuilder, 
         Validators } from '@angular/forms';
import { FakeDataApiService } from 'src/app/services/fake-data-api.service';
import { Post } from 'src/app/interfaces/post';
import { ToastrService } from 'ngx-toastr';
import { ErrorStateMatcherPost } from 'src/app/modules/utils/errorStateMatcher';
@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit {

  private subscription = new Subscription();
  post: Post = { userId: '',
                 id: '',
                 title: '',
                 body: '' }
  editForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required]
  });
  isLoading = true;
  messageError = '';
  matcher = new ErrorStateMatcherPost();

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private fakeDataApi: FakeDataApiService,
              private toastr: ToastrService) { }

  ngOnInit(): void {

    const idPost = this.route.snapshot.params['id'];

    this.subscription.add(this.fakeDataApi.getPostById(idPost).pipe(
      catchError((error) => {
        this.messageError = error.message;
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(post => {
      if(post) {
        this.editForm.patchValue({ title: post.title, 
          description: post.body});
        this.post = post;
      }
    }));
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    const title = this.editForm.get('title')!.value;
    const body = this.editForm.get('description')!.value;

    if(title !== this.post.title || body !== this.post.body) {
      const updatedPost: Post = { userId: this.post.userId, 
                                  id: this.post.id, 
                                  title: title,
                                  body: body }

      this.subscription.add(this.fakeDataApi.updatePost(updatedPost).pipe(
                            catchError(error => {
                              this.toastr.error(error.message, 'Unable to edit post!')
                              return of(null)
                            })
                          ).subscribe((updatedPost) => {
                            if(updatedPost){
                              this.toastr.success('Post updated.', 'Success!')
                            }
                          }))
    } else {
      this.toastr.error('No data has been changed.', 'Unable to edit!')
    }
  }

}

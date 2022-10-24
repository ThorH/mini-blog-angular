import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, catchError, of, mergeMap, forkJoin, finalize } from 'rxjs';
import { Post } from 'src/app/interfaces/post';
import { PostComment } from 'src/app/interfaces/post';
import { FakeDataApiService } from 'src/app/services/fake-data-api.service';
import { ErrorStateMatcherComment } from 'src/app/modules/utils/errorStateMatcher';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  private subscription = new Subscription();
  postId = '';
  userInfo = {
    name: '',
    username: ''
  }
  messageError = '';
  actualPost: Post = { id: '',
                       userId: '',
                       title: '',
                       body: '' };
  actualPostComments: PostComment[] = [];
  commentForm = this.formBuilder.group({
    comment: ['', Validators.required]
  });
  isLoading = true;
  matcher = new ErrorStateMatcherComment();

  constructor(private route: ActivatedRoute, 
              private fakeDataApi: FakeDataApiService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    
    this.postId = this.route.snapshot.params['id'];

    this.subscription.add(forkJoin([this.fakeDataApi.getPostById(this.postId), 
                                      this.fakeDataApi.getPostComments(this.postId)])
                              .pipe(
                                mergeMap(([post, comment]) => {
                                  this.actualPost = post;
                                  this.actualPostComments = comment;

                                  return this.fakeDataApi.getUserById(post.userId);
                                }),
                                catchError(error => {
                                  this.messageError = error.message;
                                  return of(null);
                                }),
                                finalize(() => {
                                  this.isLoading = false;
                                })
                              ).subscribe(user => {
                                  if(user) {
                                    this.userInfo.name = user.name;
                                    this.userInfo.username = user.username;
                                  }
                                }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    const actualComment = this.commentForm.get('comment')!.value;
    const name = 'id labore ex et quam laborum';
    const email = 'Eliseo@gardner.biz';
    const postComment: PostComment = { id: '1',
                                       postId: this.postId, 
                                       name: name, 
                                       email: email, 
                                       body: actualComment };
    this.commentForm.reset();  

    this.subscription.add(this.fakeDataApi.createComment(postComment).pipe(
      catchError(error => { 
      this.toastr.error(error.message, 'Unable to publish!'); 
      return of(null);
      })
    ).subscribe(comment => {
      if(comment) {
        this.toastr.success('Your comment has been published!');
      }
    }));
  }

}

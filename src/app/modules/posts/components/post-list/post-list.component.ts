import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription, 
         mergeMap, 
         forkJoin, 
         of, 
         catchError, 
         finalize } from 'rxjs';
import { PostList } from 'src/app/interfaces/post';
import { Post } from 'src/app/interfaces/post';
import { User } from 'src/app/interfaces/user';
import { FakeDataApiService } from 'src/app/services/fake-data-api.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  postList: PostList[] = []; 
  pageSize = 10;
  pageSlice: PostList[] = [];
  isLoading = true;
  messageError = '';
  private subscription = new Subscription();

  constructor(private fakeDataApi: FakeDataApiService) { }

  ngOnInit(): void {
 
    this.subscription.add(this.fakeDataApi.getPosts().pipe(
      mergeMap(posts => {
        const requests = posts.map(post => this.fakeDataApi.getUserById(post.userId).pipe(
                                    mergeMap((user) => of({post, user}))
                                  ))
        
        return forkJoin(requests);
      }),
      catchError((error) => {
        this.messageError = error.message;
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((result: { post: Post, user: User }[] | null) => {
        if(result){
          result.forEach(({user, post}) => {
            this.postList.push({id: post.id, name: user.name, userName: user.username, title: post.title});
          })
          if(this.postList.length > 10) {
            this.pageSlice = this.postList.slice(0, 10);
          }
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageSize * event.pageIndex;
    let endIndex = event.pageSize + startIndex;

    if(endIndex > this.postList.length) {
      endIndex = this.postList.length;
    }

    this.pageSlice = this.postList.slice(startIndex, endIndex);
  } 

}

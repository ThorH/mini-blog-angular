import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, 
         Observable, 
         retryWhen, 
         throwError, 
         delay, 
         take,
         concatMap } from 'rxjs';
import { Post } from '../interfaces/post';
import { PostComment } from '../interfaces/post'
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FakeDataApiService {

  private readonly apiUrl = 'https://jsonplaceholder.typicode.com'
  private readonly apiPostUrl = `${this.apiUrl}/posts`

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    const errorMessage = `An error occured. Status: ${error.status}`

    return throwError(() => new Error(errorMessage));
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiPostUrl}`).pipe(
      retryWhen(errors => errors.pipe(delay(3000), take(5), concatMap(throwError))),
      catchError(this.handleError)
    );
  }

  getPostById(idPost: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiPostUrl}/${idPost}`).pipe(
      retryWhen(errors => errors.pipe(delay(3000), take(5), concatMap(throwError))),
      catchError(this.handleError)
    )
  }

  getPostComments(idPost: string): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.apiPostUrl}/${idPost}/comments`).pipe(
      retryWhen(errors => errors.pipe(delay(3000), take(5), concatMap(throwError))),
      catchError(this.handleError))
  }

  getUserById(idUser: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${idUser}`).pipe(
      retryWhen(errors => errors.pipe(delay(3000), take(5), concatMap(throwError))),
      catchError(this.handleError));
  }

  createPost(post: Post) {
    return this.http.post<Post>(this.apiPostUrl, post).pipe(
      catchError(this.handleError)
    );
  }

  createComment(comment: PostComment): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.apiPostUrl}/${comment.postId}/comments`, comment).pipe(
      catchError(this.handleError)
    )
  }

  updatePost(post: Post) {
    return this.http.put<Post>(`${this.apiPostUrl}/${post.id}`, post).pipe(
      catchError(this.handleError)
    )
  }
}

import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule,
         HttpTestingController } from '@angular/common/http/testing'
import { catchError } from 'rxjs';

import { FakeDataApiService } from './fake-data-api.service';
import { postsMock ,
         postMock, 
         postCommentsMock,
         userMock,
         commentMock,
         responseError,
         messageError } from 'src/mock'
import { of } from 'rxjs';


describe('FakeDataApiService', () => {
  let service: FakeDataApiService;
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  const progressEvent = new ProgressEvent('Http error 500')

  const apiUrl = 'https://jsonplaceholder.typicode.com';
  const apiPostUrl = `${apiUrl}/posts`;
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FakeDataApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test get post list request', () => {

    it('should get post list', (done) => {
      service.getPosts().subscribe(posts => {
        expect(posts[0].id).toEqual(postsMock[0].id);
        expect(posts.length).toEqual(postsMock.length);
        done();
      });
  
      const req = httpTestingController.expectOne(apiPostUrl);
      req.flush(postsMock);
  
      expect(req.request.method).toEqual('GET');
    });
  
    it('should catch and handle error from api', (done) => {
      service.getPosts().pipe(
        catchError(error => {
          expect(error.message).toEqual(messageError)
          done();
          return of();
        })
      ).subscribe();
      
      const req = httpTestingController.expectOne(apiPostUrl);
      req.error(progressEvent, responseError);
  
      expect(req.request.method).toEqual('GET');
    });

  });
  
  describe('Test get post by id request', () => {

    it('should get post', (done) => {
      service.getPostById(postMock.id).subscribe(post => {
        expect(post.id).toEqual(postMock.id);
        done();
      });
  
      const req = httpTestingController.expectOne(`${apiPostUrl}/${postMock.id}`);
      req.flush(postMock);
  
      expect(req.request.method).toEqual('GET');
    });
    
    it('should catch and handle error from api', (done) => {
      service.getPostById(postMock.id).pipe(
        catchError(error => {
          expect(error.message).toEqual(messageError);
          done();
          return of();
        })
      ).subscribe();
      
      const req = httpTestingController.expectOne(`${apiPostUrl}/${postMock.id}`);
      req.error(progressEvent, responseError);
  
      expect(req.request.method).toEqual('GET');
    });

  });
 
  describe('Test get post comments by post id request', () => {

    it('should get post comments', (done) => {
      const postCommentsTest = postCommentsMock(5)
  
      service.getPostComments(commentMock.postId).subscribe(comments => {
        expect(comments[0].id).toEqual(commentMock.id);
        expect(comments.length).toEqual(postCommentsTest.length);
        done();
      })
  
      const req = httpTestingController.expectOne(`${apiPostUrl}/${commentMock.postId}/comments`);
      req.flush(postCommentsTest);
  
      expect(req.request.method).toEqual('GET');
    });
  
    it('should catch and handle error from api', (done) => {
      service.getPostComments(commentMock.postId).pipe(
        catchError(error => {
          expect(error.message).toEqual(messageError);
          done();
          return of();
        })
      ).subscribe();
      
      const req = httpTestingController.expectOne(`${apiPostUrl}/${commentMock.postId}/comments`);
      req.error(progressEvent, responseError);
  
      expect(req.request.method).toEqual('GET');
    });

  });
  
  describe('Test get user by id request', () => {

    it('should get user', (done) => {
      service.getUserById(userMock.id).subscribe(user => {
        expect(user.id).toEqual(userMock.id);
        done();
      })
  
      const req = httpTestingController.expectOne(`${apiUrl}/users/${userMock.id}`);
      req.flush(userMock);
  
      expect(req.request.method).toEqual('GET');
    });
  
    it('should catch and handle error from api', (done) => {
      service.getUserById(userMock.id).pipe(
        catchError(error => {
          expect(error.message).toEqual(messageError);
          done();
          return of();
        })
      ).subscribe();
      
      const req = httpTestingController.expectOne(`${apiUrl}/users/${userMock.id}`);
      req.error(progressEvent, responseError);
  
      expect(req.request.method).toEqual('GET');
    });  

  });

  describe('Test create post resquest', () => {

    it('should create post', (done) => {
      service.createPost(postMock).subscribe(post => {
        expect(post.id).toEqual(postMock.id);
        done();
      })
  
      const req = httpTestingController.expectOne(apiPostUrl);
      req.flush(postMock);
  
      expect(req.request.method).toEqual('POST');
    })
  
    it('should catch and handle error from api', (done) => {
      service.createPost(postMock).pipe(
        catchError(error => {
          expect(error.message).toEqual(messageError);
          done();
          return of();
        })
      ).subscribe();
      
      const req = httpTestingController.expectOne(apiPostUrl);
      req.error(progressEvent, responseError);
  
      expect(req.request.method).toEqual('POST');
    });

  });
  
  describe('Test create comment by post id request', () => {

    it('should create comment', (done) => {
      service.createComment(commentMock).subscribe(comment => {
        expect(comment.id).toEqual(commentMock.id);
        done();
      })
  
      const req = httpTestingController.expectOne(`${apiPostUrl}/${commentMock.postId}/comments`);
      req.flush(commentMock);
  
      expect(req.request.method).toEqual('POST');
    })
  
    it('should catch and handle error from api', (done) => {
      service.createComment(commentMock).pipe(
        catchError(error => {
          expect(error.message).toEqual(messageError);
          done();
          return of();
        })
      ).subscribe();
      
      const req = httpTestingController.expectOne(`${apiPostUrl}/${commentMock.postId}/comments`);
      req.error(progressEvent, responseError);
  
      expect(req.request.method).toEqual('POST')
    });

  });

  describe('Test update post by post id request', () => {

    it('should update post', (done) => {
      service.updatePost(postMock).subscribe(post => {
        expect(post.id).toEqual(postMock.id);
        done();
      })
  
      const req = httpTestingController.expectOne(`${apiPostUrl}/${postMock.id}`);
      req.flush(postMock);
  
      expect(req.request.method).toEqual('PUT');
    })
  
    it('should catch and handle error from api', (done) => {
      service.updatePost(postMock).pipe(
        catchError(error => {
          expect(error.message).toEqual(messageError);
          done();
          return of();
        })
      ).subscribe();
      
      const req = httpTestingController.expectOne(`${apiPostUrl}/${postMock.id}`);
      req.error(progressEvent, responseError);
  
      expect(req.request.method).toEqual('PUT');
    });

  });

});
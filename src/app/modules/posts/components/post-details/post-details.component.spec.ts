import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { FakeDataApiService } from 'src/app/services/fake-data-api.service';
import { postCommentsMock, 
         postMock, 
         userMock , 
         commentMock, 
         messageError} from 'src/mock';
import { PostDetailsComponent } from './post-details.component';

describe('PostDetailsComponent', () => {
  let component: PostDetailsComponent;
  let fixture: ComponentFixture<PostDetailsComponent>;
  let service: FakeDataApiService;
  let toastr: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        RouterTestingModule, 
        HttpClientModule,
        ReactiveFormsModule,
        ToastrModule.forRoot() ],
      declarations: [ PostDetailsComponent ],
      providers: [
        { provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: 2
              },
            },
          },
        }, 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDetailsComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FakeDataApiService);
    toastr = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test component on init', () => {

    it('should get post details and comments', () => {
      spyOn(service, 'getPostById').and.returnValue(of(postMock));
      spyOn(service, 'getPostComments').and.returnValue(of(postCommentsMock(5)));
      spyOn(service, 'getUserById').and.returnValue(of(userMock));
  
      component.ngOnInit();
  
      expect(service.getPostById).toHaveBeenCalled();
      expect(service.getUserById).toHaveBeenCalled();
      expect(service.getPostComments).toHaveBeenCalled();
      expect(component.actualPostComments.length).toBe(5);
      expect(component.actualPostComments[0].id).toEqual(commentMock.id);
      expect(component.actualPost.id).toEqual(postMock.id)
      expect(component.userInfo.name).toEqual(userMock.name)
      expect(component.isLoading).toBeFalsy();
    })
  
    it('should catch error that comes from services', () => {
      spyOn(service, 'getPostById').and.returnValue(throwError(() => new Error(messageError)));
      spyOn(service, 'getPostComments').and.returnValue(throwError(() => new Error(messageError)));
      const element = fixture.debugElement.nativeElement;
  
      component.ngOnInit();
      fixture.detectChanges();
  
      expect(service.getPostById).toHaveBeenCalled();
      expect(service.getPostComments).toHaveBeenCalled();
      expect(component.actualPost.id).toEqual('');
      expect(component.actualPostComments.length).toBe(0);
      expect(component.messageError).toEqual(messageError);
      expect(element.querySelector('.response-error p').textContent).toEqual(messageError);
      expect(component.isLoading).toBeFalsy();
    })

  })

  describe('Test component on submit comment', () => {

    it("should send success on feedback", () => {
      spyOn(toastr, 'success')
      spyOn(service, 'createComment').and.returnValue(of(commentMock))

      component.commentForm.get('comment')?.setValue(commentMock.body);
      
      component.onSubmit();

      expect(toastr.success).toHaveBeenCalled();    
    })

    it("should send error on feedback", () => {
      spyOn(toastr, 'error')
      spyOn(service, 'createComment').and.returnValue(throwError(()=> new Error(messageError)))

      component.commentForm.get('comment')?.setValue(commentMock.body);

      component.onSubmit();
      
      expect(toastr.error).toHaveBeenCalled();    
    })

 })
  
});

import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { FakeDataApiService } from 'src/app/services/fake-data-api.service';
import { messageError, postMock, updatedPostMock } from 'src/mock';

import { PostEditComponent } from './post-edit.component';

describe('PostEditComponent', () => {
  let component: PostEditComponent;
  let fixture: ComponentFixture<PostEditComponent>;
  let service: FakeDataApiService;
  let toastr: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
        ToastrModule.forRoot() ],
      declarations: [ PostEditComponent ],
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
    fixture = TestBed.createComponent(PostEditComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FakeDataApiService);
    toastr = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test component on init', () => {

    it('should get post by id and patch value on edit form', () => {
      spyOn(service, 'getPostById').and.returnValue(of(postMock));
  
      component.ngOnInit();
  
      const titleField = component.editForm.get('title');
      const descriptionField = component.editForm.get('description');
  
      expect(service.getPostById).toHaveBeenCalled();
      expect(titleField?.value).toEqual(postMock.title);
      expect(descriptionField?.value).toEqual(postMock.body);
      expect(component.isLoading).toBeFalsy();
    });
  
    it('should catch error that comes from api', () => {
      let element = fixture.debugElement.nativeElement;
      spyOn(service, 'getPostById').and.returnValue(throwError(() => new Error(messageError)));
  
      component.ngOnInit();
      fixture.detectChanges();
  
      expect(service.getPostById).toHaveBeenCalled();
      expect(component.messageError).toEqual(messageError);
      expect(element.querySelector('.response-error p').textContent).toEqual(messageError);
    })
  
  })

  describe('Test validators before submit', () => {

    it('should empty field be invalid', () => {
      spyOn(service, 'getPostById').and.returnValue(of(postMock));
  
      component.ngOnInit();
  
      const titleField = component.editForm.get('title');
      const descriptionField = component.editForm.get('description');
  
      titleField?.setValue('');
      descriptionField?.setValue('');
  
      expect(component.editForm.get('title')?.value).toEqual('');
      expect(component.editForm.get('description')?.value).toEqual('');
      expect(component.editForm.invalid).toBeTruthy();
  
      expect(titleField?.getError('required')).toBeTruthy();
      expect(descriptionField?.getError('required')).toBeTruthy();
    })
  })
  
  describe('Test component on submit', () => {

    it('should send success on feedback if input values are different', () => {
      spyOn(service, 'getPostById').and.returnValue(of(postMock));
      spyOn(service, 'updatePost').and.returnValue(of(updatedPostMock));
      spyOn(toastr, 'success');
  
      component.ngOnInit();
  
      const titleField = component.editForm.get('title');
      const descriptionField = component.editForm.get('description');
  
      expect(titleField?.value).toEqual(postMock.title)
      expect(descriptionField?.value).toEqual(postMock.body);
  
      titleField?.setValue(updatedPostMock.title);
      descriptionField?.setValue(updatedPostMock.body);
  
      component.onSubmit();
  
      expect(toastr.success).toHaveBeenCalled();
    })
  
    it('should send error on feedback if catch error from service', () => {
      spyOn(service, 'getPostById').and.returnValue(of(postMock));
      spyOn(service, 'updatePost').and.returnValue(throwError(() => new Error(messageError)));
      spyOn(toastr, 'error');
  
      component.ngOnInit();
  
      const titleField = component.editForm.get('title');
      const descriptionField = component.editForm.get('description');
  
      expect(titleField?.value).toEqual(postMock.title);
      expect(descriptionField?.value).toEqual(postMock.body);
  
      titleField?.setValue(updatedPostMock.title);
      descriptionField?.setValue(updatedPostMock.body);
  
      component.onSubmit();
  
      expect(toastr.error).toHaveBeenCalled();
    })
  
    it('should send error on feedback if input values is equal', () => {
      spyOn(service, 'getPostById').and.returnValue(of(postMock));
      spyOn(toastr, 'error');
  
      component.ngOnInit();
  
      const titleField = component.editForm.get('title');
      const descriptionField = component.editForm.get('description');
  
      expect(titleField?.value).toEqual(postMock.title);
      expect(descriptionField?.value).toEqual(postMock.body);
  
      titleField?.setValue(postMock.title);
      descriptionField?.setValue(postMock.body);
  
      component.onSubmit();
  
      expect(toastr.error).toHaveBeenCalled();
    })

  })

});

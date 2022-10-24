import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { messageError, postMock } from 'src/mock';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PostRegisterComponent } from './post-register.component';
import { FakeDataApiService } from 'src/app/services/fake-data-api.service';
import { of, throwError } from 'rxjs';

describe('PostRegisterComponent', () => {
  let component: PostRegisterComponent;
  let fixture: ComponentFixture<PostRegisterComponent>;
  let toastr: ToastrService;
  let service: FakeDataApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ToastrModule.forRoot() ],
      declarations: [ PostRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostRegisterComponent);
    component = fixture.componentInstance;
    toastr = TestBed.inject(ToastrService);
    service = TestBed.inject(FakeDataApiService)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test validators before submit', () => {

    it('should empty field be invalid', () => {
      const registerForm = fixture.debugElement.nativeElement.querySelector('form');
      const titleInput = registerForm.querySelector('input');
      const descriptionInput = registerForm.querySelector('textarea');
  
      const titleField = component.registerForm.get('title');
      const descriptionField = component.registerForm.get('description')
      
      expect(titleInput.value).toEqual('');
      expect(descriptionInput.value).toEqual('');
      expect(component.registerForm.invalid).toBeTruthy();

      expect(titleField?.getError('required')).toBeTruthy();
      expect(descriptionField?.getError('required')).toBeTruthy();
    })

  })

  describe('Test component on submit', () => {

    it('should send success on feedback', () => {
      spyOn(toastr, 'success')
      spyOn(service, 'createPost').and.returnValue(of(postMock))
  
      component.registerForm.get('title')?.setValue(postMock.title);
      component.registerForm.get('description')?.setValue(postMock.body);
      
      component.onSubmit();
      
      expect(toastr.success).toHaveBeenCalled();    
    })
  
    it('should send error on feedback', () => {
      spyOn(toastr, 'error')
      spyOn(service, 'createPost').and.returnValue(throwError(()=> new Error(messageError)))
  
      component.registerForm.get('title')?.setValue(postMock.title);
      component.registerForm.get('description')?.setValue(postMock.body);
      
      component.onSubmit();
      
      expect(toastr.error).toHaveBeenCalled();    
    })

  })

});

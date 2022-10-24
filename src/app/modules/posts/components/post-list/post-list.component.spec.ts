import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListComponent } from './post-list.component';
import { userMock,
         postListPaginationMock,
         messageError, 
         postMock} from 'src/mock'
import { FakeDataApiService } from 'src/app/services/fake-data-api.service';
import { of, throwError } from 'rxjs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HarnessLoader } from '@angular/cdk/testing';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let loader: HarnessLoader;
  let service: FakeDataApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        HttpClientTestingModule,
        MatPaginatorModule
      ],
      declarations: [ 
        PostListComponent 
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListComponent);
    fixture.detectChanges();
    service = TestBed.inject(FakeDataApiService);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test component on init', () => {

    it('should list posts', () => {
      spyOn(service, 'getPosts').and.returnValue(of(postListPaginationMock(20)));
      spyOn(service, 'getUserById').and.returnValue(of(userMock));
  
      component.ngOnInit();
  
      expect(service.getPosts).toHaveBeenCalled();
      expect(service.getUserById).toHaveBeenCalled();
      expect(component.postList.length).toBe(20);
      expect(component.pageSlice.length).toBe(10);
      expect(component.postList[0].id).toEqual(postMock.id);
      expect(component.postList[0].name).toEqual(userMock.name);
      expect(component.isLoading).toBeFalsy();
    })
  
    it('should catch error that comes from service', () => {
      spyOn(service, 'getPosts').and.returnValue(throwError(() => new Error(messageError)));
      const element = fixture.debugElement.nativeElement;

      component.ngOnInit();
      fixture.detectChanges();
  
      expect(service.getPosts).toHaveBeenCalled();
      expect(component.postList.length).toBe(0);
      expect(component.messageError).toEqual(messageError);
      expect(element.querySelector('.response-error p').textContent).toEqual(messageError);
      expect(component.isLoading).toBeFalsy();
    })
    
  })

  describe('Test component pagination', () => {

    it('should page change', async () => {
      spyOn(service, 'getPosts').and.returnValue(of(postListPaginationMock(15)));
      spyOn(service, 'getUserById').and.returnValue(of(userMock));
  
      component.ngOnInit();
  
      expect(service.getPosts).toHaveBeenCalled();
      expect(service.getUserById).toHaveBeenCalled();
      const paginator = await loader.getHarness(MatPaginatorHarness);
      expect(await paginator.getPageSize()).toBe(10);
      expect(component.pageSlice.length).toBe(10);
      await paginator.goToNextPage();
      expect(component.pageSlice.length).toBe(5);
    })

  })
  
});

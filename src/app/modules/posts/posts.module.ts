import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { PostsRoutingModule } from './posts-routing.module';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostRegisterComponent } from './components/post-register/post-register.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { UtilsModule } from '../utils/utils.module';
import { PostEditComponent } from './components/post-edit/post-edit.component';


@NgModule({
  declarations: [
    PostListComponent,
    PostRegisterComponent,
    PostDetailsComponent,
    PostEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PostsRoutingModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    UtilsModule
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ]
})
export class PostsModule { }

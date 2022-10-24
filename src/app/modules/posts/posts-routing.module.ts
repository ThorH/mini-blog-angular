import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { PostListComponent } from './components/post-list/post-list.component';

const routes: Routes = [
  { path: "", component: PostListComponent},
  { path: "details/:id", component: PostDetailsComponent },
  { path: "edit/:id", component: PostEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }

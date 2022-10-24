import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from '../posts/components/post-list/post-list.component';
import { PostRegisterComponent } from '../posts/components/post-register/post-register.component';

const routes: Routes = [
  { path:"", component: PostListComponent },
  { path:"register", component: PostRegisterComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }

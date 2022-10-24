import { HttpErrorResponse } from '@angular/common/http';
import { Post } from './app/interfaces/post';
import { PostComment } from './app/interfaces/post';
import { User } from './app/interfaces/user';

export const postsMock: Post[] = [
    { 
      userId: '1', 
      id: '1', 
      title:'sunt aut facere repellat provident', 
      body: 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit'
    },
    { 
      userId: '2', 
      id: '2', 
      title:'qui est esse', 
      body: 'est rerum tempore vitaes equi sint nihil reprehenderit dolor beatae ea dolores neque'
    },
    { 
      userId: '3', 
      id: '3', 
      title:'ea molestias quasi exercitationem', 
      body: 'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium'
    },
  ];

export const postListPaginationMock = (quantity: number): Post[] => {
  let posts: Post[] = [];
  for(let i = 0; i < quantity; i++) {
    posts.push(postMock);
  }
  return posts
}
export const postMock: Post =  { 
    userId: '2', 
    id: '2', 
    title:'qui est esse', 
    body: 'est rerum tempore vitaes equi sint nihil reprehenderit dolor beatae ea dolores neque'
};

export const updatedPostMock: Post = {
  userId: '2',
  id: '2',
  title: 'Different from mocked value',
  body: 'Its definitely different from mocked value'
}

  export const postCommentsMock = (quantity: number): PostComment[] => {
    let postComments: PostComment[] = [];
    for(let i = 0; i < quantity; i++) {
      postComments.push(commentMock);
    }
    return postComments;
  }

export const userMock: User = {
    id: '1',
    name: 'Leanne Graham',
    username: 'Bret',
  }

export const commentMock: PostComment = {
  postId: '2',
  id: '11',
  name: 'fugit labore',
  email: 'Veronica_Goodwin@timmothy.net',
  body: 'ut dolorum nostrum id quia aut est fuga est inventore vel eligendi explicabo quis consectetur'
}

export const responseError = new HttpErrorResponse({
  status: 500,
});

export const messageError = 'An error occured. Status: 500'
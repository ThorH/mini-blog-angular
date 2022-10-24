export interface Post {
    userId: string,
    id: string,
    title: string,
    body: string
}

export interface PostList {
    id: string,
    name: string,
    userName: string,
    title: string,
}

export interface PostComment {
    postId: string,
    id: string,
    name: string,
    email: string,
    body: string
}

import { request } from '@/utils/request'
import { User } from '@/api/user'

export interface CreateArticle {
  title: string
  description: string
  body: string
  tagList?: string[];
}

export interface Article {
  _id: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: User
}

export interface Comment {
  author?: string
  body: string
  createdAt?: string
  updatedAt?: string
  _id?: string
  article?: Article
}

export interface CommentPayload {
  comments: Comment[]
  commentsCount: number
}

interface ArticlePayLoad {
  article: Article
}

export interface ArticlesPayload {
  articles: Article[],
  articlesCount: number
}

export const getArticles = (pageSize = 5, pageNum = 1) => {
  return request.get<ArticlesPayload>(`/api/articles?pageSize=${pageSize}&pageNum=${pageNum}`)
}

export const getMyArticles = (username: string, pageSize = 5, pageNum = 1) => {
  return request.get<ArticlesPayload>(`/api/articles/?username=${username}&pageSize=${pageSize}&pageNum=${pageNum}`)
}

export const getFeedArticles = (pageSize = 5, pageNum = 1) => {
  return request.get<ArticlesPayload>(`/api/articles/feed?pageSize=${pageSize}&pageNum=${pageNum}`)
}

export const getArticle = (slug: string) => {
  return request.get<ArticlePayLoad>(`/api/articles/${slug}`)
}

export const createArticle = (data: CreateArticle) => {
  return request.post<ArticlePayLoad>('/api/articles', data)
}

export const updateArticle = (slug: string, data: CreateArticle) => {
  return request.patch<ArticlePayLoad>(`/api/articles/${slug}`, data)
}

export const deleteArticle = (slug: string) => {
  return request.delete(`/api/articles/${slug}`)
}

export const createComment = (slug: string, data: Comment) => {
  return request.post<Comment>(`/api/articles/${slug}/comments`, data)
}

export const getComments = (slug: string) => {
  return request.get<CommentPayload>(`/api/articles/${slug}/comments`)
}

export const deleteComment = (slug: string, id: string) => {
  return request.delete(`/api/articles/${slug}/comments/${id}`)
}

export const favoriteArticle = (slug: string) => {
  return request.post<ArticlePayLoad>(`/api/articles/${slug}/favorite`)
}

export const unfavoriteArticle = (slug: string) => {
  return request.delete<ArticlePayLoad>(`/api/articles/${slug}/favorite`)
}

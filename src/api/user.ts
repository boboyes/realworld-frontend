import { request } from '@/utils/request'

interface LoginInput {
  email: string
  password: string
}

interface RegisterInput {
  username: string
  email: string
  password: string
}

export interface UpdateUser {
  bio: string
  image: string
  username: string
  email: string
  password: string
}

export interface User {
  email: string
  token: string,
  username: string,
  bio: string,
  image: string
  following?: boolean
  subscribersCount?: number
}

export interface Profile {
  username: string,
  bio: string,
  image: string
  following: boolean
}
export interface ProfilePayload {
  user: Profile
}

interface LoginPayload {
  user: User
}

export const login = (data: LoginInput) => {
  return request.post<LoginPayload>('/api/users/login', data)
}

export const register = (data: RegisterInput) => {
  return request.post<LoginPayload>('/api/users', data)
}

export const getCurrentUser = () => {
  return request.get<LoginPayload>('/api/user')
}

export const updateUser = (data: UpdateUser) => {
  return request.patch<LoginPayload>('/api/user', data)
}

export const getProfile = (username: string) => {
  return request.get<ProfilePayload>(`/api/profiles/${username}`)
}

export const followUser = (username: string) => {
  return request.post<LoginPayload>(`/api/profiles/${username}/follow`)
}

export const unfollowUser = (username: string) => {
  return request.delete<LoginPayload>(`/api/profiles/${username}/follow`)
}

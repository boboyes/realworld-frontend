import { request } from '@/utils/request'

interface LoginInput {
  email: string
  password: string
}

interface User {
  email: string
  token: string,
  username: string,
  bio: string,
  image: string
}

interface LoginPayload {
  user: User
}

export const getTags = (data: LoginInput) => {
  return request.post<LoginPayload>('/tags', data)
}
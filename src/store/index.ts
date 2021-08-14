import { User } from '@/api/user'
import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'

// 声名state类型
export interface State {
  user: User | null
}

// 读取state成员并注入
export const key:InjectionKey<Store<State>> = Symbol('store key')

export const store = createStore<State>({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null')
  },
  mutations: {
    setUser (state, user: User) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(state.user))
    }
  }
})
// eslint-disable-next-line
export function useStore () {
  return baseUseStore(key)
}

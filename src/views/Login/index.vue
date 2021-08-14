<template>
  <Layout>
    <div class="auth-page">
      <div class="container page">
        <div class="row">

          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">{{isLogin?'Sign in':'Sign up'}}</h1>
            <p class="text-xs-center" v-if="!isLogin">
              <router-link to="/login">Have an account?</router-link>
            </p>
            <ul v-if="errors" class="error-messages">
              <li v-for="(error, index) in errors" :key="index">
                {{error.field}} {{error.message}}
              </li>
            </ul>

            <form @submit.prevent="handleSubmit">
              <template v-if="!isLogin">
                <fieldset class="form-group">
                  <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
              </template>
              <fieldset class="form-group">
                <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password">
              </fieldset>
              <button :disabled="isLoading" class="btn btn-lg btn-primary pull-xs-right">
                {{isLogin?'Sign in':'Sign up'}}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  </Layout>

</template>
<script lang='ts'>
import Layout from '@/Layout/Layout.vue'
import { login, register } from '@/api/user'
import { defineComponent, reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'

const useLogin = () => {
  const router = useRouter()
  const store = useStore()
  const route = useRoute()
  const isLogin = computed(() => {
    return route.path === '/login'
  })
  const user = reactive({
    username: '',
    email: '',
    password: ''
  })
  const errors = ref([])
  const isLoading = ref(false)
  const handleSubmit = async () => {
    isLoading.value = true
    errors.value = []
    try {
      if (!isLogin.value) {
        await register(user)
        router.push('/login')
      } else {
        const { data } = await login(user)
        store.commit('setUser', data.user)
        const redirect = (route.query.redirect || '/') as string
        router.push(redirect)
      }
      user.email = ''
      user.username = ''
      user.password = ''
    } catch (err) {
      if (err.response.status === 422) {
        errors.value = err.response.data.detail
      }
    }
    isLoading.value = false
  }
  return {
    isLogin,
    user,
    handleSubmit,
    errors,
    isLoading
  }
}
// const useRegister = () => {
//   const router = useRouter()
//   const user = reactive({
//     username: '',
//     email: '',
//     password: ''
//   })
//   const errors = ref([])
//   const isLoading = ref(false)
//   const handleSubmit = async () => {
//     isLoading.value = true
//     console.log(1111)
//     errors.value = []
//     try {
//       await register(user)
//       router.push('/login')
//       user.email = ''
//       user.username = ''
//       user.password = ''
//     } catch (err) {
//       if (err.response.status === 422) {
//         errors.value = err.response.data.detail
//       }
//     }
//     isLoading.value = false
//   }
//   return {
//     user,
//     handleSubmit,
//     errors,
//     isLoading
//   }
// }
export default defineComponent({
  name: 'Login',
  components: { Layout },
  setup () {
    // const func = isLogin.value ? useLogin : useRegister
    return {
      ...useLogin()
    }
  }
})
</script>

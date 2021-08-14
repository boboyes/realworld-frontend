<template>
  <Layout>
    <div class="settings-page">
      <div class="container page">
        <div class="row">

          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            <form @submit.prevent="handleSubmit">
              <fieldset>
                  <fieldset class="form-group">
                    <input v-model="user.image" class="form-control" type="text" placeholder="URL of profile picture">
                  </fieldset>
                  <fieldset class="form-group">
                    <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                  </fieldset>
                  <fieldset class="form-group">
                    <textarea v-model="user.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                  </fieldset>
                  <fieldset class="form-group">
                    <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email">
                  </fieldset>
                  <fieldset class="form-group">
                    <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password">
                  </fieldset>
                  <button class="btn btn-lg btn-primary pull-xs-right">
                    Update Settings
                  </button>
              </fieldset>
            </form>
          </div>

        </div>
      </div>
    </div>
  </Layout>
</template>
<script lang="ts">
import Layout from '@/Layout/Layout.vue'
import { defineComponent, reactive, onBeforeMount } from 'vue'
// import { useStore } from '@/store'
import { getCurrentUser, updateUser, UpdateUser } from '@/api/user'
import { useRouter } from 'vue-router'

const useUpdateUser = (user: UpdateUser) => {
  const router = useRouter()
  const handleSubmit = async () => {
    try {
      await updateUser(user)
      router.push('/')
    } catch (err) {
    }
  }
  return {
    handleSubmit
  }
}

export default defineComponent({
  name: 'Setting',
  components: { Layout },
  setup () {
    const user = reactive({
      username: '',
      bio: '',
      email: '',
      password: '',
      image: ''
    })
    const loadUserInfo = async () => {
      const { data } = await getCurrentUser()
      user.username = data.user.username
      user.bio = data.user.bio
      user.email = data.user.email
      user.image = data.user.image
    }

    onBeforeMount(async () => {
      await loadUserInfo()
    })
    return {
      user,
      ...useUpdateUser(user)
    }
  }
})
</script>

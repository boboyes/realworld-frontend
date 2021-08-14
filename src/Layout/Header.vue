<template>
  <div>
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <!-- <a class="nav-link active" href="">Home</a> -->
            <router-link class="nav-link" exact to="/">Home</router-link>
          </li>
           <template v-if="$store.state.user">
              <li class="nav-item">
                <router-link class="nav-link" to="/create">
                      <i class="ion-compose"></i>&nbsp;New Post
                  </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/setting">
                  <i class="ion-gear-a"></i>&nbsp;Settings
                </router-link>
              </li>
              <li class="nav-item">
                  <router-link class="nav-link" :to="{
                    path: `/profile/${$store.state.user.username}`
                  }">
                    <img class="user-pic" :src="$store.state.user.image"/>
                    {{$store.state.user.username}}
                  </router-link>
              </li>
           </template>
           <template v-else>
             <li class="nav-item">
                <router-link class="nav-link" to="/login">Sign in</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/register">Sign up</router-link>
              </li>
           </template>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {
      user: null
    }
  }
})
</script>

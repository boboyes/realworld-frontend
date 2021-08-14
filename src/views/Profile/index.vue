<template>
  <Layout>
    <div class="profile-page">

      <div class="user-info">
        <div class="container">
          <div class="row">

            <div class="col-xs-12 col-md-10 offset-md-1">
              <img src="http://i.imgur.com/Qr71crq.jpg" class="user-img" />
              <h4>{{profile.username}}</h4>
              <p>
                {{profile.bio}}
              </p>
              <template v-if="$store.state.user">
                <template v-if="$store.state.user.username === profile.username">
                  <router-link :to="`/setting`" class="btn btn-sm btn-outline-secondary action-btn">
                    <i class="ion-gear-a"></i> Edit Profile Settings
                  </router-link>
                </template>
                <template v-else>
                  <button :class="{active: profile.following}" @click="handleFollowing(profile)" class="btn btn-sm btn-outline-secondary action-btn">
                    <i class="ion-plus-round"></i>
                    &nbsp;
                    Follow {{profile.username}}
                  </button>
                </template>
              </template>
            </div>

          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                  <div style="cursor: pointer;" class="nav-link" :class="{active: selected == 'my'}" @click="loadArticles('my')">My Articles</div>
                </li>
                <li class="nav-item">
                  <div style="cursor: pointer;" class="nav-link" :class="{active: selected == 'feed'}" @click="loadArticles('feed')">Favorited Articles</div>
                </li>
              </ul>
            </div>

            <article-item :articles="articles"/>
            <!-- 分页列表 -->
              <nav>
                <ul class="pagination">
                  <li
                    class="page-item"
                    :class="{
                      active: item === pageNum
                    }"
                    v-for="item in totalPage"
                    :key="item"
                  >
                    <span
                      @click="gotoPage(item)"
                      class="page-link"
                    >{{ item }}</span>
                  </li>
                </ul>
              </nav>
              <!-- /分页列表 -->
          </div>

        </div>
      </div>

    </div>
  </Layout>

</template>
<script lang="ts">
import Layout from '@/Layout/Layout.vue'
import { defineComponent, ref, onBeforeMount, computed } from 'vue'
import { useRoute } from 'vue-router'
import { followUser, getProfile, Profile, ProfilePayload, unfollowUser } from '@/api/user'
import { Article, getMyArticles, getFeedArticles } from '@/api/article'
import ArticleItem from '@/components/ArticleItem.vue'
export default defineComponent({
  name: 'Home',
  components: { Layout, ArticleItem },
  setup () {
    const selected = ref('my')
    const route = useRoute()
    const articles = ref<Article[]>([])
    const articlesCount = ref(0)
    const pageSzie = ref(5)
    const pageNum = ref(1)
    const profile = ref<Profile>({
      bio: '',
      following: false,
      image: '',
      username: ''
    })
    const totalPage = computed(() => {
      return Math.ceil(articlesCount.value / pageSzie.value)
    })
    const { username } = route.params
    const loadProfile = async () => {
      try {
        const data = await getProfile(username as string)
        profile.value = data.data.user
      } catch (e) {

      }
    }
    const gotoPage = async (page: number) => {
      pageNum.value = page
      loadArticles(selected.value)
    }

    const loadArticles = async (type = 'my') => {
      selected.value = type
      if (type === 'feed') {
        const { data } = await getFeedArticles(pageSzie.value, pageNum.value)
        articles.value = data.articles
        articlesCount.value = data.articlesCount
      } else {
        const { data } = await getMyArticles(username as string, pageSzie.value, pageNum.value)
        articles.value = data.articles
        articlesCount.value = data.articlesCount
      }
    }
    const handleFollowing = async (profile: Profile) => {
      try {
        if (profile.following) {
          await unfollowUser(profile.username)
          profile.following = false
        } else {
          await followUser(profile.username)
          profile.following = true
        }
      } catch (err) {

      }
    }
    onBeforeMount(() => {
      loadProfile()
      loadArticles()
    })
    return {
      pageNum,
      totalPage,
      articles,
      profile,
      selected,
      gotoPage,
      loadArticles,
      handleFollowing
    }
  }
})
</script>

<template>
  <div class="article-meta">
    <a href=""><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
    <div class="info">
      <a href="" class="author">{{article.author.username}}</a>
      <span class="date">{{date(article.createdAt, 'MMM DD, YYYY')}}</span>
    </div>
    <template v-if="article.author.username === $store.state.user.username">
      <router-link
      :to="`/edit/${article._id}`"
      class="btn btn-outline-secondary btn-sm">
        <i class="ion-edit"></i> Edit Article
      </router-link>

      <button class="btn btn-outline-danger btn-sm" @click.prevent.stop="delArticle(article._id)">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button :class="{active: article.author.following}" @click="handleFollowing(article)" class="btn btn-sm btn-outline-secondary">
        <i class="ion-plus-round"></i>
        &nbsp;
        Follow Eric Simons <span class="counter">({{article.author.subscribersCount}})</span>
      </button>
      &nbsp;&nbsp;
      <button @click="handleFeed(article)" class="btn btn-sm btn-outline-primary" :class="{active: article.favorited}">
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { Article, favoriteArticle, unfavoriteArticle, deleteArticle } from '@/api/article'
import { followUser, unfollowUser } from '@/api/user'
import dayjs from 'dayjs'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      default () {
        return {
          _id: '',
          title: '',
          description: '',
          body: '',
          tagList: [],
          createdAt: '',
          updatedAt: '',
          favorited: false,
          favoritesCount: 0,
          author: {
            email: '',
            token: '',
            username: '',
            bio: '',
            image: '',
            subscribersCount: 0
          }
        }
      }
    }
  },
  setup () {
    const handleFeed = async (article: Article) => {
      try {
        if (article.favorited) {
          await unfavoriteArticle(article._id)
          article.favorited = false
          article.favoritesCount--
        } else {
          await favoriteArticle(article._id)
          article.favorited = true
          article.favoritesCount++
        }
      } catch (err) {

      }
    }
    const handleFollowing = async (article: Article) => {
      try {
        if (article.author.following) {
          await unfollowUser(article.author.username)
          article.author.following = false
          const subscribersCount = article.author.subscribersCount as number - 1
          article.author.subscribersCount = subscribersCount
        } else {
          await followUser(article.author.username)
          article.author.following = true
          const subscribersCount = article.author.subscribersCount as number + 1
          article.author.subscribersCount = subscribersCount
        }
      } catch (err) {

      }
    }
    const delArticle = async (slug: string) => {
      console.log(1111111)
      const router = useRouter()
      try {
        await deleteArticle(slug)
        router.push('/')
      } catch (err) {

      }
    }
    const date = (date: string, format = 'YYYY-MM-DD HH:MM:ss') => {
      return dayjs(date).format(format)
    }
    return {
      handleFeed,
      handleFollowing,
      delArticle,
      date
    }
  }
})
</script>

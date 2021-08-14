<template>
  <div class="article-preview" v-for="article in articles" :key="article._id">
    <div class="article-meta">
      <router-link :to="`/profile/${article.author.username}`" href="profile.html"><img :src="article.author.image||'http://i.imgur.com/Qr71crq.jpg'" /></router-link>
      <div class="info">
        <a href="" class="author">{{article.author.username}}</a>
        <span class="date">{{date(article.createdAt, 'MMM DD, YYYY')}}</span>
      </div>
      <button :class="{active: article.favorited}" @click="handleFeed(article)"  class="btn btn-outline-primary btn-sm pull-xs-right">
        <i class="ion-heart"></i> {{article.favoritesCount}}
      </button>
    </div>
    <a href="" class="preview-link">
      <h1>{{article.title}}</h1>
      <p>{{article.description}}</p>
      <span @click.prevent="gotoArticle(article)">Read more...</span>
      <ul class="tag-list">
        <li class="tag-default tag-pill tag-outline" v-for="(tag, index) in article.tagList" :key="index">
          {{tag}}
        </li>
      </ul>
    </a>
  </div>
</template>

<script lang="ts">
import { Article, favoriteArticle, unfavoriteArticle } from '@/api/article'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
export default defineComponent({
  name: 'ArticleItem',
  props: {
    articles: {
      type: Array,
      default () {
        return []
      }
    }
  },
  setup () {
    const router = useRouter()
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
    const gotoArticle = async (article: Article) => {
      router.push(`/article/${article._id}`)
    }
    const date = (date: string, format = 'YYYY-MM-DD HH:MM:ss') => {
      return dayjs(date).format(format)
    }
    return {
      handleFeed,
      gotoArticle,
      date
    }
  }
})
</script>

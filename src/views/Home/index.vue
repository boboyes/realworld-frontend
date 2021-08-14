<template>
  <Layout>
    <div class="home-page">

      <div class="banner">
        <div class="container">
          <h1 class="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div class="container page">
        <div class="row">

          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                <!-- <li class="nav-item">
                  <a class="nav-link disabled" href="">Your Feed</a>
                </li> -->
                <li class="nav-item" v-if="$store.state.user">
                  <span class="nav-link" @click="$store.state.user && switchType('feed')" :class="{disabled: !$store.state.user, active: articleType === 'feed'}" href="">Your Feed</span>
                </li>
                <li class="nav-item">
                  <span class="nav-link" @click="switchType('all')" href="" :class="{active: articleType === 'all'}">Global Feed</span>
                </li>
              </ul>
            </div>
            <article-item :articles="articles"/>
            <!-- <div class="article-preview" v-for="article in articles" :key="article._id">
              <div class="article-meta">
                <a href="profile.html"><img :src="article.author.image||'http://i.imgur.com/Qr71crq.jpg'" /></a>
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
            </div> -->
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

          <!-- <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>

              <div class="tag-list">
                <a href="" class="tag-pill tag-default">programming</a>
                <a href="" class="tag-pill tag-default">javascript</a>
                <a href="" class="tag-pill tag-default">emberjs</a>
                <a href="" class="tag-pill tag-default">angularjs</a>
                <a href="" class="tag-pill tag-default">react</a>
                <a href="" class="tag-pill tag-default">mean</a>
                <a href="" class="tag-pill tag-default">node</a>
                <a href="" class="tag-pill tag-default">rails</a>
              </div>
            </div>
          </div> -->

        </div>
      </div>

    </div>
  </Layout>

</template>

<script lang="ts">
import { getArticles, Article, getFeedArticles, favoriteArticle, unfavoriteArticle } from '@/api/article'
import Layout from '@/Layout/Layout.vue'
import { useRouter } from 'vue-router'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import dayjs from 'dayjs'
import ArticleItem from '@/components/ArticleItem.vue'
export default defineComponent({
  name: 'Home',
  components: { Layout, ArticleItem },
  setup () {
    const router = useRouter()
    const articles = ref<Article[]>([])
    const articlesCount = ref(0)
    const pageSzie = ref(5)
    const pageNum = ref(1)
    const articleType = ref('all')
    const totalPage = computed(() => {
      return Math.ceil(articlesCount.value / pageSzie.value)
    })
    const loadArticles = async (type = 'all') => {
      if (type === 'feed') {
        const { data } = await getFeedArticles(pageSzie.value, pageNum.value)
        articles.value = data.articles
        articlesCount.value = data.articlesCount
      } else {
        const { data } = await getArticles(pageSzie.value, pageNum.value)
        articles.value = data.articles
        articlesCount.value = data.articlesCount
      }
    }
    onBeforeMount(() => {
      loadArticles()
    })

    const gotoPage = async (page: number) => {
      pageNum.value = page
      loadArticles(articleType.value)
    }
    const switchType = async (Type: string) => {
      articleType.value = Type
      pageNum.value = 1
      loadArticles(articleType.value)
    }

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
      articles,
      pageNum,
      totalPage,
      gotoPage,
      articleType,
      switchType,
      handleFeed,
      gotoArticle,
      date
    }
  }
})
</script>

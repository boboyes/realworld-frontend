<template>
  <Layout>
    <div class="article-page">

      <div class="banner">
        <div class="container">

          <h1>{{article.title}}</h1>

          <article-meta :article="article"/>

        </div>
      </div>

      <div class="container page">

        <div class="row article-content">
          <div class="col-md-12">
            <p>
              {{article.description}}
            </p>
            <h2 id="introducing-ionic">{{article.title}}</h2>
            <p>{{article.body}}</p>
          </div>
        </div>

        <hr />

        <div class="article-actions">
          <article-meta :article="article"/>
        </div>

        <div class="row">

          <div class="col-xs-12 col-md-8 offset-md-2">

            <post-comment :article="article" @getComment="getComment"/>
            <comment
              :comment="comment"
              v-for="(comment, index) in comments"
              :key="index"
              @deleteComment="delComment"
              />
          </div>

        </div>

      </div>

    </div>
  </Layout>
</template>
<script lang="ts">
import Layout from '@/Layout/Layout.vue'
import { defineComponent, ref, onBeforeMount, reactive } from 'vue'
import { Article, favoriteArticle, getArticle, getComments, unfavoriteArticle, deleteComment } from '@/api/article'
import { useRoute } from 'vue-router'
import { followUser, unfollowUser } from '@/api/user'
import ArticleMeta from '@/components/ArticleMeta.vue'
import PostComment from '@/components/PostComment.vue'
import Comment from '@/components/comment.vue'

const useArticle = () => {
  const route = useRoute()
  const article = ref<Article | null>({
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
  })
  if (route.params.slug) {
    const loadArticle = async () => {
      const { data } = await getArticle(route.params.slug as string)
      article.value = data.article
    }
    onBeforeMount(async () => {
      await loadArticle()
    })
  }
  return {
    article
  }
}

const useComment = () => {
  const route = useRoute()
  const comments = ref<Comment[]>([])
  const commentsCount = ref(0)
  const loadComments = async () => {
    const { data } = await getComments(route.params.slug as string)
    console.log(data.comments)
    comments.value = data.comments as unknown as Comment[]
    commentsCount.value = data.commentsCount
  }
  const getComment = (comment: Comment) => {
    loadComments()
  }
  const delComment = async (slug: string, id: string) => {
    await deleteComment(slug, id)
    loadComments()
  }
  if (route.params.slug) {
    onBeforeMount(async () => {
      await loadComments()
    })
  }
  return {
    comments,
    commentsCount,
    getComment,
    delComment
  }
}

export default defineComponent({
  name: 'Article',
  components: { Layout, ArticleMeta, PostComment, Comment },
  setup () {
    return {
      ...useArticle(),
      ...useComment()
    }
  }
})
</script>

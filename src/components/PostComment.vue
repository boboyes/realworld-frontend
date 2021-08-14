<template>
  <div>
    <form class="card comment-form" @submit.prevent="postComment">
      <div class="card-block">
        <textarea v-model="comment.body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">
        Post Comment
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { createComment } from '@/api/article'
import { defineComponent, reactive } from 'vue'

const useComment = (props: any, context:any) => {
  const comment = reactive({
    body: ''
  })
  const postComment = async () => {
    try {
      const ct = await createComment(props.article._id, comment)
      context.emit('getComment', ct)
      comment.body = ''
    } catch (e) {

    }
  }
  return {
    comment,
    postComment
  }
}

export default defineComponent({
  name: 'PostComment',
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
  setup (props:any, context: any) {
    return {
      ...useComment(props, context)
    }
  }
})
</script>

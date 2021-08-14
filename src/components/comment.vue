<template>
  <div class="card">
    <div class="card-block">
      <p class="card-text">{{comment.body}}</p>
    </div>
    <div class="card-footer">
      <a href="" class="comment-author">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
      </a>
      &nbsp;
      <a href="" class="comment-author">{{comment.author.username}}</a>
      <span class="date-posted">{{date(comment.createdAt, 'MMM DD, YYYY')}}</span>
      <span class="mod-options" v-if="$store.state.user.username == comment.author.username">
        <i class="ion-edit"></i>
        <i class="ion-trash-a" @click="deleteComment(comment.article._id, comment._id)"></i>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'comment',
  props: {
    comment: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  setup (props, { emit }) {
    const deleteComment = (slug: string, id: string) => {
      emit('deleteComment', slug, id)
    }
    const date = (date: string, format = 'YYYY-MM-DD HH:MM:ss') => {
      return dayjs(date).format(format)
    }
    return {
      date,
      deleteComment
    }
  }
})
</script>

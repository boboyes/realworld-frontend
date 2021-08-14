<template>
  <Layout>
    <div class="editor-page">
      <div class="container page">
        <div class="row">

          <div class="col-md-10 offset-md-1 col-xs-12">
            <form @submit.prevent>
              <fieldset>
                <fieldset class="form-group">
                    <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
                </fieldset>
                <fieldset class="form-group">
                    <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
                </fieldset>
                <fieldset class="form-group">
                    <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
                </fieldset>
                <fieldset class="form-group">
                    <input v-model="tag" type="text" @keyup.enter="addTag" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
                    <div class="tag-list">
                      <span class="tag-default tag-pill" v-for="(tag, index) in tagList" :key="tag">
                        <i @click="deleteTag(index)" class="ion-close-round"></i>
                          {{tag}}
                      </span>
                  </div>
                </fieldset>
                <button @click="handleSubmit" class="btn btn-lg pull-xs-right btn-primary" type="button">
                    Publish Article
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
import { defineComponent, reactive, ref, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CreateArticle, getArticle, createArticle, updateArticle } from '@/api/article'

const useUpdateArticle = (article: CreateArticle, tagList: string[]) => {
  const router = useRouter()
  const route = useRoute()
  const handleSubmit = async () => {
    try {
      if (route.params.slug) {
        await updateArticle(route.params.slug as string, {
          ...article,
          tagList
        })
      } else {
        await createArticle({
          ...article,
          tagList
        })
      }
      router.push('/')
    } catch (err) {}
  }
  return {
    handleSubmit
  }
}

const useTag = (tagList: string[]) => {
  const tag = ref('')
  const addTag = () => {
    if (tag.value) {
      tagList.push(tag.value)
      console.log(tagList)
      tag.value = ''
    }
  }
  const deleteTag = (index: number) => {
    tagList.splice(index, 1)
  }
  return {
    tag,
    addTag,
    deleteTag
  }
}

export default defineComponent({
  name: 'Create',
  components: { Layout },
  setup () {
    const article = reactive({
      title: '',
      description: '',
      body: ''
    })
    const tagList = ref<string[]>([])
    const route = useRoute()
    if (route.params.slug) {
      const loadArticle = async () => {
        const { data } = await getArticle(route.params.slug as string)
        article.title = data.article.title
        article.description = data.article.description
        article.body = data.article.body
        tagList.value.push(...(data.article.tagList as string[]))
      }
      onBeforeMount(async () => {
        await loadArticle()
      })
    }
    return {
      article,
      tagList,
      ...useTag(tagList.value),
      ...useUpdateArticle(article, tagList.value)
    }
  }
})
</script>

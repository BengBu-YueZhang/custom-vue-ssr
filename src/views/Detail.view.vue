<template>
  <div>{{ title }}</div>
</template>

<script>
export default {
  name: 'DetailView',

  asyncData () {
    return {
      title: '详情页'
    }
  },

  data () {
    return {
      title: ''
    }
  }
}
</script>


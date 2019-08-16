<template>
  <div>{{ title }}</div>
</template>

<script>
export default {
  name: 'HomeView',

  asyncData () {
    return {
      title: '首页'
    }
  },

  data () {
    return {
      title: ''
    }
  }
}
</script>


<template>
  <div>{{ title }}</div>
</template>

<script>
export default {
  name: 'LoginView',

  asyncData () {
    return {
      title: '登录页'
    }
  },

  data () {
    return {
      title: ''
    }
  }
}
</script>


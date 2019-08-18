<template>
  <div>{{ title }}</div>
</template>

<script>
export default {
  name: 'HomeView',

  asyncData () {
    return Promise.resolve({
      title: '我爱你，米莉'
    })
  },

  data () {
    return {
      title: '我爱你'
    }
  }
}
</script>


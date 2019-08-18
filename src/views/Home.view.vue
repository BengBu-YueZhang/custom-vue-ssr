<template>
  <div class="home">
    <div class="home-images">
      <img class="home-images-cover1" src="/public/MillieBobbyBrown1.jpg"/>
      <img class="home-images-cover2" src="https://img1.doubanio.com/view/photo/l/public/p2389297197.webp"/>
      <img class="home-images-cover3" src="https://img3.doubanio.com/view/photo/l/public/p2392934273.webp"/>
    </div>
    <router-link class="home-link" to="/detail">MORE</router-link>
  </div>
</template>

<script>
export default {
  title: 'MillieBobbyBrown'
}
</script>

<style lang="less" scoped>
.home {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  padding-top: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  background-color: #fff;

  &-images {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 60px;

    &-cover1 {
      width: 400px;
      margin: 15px;
    }

    &-cover2 {
      width: 320px;
      margin: 15px;
    }

    &-cover3 {
      width: 350px;
      margin: 15px;
    }
  }

  &-link {
    display: block;
    font-size: 22px;
    font-weight: 600;
    text-decoration: none;
    color: #000;
    padding: 16px 70px;
    border: 1px solid #000;
    border-radius: 5px;
  }
}
</style>
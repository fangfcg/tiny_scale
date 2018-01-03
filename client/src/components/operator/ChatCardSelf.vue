<template>
<div class="self-wrap">
  <img class="-header" width="35" height="35" :src="imgUrl" alt="nopic"/>
  <div class="-msg"><span v-html="emoji(msg)"></span></div>
</div>
</template>

<script>
export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
    }
  },
  mounted () {
    this.$el.scrollIntoView()
  },
  props: ['msg', 'imgUrl']
}
</script>
<style lang='less'>
.self-wrap{
  padding: 5px 5px 15px 5px;
  position: relative;
  overflow: hidden;
  .-header{
    position: absolute;
    right: 15px;
    border-radius: 3px;
    height:35px;
    width: 35px;
  }
  .-msg{
    background-color: #b2e281;
    padding: 10px;

    float: right;
    position: relative;
    left: -60px;
    top: 0px;
    border-radius: 6px;
    font-size: 13px;
    width: fit-content;
    width:-webkit-fit-content;
    width:-moz-fit-content;
    max-width: 200px;
    word-wrap: break-word;
    box-shadow: 0 0 1px #888888;
  }
}
</style>
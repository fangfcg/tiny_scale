<template>
<div class="other-wrap">
  <img class="-header" width="35" height="35" src="assets/2.png" alt="nopic"/>
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
  props: ['msg', 'name']
}
</script>

<style lang='less'>
.other-wrap{
  margin-left:15px;
  padding: 5px 5px 0 5px;
  position: relative;
  .-header{
    justify-content: center;
    border-radius: 3px;
    height:35px;
    width: 35px;
  }
  .-name{
    position: absolute;
    font-size: 14px;
    padding: 2px;
    margin: 0 10px;
    color: #999;
  }
  .-msg{
    background-color: #fff;
    padding: 10px;
    position: relative;
    left: 40px;
    top: -40px;
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
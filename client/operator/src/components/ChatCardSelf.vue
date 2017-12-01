<template>
<div class="self-wrap">
  <img class="-header" width="35" height="35" src="assets/1.jpg" alt="nopic"/>
  <!-- <span class="-name">超级厉害</span> -->
  <div class="-msg">{{msg}}</div>
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
  props: ['msg', 'color']
}
</script>
<style lang='less'>
.self-wrap{
  /*background-color: #666;*/
  padding: 5px 5px 15px 5px;
  position: relative;
  overflow: hidden;
  /*
  .-header{
  	position: relative;
  	left: ~'calc(100% - 50px)';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #905;
    height:50px;
    width: 50px;
    border-radius: 50%;
    font-weight: bolder;
  }
  */
  .-header{
    position: absolute;
    //margin-right:-550px; 
    //left: 400px;
    right: 15px;
    border-radius: 3px;
    height:35px;
    width: 35px;
  }
 /* .-name{
    background-color: #fff;
    position: absolute;
    font-size: 14px;
    padding: 2px;
    margin: 0 10px;
  }*/
  .-msg{
    background-color: #b2e281;
    padding: 10px;

    float: right;
    position: relative;
    left: -60px;
    top: 0px;
    border-radius: 6px;
    //max-width: ~'calc(100% - 180px)';
    font-size: 13px;
    width: fit-content;
    width:-webkit-fit-content;
    width:-moz-fit-content;
    max-width: 200px;
    word-wrap: break-word;
  }
}
</style>
<template>
<div class="self-wrap">
  <img class="-header" width="35" height="35" :src="imgUrl" alt="nopic"/>
  <div class="-msg" v-if="isPicture===false"><span v-html="emoji(msg)"></span></div>
  <div class="-imgwrapper" v-if="isPicture===true">
    <img class="-img" width="100" height="100" @click="dialogVisible = true" :src="msg" alt="picErr">
    <el-dialog
      title="图片（原图大小）"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <img :src="msg">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
    }
  },
  methods: {
    handleClose (done) {
      this.dialogVisible = false
    }
  },
  mounted () {
    this.$el.scrollIntoView()
  },

  props: ['msg', 'imgUrl', 'isPicture']

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
  .-imgwrapper{
    background-color: #b2e281;
    padding: 10px;
    float: right;
    position: relative;
    left: -60px;
    top: 0px;
    border-radius: 6px;
    width: fit-content;
    width:-webkit-fit-content;
    width:-moz-fit-content;
    max-width: 200px;
    box-shadow: 0 0 1px #888888;
  }
  .-img{
    position: relative;
    border-radius: 3px;
    height:100px;
    width: 100px;
  }
}
</style>
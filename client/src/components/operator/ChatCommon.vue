<template>
  <div class="chatcommon">
    <el-card :body-style="{ height: '500px', overflow: 'auto'}">
        <div slot="header" class="clearfix">
            <span style="font-color: red">{{name}}</span>
            <el-button style="float: right; padding: 4px 2px" @click="changeStatus()">转到{{buttonName}}</el-button>
         </div>
        <button v-for="(sentence, index) in data" :key="index" @click="msg(key)" class="msgitem">
            {{sentence.text}}
        </button>
    </el-card>
  </div>
</template>



<script>

export default {
  data () {
    return {
      dialogVisible: false,
      name: '自定义回复',
      buttonName: '公司回复',
      isSelfReply: true,
      data: this.$store.state.selfData
    }
  },
  components: {
  },
  methods: {
    msg (id) {
      this.$store.commit('sendMsg', this.data[id].text)
    },
    changeStatus () {
      this.isSelfReply = !this.isSelfReply
      let tmp = this.name
      this.name = this.buttonName
      this.buttonName = tmp
      if (this.isSelfReply) {
        this.data = this.$store.state.selfData
      } else {
        this.data = this.$store.state.compData
      }
    }
  },
  created () {
  }
}
</script>


<style>
.msgitem {
    padding: 10px 10px;
    margin: 15px 2px; 
    text-align: center;
    text-decoration: none;
    display: block;
    width: 200px;
    word-wrap: break-word; 
    word-break: normal; 
	/* border-radius: .5em; */
}
</style>

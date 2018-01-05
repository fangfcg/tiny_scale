<template>
  <div class="chatcommon">
    <el-card :body-style="{ height: '500px', overflow: 'auto'}">
        <div slot="header" class="clearfix">
            <span style="font-color: red">{{name}}</span>
            <el-button style="float: right; padding: 4px 2px" @click="changeStatus()">转到{{buttonName}}</el-button>
         </div>
        <button v-for="(sentence, index) in data" :key="index" @click="msg(index)" class="msgitem">
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
      selfdata: [],
      compData: [],
      data: []
    }
  },
  components: {
  },
  methods: {
    msg (id) {
      console.log(this.data[id].text)
      this.$store.commit('sendMsg', {msg: this.data[id].text, isPic: false})
    },
    changeStatus () {
      this.isSelfReply = !this.isSelfReply
      let tmp = this.name
      this.name = this.buttonName
      this.buttonName = tmp
      if (this.isSelfReply) {
        // this.$store.commit('getSelfReply')
        this.data = this.selfData
      } else {
        // this.$store.commit('getCompReply')
        this.data = this.compData
      }
    },
    async init () {
      var responseSelf = await this.$http.get(this.$store.state.chat.serverIp + '/api/operator/get_selfreply')
      this.selfData = responseSelf.data.data
      this.data = this.selfData
      var responseComp = await this.$http.get(this.$store.state.chat.serverIp + '/api/operator/get_compreply')
      this.compData = responseComp.data.data
    }
  },
  async mounted () {
    // 对对应数据进行一次更新
    await this.init()
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

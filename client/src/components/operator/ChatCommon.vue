<template>
  <div class="chatcommon">
    <el-card :body-style="{ height: '500px' }">
        <div slot="header" class="clearfix">
            <span>{{name}}</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="setdialogVisiable()">操作按钮</el-button>
         </div>
        <button v-for="sentence in data" :key="sentence.id" @click="msg(key)" class="msgitem">
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
      name: '自定义按钮',
      data: [{text: '你好！', id: 0}, {text: '谢谢你！', id: 1}, {text: '不客气！', id: 2}, {text: '爱迪生萨达的问问企鹅我去荡秋千未求成发现我的心爱的', id: 3}]
    }
  },
  components: {
  },
  methods: {
    msg (id) {
      this.$store.commit('sendMsg', this.data[id].text)
    },
    setdialogVisiable () {
    }
  },
  created () {
  }
}
</script>


<style>
.msgitem {
    padding: 5px 10px;
    margin: 5px 2px; 
    text-align: center;
    text-decoration: none;
    display: block;
}
</style>

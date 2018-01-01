<template>
  <div class="main-contain">
    <span class="title-text">设置</span>
    <hr width=80% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <span class="main-text">管理员快捷回复设置 <el-button style="margin-left:100px" @click="selfDialogVisible = true">设置</el-button></span><br>
    <el-dialog
        title="快捷回复设置"
        :visible.sync="selfDialogVisible"
        width="70%"
        :before-close="selfHandleClose">
        <div style="text-align: center"> <el-button class="small-elbutton" @click="openAddDialog(compData.length)">新建回复</el-button> </div>

            <el-dialog
            title=""
            :visible.sync="addDialogVisible"
            width="50%"
            :before-close="addHandleClose"
            append-to-body>
              <span class="small-title">{{addTitle}}</span>
              <textarea class="big-textarea" v-model="rawText" placeholder="" maxlength="150"> </textarea>

              <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addDialogClose()">确 定</el-button>
              </span>
            </el-dialog>

        <el-table
          :data="compData"
          style="width: 100%">
          <el-table-column
            label="序号"
            min-width="20">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="自定义信息">    
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.text }}</span>
            </template>                
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="80">
            <template slot-scope="scope">
              <el-button class="small-elbutton" @click="openAddDialog(scope.$index)">修改</el-button>
                <el-button class="small-elbutton" type="danger" @click="delReply(scope.$index)">删除</el-button>
                <el-button class="small-elbutton" v-if="scope.$index != 0" @click="upReply(scope.$index)">上移</el-button>
                <el-button class="small-elbutton" v-if="scope.$index != compData.length-1" @click="downReply(scope.$index)">下移</el-button>
              
            </template>
          </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="selfDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selfDialogVisible: false,
      comDialogVisible: false,
      addDialogVisible: false,
      replyID: -1,
      rawText: '',
      addTitle: ''
    }
  },
  computed: {
    compData () {
      return this.$store.state.compData
    }
  },
  methods: {
    addHandleClose () {
      this.addDialogVisible = false
    },
    delReply (id) {
      this.compData.splice(id, 1)
    },
    upReply (id) {
      let strFormerUp = this.$store.state.compData[id - 1].text
      let strNewUp = this.$store.state.compData[id].text
      this.$store.state.compData[id].text = strFormerUp
      this.$store.state.compData[id - 1].text = strNewUp
    },
    downReply (id) {
      let strFormerDown = this.$store.state.compData[id + 1].text
      let strNewDown = this.$store.state.compData[id].text
      this.$store.state.compData[id].text = strFormerDown
      this.$store.state.compData[id + 1].text = strNewDown
    },
    updateReply (id, newMsg) {
      this.$store.state.compData[id].text = newMsg
    },
    addDialogClose () {
      this.addDialogVisible = false
      if (this.replyID === this.$store.state.compData.length) {
        this.$store.state.compData.push({text: this.rawText})
      } else {
        this.$store.state.compData[this.replyID].text = this.rawText
      }
    },
    openAddDialog (id) {
      this.replyID = id
      this.addDialogVisible = true
      if (id === this.$store.state.compData.length) {
        this.rawText = ''
        this.addTitle = '新建回复（最大长度为150字）'
      } else {
        this.rawText = this.compData[id].text
        this.addTitle = '修改第' + (id + 1) + '号回复（最大长度为150字）'
      }
    }
  }
}
</script>

<style lang='less'>
  .main-contain {
    padding:0% 15% 0 15%;
  }
  .title-text {
    font-size:25px;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .main-text {
    font-size:20px;
    margin-top:20px;
  }
  .small-title {
    font-size:20px;
    color:#ff0000;
    display: block;
    text-align: center;
  }
  .sentencesText {
    width: 70%
  }
  .buttonsArea {
    width: 30%
  }
  .big-textarea {
    height: 120px;
    margin-left: 10%;
    margin-top: 20px;
    width: 80%;
    font-size: 16px;
  }
  .small-elbutton {
    margin: 5px 10px;
    padding: 8px 16px;
  }
</style>
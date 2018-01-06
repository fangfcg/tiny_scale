<template>
  <div class="main-contain">
    <span class="title-text">机器人设置</span>
    <hr width=80% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <span class="main-text">问候语及默认回复设置</span><br>
    <div class="submain-text">
      <span >问候语</span><br>
      <el-input
        class="name-input"
        :disabled="greetingFlag"
        v-model="inputGreeting">
      </el-input>
      <el-button @click="greetingModify">修改</el-button>
      <el-button :disabled="greetingFlag" @click="greetingSubmit">提交</el-button><br>
    </div>
    <div class="submain-text">
      <span>默认回复</span><br>
      <el-input
        class="name-input"
        :disabled="noAnswerFlag"
        v-model="inputNoAnswer">
      </el-input>
      <el-button @click="noAnswerModify">修改</el-button>
      <el-button :disabled="noAnswerFlag" @click="noAnswerSubmit">提交</el-button>
    </div>
    <hr width=70% size=1 color=#c5c5c5 style="FILTER: alpha(opacity=100,finishopacity=0,style=3)"> 
    <div class="normal-content"><span class="main-text">问题设置</span></div>
    <div class="normal-content"><el-button @click="addNewQues">添加新问题</el-button></div>
    <div class="normal-content"><span class="submain-text">问题列表</span></div>
    <template>
      <el-table
        :data="tableData"
        v-loading="loadingtabel"
        :stripe="true"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="width: 90%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="问题名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="问题内容">
                <span>{{ props.row.mainQues }}</span>
              </el-form-item>
              <el-form-item label="相似问题1">
                <span>{{ props.row.similarQues1 }}</span>
              </el-form-item>
              <el-form-item label="相似问题2">
                <span>{{ props.row.similarQues2 }}</span>
              </el-form-item>
              <el-form-item label="问题回答">
                <span>{{ props.row.answer }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
        label="问题名称"
        prop="name">
        </el-table-column>
        <el-table-column
        label="问题内容"
        prop="mainQues">
        </el-table-column>
        <!--<el-table-column
        label="问题回答"
        prop="answer">
        </el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="props">
          <el-button
            size="mini"
            @click="handleEdit(props.$index, props.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(props.$index, props.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <el-dialog title="问题列表" :visible.sync="dialogFormVisible">
      <el-form :model="formQues">
        <el-form-item label="问题名称" :label-width="formLabelWidth">
          <el-input v-model="formQues.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题内容" :label-width="formLabelWidth">
          <el-input v-model="formQues.mainQues" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="相似问题1" :label-width="formLabelWidth">
          <el-input v-model="formQues.similarQues1" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="相似问题2" :label-width="formLabelWidth">
          <el-input v-model="formQues.similarQues2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="问题回答" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="3" v-model="formQues.answer" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var Robot = {
  async created () {
    let res = await this.$http.get(this.$store.state.admin.serverIp + '/api/robot/get_question_list')
    let response = res.data
    console.log(response)
    for (let ques of response) {
      let data = {}
      data.name = ques.name
      data.mainQues = ques.content
      data.similarQues1 = ques.similarities.length > 0 ? ques.similarities[0] : ''
      data.similarQues2 = ques.similarities.length > 1 ? ques.similarities[1] : ''
      data.answer = ques.answer
      data.questionId = ques.questionId
      this.tableData.push(data)
    }
    console.log(this.tableData)
    res = await this.$http.get(this.$store.state.admin.serverIp + '/api/robot/get_special')
    response = res.data
    this.inputGreeting = response.greet
    this.inputNoAnswer = response.unknown
  },
  data () {
    return {
      greetingFlag: true,
      inputGreeting: 'hello',
      noAnswerFlag: true,
      inputNoAnswer: 'no answer',
      loadingtabel: false,
      dialogFormVisible: false,
      currentIndex: 0,
      formLabelWidth: '120px',
      formQues: {
        questionId: '',
        name: '',
        mainQues: '',
        similarQues1: '',
        similarQues2: '',
        answer: ''
      },
      tableData: []
    }
  },
  computed: {
    serverIp () {
      return this.$store.state.admin.serverIp
    }
  },
  methods: {
    greetingModify () {
      this.greetingFlag = !this.greetingFlag
    },
    async greetingSubmit () {
      await this.$http.post(this.serverIp + '/api/robot/set_special', {
        type: 'greet',
        content: this.inputGreeting
      })
      this.greetingFlag = !this.greetingFlag
    },
    noAnswerModify () {
      this.noAnswerFlag = !this.noAnswerFlag
    },
    async noAnswerSubmit () {
      await this.$http.post(this.serverIp + '/api/robot/set_special', {
        type: 'unknown',
        content: this.inputNoAnswer
      })
      this.noAnswerFlag = !this.noAnswerFlag
    },
    handleEdit (index, prop) {
      this.currentIndex = index
      this.formQues.name = prop.name
      this.formQues.mainQues = prop.mainQues
      this.formQues.similarQues1 = prop.similarQues1
      this.formQues.similarQues2 = prop.similarQues2
      this.formQues.answer = prop.answer
      this.formQues.questionId = prop.questionId
      this.dialogFormVisible = true
    },
    handleDelete (index, prop) {
      this.$confirm('请确认是否删除该问题?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(this.serverIp + '/api/robot/del', {
          questionId: this.tableData[index].questionId
        }).then(function (response) {
          if (response.success === true) {
            Robot.tableData.splice(index, 1)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addNewQues () {
      this.currentIndex = this.tableData.length
      this.formQues.name = ''
      this.formQues.mainQues = ''
      this.formQues.similarQues1 = ''
      this.formQues.similarQues2 = ''
      this.formQues.answer = ''
      this.formQues.questionId = '-1'
      this.dialogFormVisible = true
    },
    async dialogEdit () {
      var tmpQues = {}
      if (this.formQues.name === '' || this.formQues.mainQues === '' || this.formQues.answer === '') {
        this.$message({
          type: 'warning',
          message: '问题名称、问题内容、问题回答不能为空'
        })
        return
      }
      if (this.currentIndex === this.tableData.length) {
        tmpQues.name = this.formQues.name
        tmpQues.mainQues = this.formQues.mainQues
        tmpQues.similarQues1 = this.formQues.similarQues1
        tmpQues.similarQues2 = this.formQues.similarQues2
        tmpQues.answer = this.formQues.answer
        let postObj = {}
        postObj.similarities = []
        postObj.name = tmpQues.name
        postObj.content = tmpQues.mainQues
        if (tmpQues.similarQues1 !== '') {
          postObj.similarities.push(tmpQues.similarQues1)
        }
        if (tmpQues.similarQues2 !== '') {
          postObj.similarities.push(tmpQues.similarQues2)
        }
        postObj.answer = tmpQues.answer
        this.tableData.push(tmpQues)
        let res = await this.$http.post(this.serverIp + '/api/robot/add', postObj)
        let response = res.data
        if (response.success === true) {
          this.tableData[this.tableData.length - 1].questionId = response.questionId
        } else {
          this.tableData.splice(this.tableData.length - 1, 1)
        }
      } else {
        tmpQues = this.tableData[this.currentIndex]
        tmpQues.name = this.formQues.name
        tmpQues.mainQues = this.formQues.mainQues
        tmpQues.similarQues1 = this.formQues.similarQues1
        tmpQues.similarQues2 = this.formQues.similarQues2
        tmpQues.answer = this.formQues.answer
        let postObj = {}
        postObj.similarities = []
        postObj.name = tmpQues.name
        postObj.content = tmpQues.mainQues
        if (tmpQues.similarQues1 !== '') {
          postObj.similarities.push(tmpQues.similarQues1)
        }
        if (tmpQues.similarQues2 !== '') {
          postObj.similarities.push(tmpQues.similarQues2)
        }
        postObj.answer = tmpQues.answer
        postObj.questionId = tmpQues.questionId
        await this.$http.post(this.serverIp + '/api/robot/modify', postObj)
      }
      this.dialogFormVisible = false
    }
  }
}
export default Robot
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
  .normal-content {
    margin-top: 20px;
  }
  .main-text {
    font-size:20px;
    margin-top:20px;
  }
  .submain-text {
    margin-top: 30px;
  }
  .avatar-uploader .el-upload {
    margin-top:20px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .name-input, .email-input {
    width:200px;
    margin-top:20px;
    margin-right:40px;
  }
  // new style
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
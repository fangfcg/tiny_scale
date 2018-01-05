<template>
  <div class="body-wrapper">
    <template v-if="this.$store.state.chat.currentNum > 0">

      <template v-for="msgObj in this.$store.state.chat.userList[this.$store.state.chat.currentIndex].msgList">
        <template v-if="msgObj.type === 2">
          <chat-card-system :msg="msgObj.msg" :key="msgObj.msgId"></chat-card-system>
        </template>
        <template>
          <chat-card-other v-if="msgObj.type === 1" :msg="msgObj.msg" :key="msgObj.msgId" :isPicture="msgObj.isPicture"></chat-card-other>
          <chat-card-self v-if="msgObj.type === 0" :msg="msgObj.msg" :key="msgObj.msgId" :imgUrl="imgUrl" :isPicture="msgObj.isPicture"></chat-card-self>
        </template>
      </template>
    </template>
  </div>

</template>

<script>
import ChatCardSelf from './ChatCardSelf'
import ChatCardSystem from './ChatCardSystem'
import ChatCardOther from './ChatCardOther'
export default {
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
    imgUrl () {
      return this.$store.state.chat.imgUrl
    },
    msgList () {
      /*
      if (this.$store.state.chat.userList[this.$store.state.chat.currentIndex] === undefined ||
        this.$store.state.chat.userList[this.$store.state.chat.currentIndex] === null) {
        return null
      }
      return this.$store.state.chat.userList[this.$store.state.chat.currentIndex].msgList
      */
    }
  },
  /*
  watch: {
    msgList () {
      var container = this.$el.querySelector('.body-wrapper')
      container.scrollTop = container.scrollHeight
    }
  },
  */
  components: {
    ChatCardOther,
    ChatCardSelf,
    ChatCardSystem
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.body-wrapper{
  background-color: #eee;
  height: ~'calc(100% - 90px)';
  overflow-y: scroll;
  width: 100%;
}
</style>
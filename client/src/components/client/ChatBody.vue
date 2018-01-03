<template>
  <div class="content">
    <template v-for="msgObj in this.$store.state.chat.msgList">
      <template v-if="msgObj.type === 2">
        <chat-card-system :msg="msgObj.msg" :key="msgObj.msgId"></chat-card-system>
      </template>
      <template>
        <chat-card-other v-if="msgObj.type === 1" :name="msgObj.name" :msg="msgObj.msg" :imgUrl="msgObj.imgUrl" :key="msgObj.msgId" :isPicture="msgObj.isPicture"></chat-card-other>
        <chat-card-self v-if="msgObj.type === 0" :msg="msgObj.msg" :key="msgObj.msgId" :isPicture="msgObj.isPicture"></chat-card-self>
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
  computed: {
    imgUrl () {
      return this.$store.state.chat.imgUrl
    }
  },
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
.content{
  background-color: #eee;
  height: ~'calc(100% - 90px)';
  overflow-y: scroll;
  width: 100%;
}
</style>
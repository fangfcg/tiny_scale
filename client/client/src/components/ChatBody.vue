<template>
  <div class="body-wrapper">
    <template v-for="msgObj in chatobj.msgList">
      <template v-if="msgObj.type === 2">
        <chat-card-system :msg="msgObj.msg" :key="msgObj.msgId"></chat-card-system>
      </template>
      <template>
        <chat-card-other v-if="msgObj.type === 1" :name="msgObj.name" :msg="msgObj.msg" :color="msgObj.color" :key="msgObj.msgId"></chat-card-other>
        <chat-card-self v-if="msgObj.type === 0" :msg="msgObj.msg" :color="msgObj.color" :key="msgObj.msgId"></chat-card-self>
      </template>
    </template>
    <!-- <other-msg></other-msg> -->
  </div>

</template>

<script>
import ChatCardSelf from './ChatCardSelf'
import ChatCardSystem from './ChatCardSystem'
import ChatCardOther from './ChatCardOther'
// import Chat from '../api/client'
export default {
  data () {
    return {
    }
  },
  created () {
  },
  components: {
    ChatCardOther,
    ChatCardSelf,
    ChatCardSystem
  },
  methods: {
  },
  props: ['chatobj']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.body-wrapper{
  background-color: #DCDCDC;
  height: ~'calc(100% - 90px)';
  overflow-y: scroll;
  width: 100%;
}
</style>
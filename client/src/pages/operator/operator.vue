<template>
  <div class="app">
    <chat-index></chat-index>
  </div>
  <!-- <group-info></group-info> -->
</template>

<script>

import ChatIndex from '@/components/operator/ChatIndex'

export default {
  name: 'app',
  components: {
    ChatIndex
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
}

body {
  height: 100%;
}

</style>

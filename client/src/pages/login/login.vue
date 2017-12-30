<template>
  <div class="app">
    <login-index></login-index>
  </div>
</template>

<script>

import loginIndex from '@/components/login/loginIndex'

export default {
  name: 'app',
  components: {
    loginIndex
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

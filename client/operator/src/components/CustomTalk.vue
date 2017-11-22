<template>
<div class="CustomTalk">
    <el-row>
        <el-col :span="6">
            <el-menu class="el-menu-vertical-demo">
                <el-menu-item v-for="cus in this.$store.state.customerArray":key="cus.id" >
                    用户{{cus.id}}
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>   
    </div>
</template>



<script>
export default {
  name: 'CustomTalk',
  methods: {

  }
}
</script>

<style>

</style>
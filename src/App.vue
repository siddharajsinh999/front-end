<template>
  <MainLayout />
</template>

<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}

.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 100% !important;
}

.el-input__wrapper {
  border-radius: 6px !important;
}
</style>

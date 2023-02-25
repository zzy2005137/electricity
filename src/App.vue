<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.filter-container {
  margin-bottom: 1.5rem;
}

.filter-container .el-input,
.filter-container .el-select {
  margin-right: 1rem;
}
</style>

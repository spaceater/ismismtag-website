<template>
  <div class="not-found" @click="goHome">
    你所寻找的内容已经遁入实在界荒漠
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.not-found {
  position: absolute;
  left: 50%;
  top: 50%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 4rem;
  text-decoration: underline;
  white-space: nowrap;
  cursor: pointer;
}

.not-found:hover {
  color: brown;
}
</style>

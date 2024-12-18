<template>
  <n-button @click="handleClick">Click me</n-button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      alert('Button clicked!')
    }
  }
}
</script>

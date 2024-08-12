<script setup>
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';

onMounted(async () => {});

document.addEventListener(
  'touchmove',
  function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

let lastTouchEnd = 0;
document.addEventListener(
  'touchend',
  function (event) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  },
  false
);

document.addEventListener(
  'touchmove',
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);
</script>

<template>
  <RouterView />
</template>

<style scoped></style>

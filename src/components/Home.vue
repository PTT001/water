<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import "vue3-toastify/dist/index.css";
import router from "../rotuer/index";

//safari 100vh
const setViewportHeight = () => {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty("--adjusted-vh", `${vh}px`);
};

setViewportHeight();
window.addEventListener("resize", setViewportHeight);

const activeImage = ref(0);

const toggleImages = () => {
  activeImage.value = activeImage.value === 0 ? 1 : 0;
};

let interval;

const button = (type) => {
  router.push({
    path: "/pray",
    query: {
      type,
    },
  });
};

onMounted(async () => {
  import("./result.vue");
  interval = setInterval(toggleImages, 700);
  // const userAgent = navigator.userAgent.toLowerCase();
  // alert(userAgent);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="section0">
    <div
      class="flex justify-center mt-[10px] sm:mt-[50px] md2:scale-[1.2] md2:mb-[100px] lg:scale-[1.5] lg:mb-[200px]"
    >
      <img src="/Home_Title.svg" alt="1" />
    </div>
    <div class="flex flex-col items-center mx-4 mt-[30px] sm:mt-[50px]">
      <div
        class="flex sm:mb-[30px] md2:scale-[1.2] md2:mb-[100px] lg:scale-[1.5] lg:mb-[250px]"
      >
        <div>
          <img
            :class="{
              'scale-up': activeImage === 0,
              'scale-down': activeImage !== 0,
            }"
            src="/Flowerlamp.svg"
            alt="2"
            @click="button(0)"
          />
        </div>

        <div>
          <img
            :class="{
              'scale-up': activeImage === 1,
              'scale-down': activeImage !== 1,
            }"
            src="/houselamp.svg"
            alt="3"
            @click="button(1)"
          />
        </div>
      </div>

      <!-- <div class="relative">
        <img
          src="/cloud.svg"
          alt=""
          class="scale-[1.1] md2:scale-[1.7] lg:scale-[2.5]"
        />

        <div class="absolute inset-0 top-8 flex items-center justify-center">
          <h1 class="typing">留下祝福話語...</h1>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style scoped>
:root {
  --adjusted-vh: 100vh;
}

.section0 {
  height: var(--adjusted-vh);
  background-image: url(/Body.svg);
  background-size: cover;
  background-attachment: fixed;
  background-position: center center;
  overflow: auto;
}

.scale-up {
  transform: scale(1.1);
  transition: transform 0.5s ease-in-out;
}

.scale-down {
  transform: scale(1);
  transition: transform 0.5s ease-in-out;
}

.typing {
  font-family: "Noto Sans TC", sans-serif;
  color: #b98c48;
  font-weight: 700;
}
</style>

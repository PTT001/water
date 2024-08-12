<script setup>
import { ref, onMounted } from 'vue';

//safari 100vh
const setViewportHeight = () => {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty('--adjusted-vh', `${vh}px`);
};

setViewportHeight();
window.addEventListener('resize', setViewportHeight);

const showContent = ref(false);
const contentVisible = ref(false);

onMounted(async () => {
  showContent.value = true;

  // 使用 setTimeout 來確保 DOM 已更新
  setTimeout(() => {
    // 然後設置 contentVisible 為 true 來觸發淡入效果
    contentVisible.value = true;
  }, 50);
});

const backToHome = () => {
  const fullUrl = window.location.href;
  const url = new URL(fullUrl);
  const searchParams = url.search;
  const newUrl = `${url.origin}${url.pathname}${searchParams}`;

  window.location.href = newUrl;
};
</script>

<template>
  <div class="section0 flex justify-center">
    <div class="section1">
      <div
        class="flex justify-center mt-[20px] sm:mt-[40px] md:mt-[80px] lg:scale-[1.5]"
      >
        <img src="/success_title.svg" alt="1" />
      </div>

      <div
        v-show="showContent"
        :class="['fade-content', { 'fade-in': contentVisible }]"
      >
        <a-scene
          device-orientation-permission-ui="enabled: false"
          vr-mode-ui="enabled: false"
        >
          <a-entity
            id="a-camera"
            camera
            position="0 0 0"
            look-controls="enabled: false"
            scale="1 1 1"
          >
          </a-entity>

          <a-entity position="0 0 0" rotation="0 0 0">
            <a-entity position="0 0 0" rotation="0 0 0" scale="1 1 1">
              <a-gltf-model
                rotation="0 0 0"
                position="0 -0.1 -2.5"
                scale="0.5 0.5 0.5"
                src="./elephant.glb"
                animation-mixer
                @animation-finished="handleAnimationFinished"
                @model-loaded="test"
              ></a-gltf-model>
            </a-entity>
          </a-entity>
        </a-scene>
      </div>

      <div
        v-show="showContent"
        :class="['fade-content', { 'fade-in': contentVisible }]"
      >
        <div class="mt-[180px] sm:mt-[260px] lg:mt-[450px] relative">
          <img
            src="/cloud.svg"
            alt=""
            class="scale-[1.35] sm:scale-[1.5] md:scale-[2] lg:scale-[2.5]"
          />

          <div class="absolute inset-0 top-12 flex items-center justify-center">
            <h1 class="typing w-[250px] lg:w-[400px] lg:text-[25px]">
              請看5G互動車，找看看你的水燈吧！點擊【再放一次】即可繼續許願喔！
            </h1>
          </div>
        </div>
      </div>

      <div
        class="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 md:scale-[1.5] md:bottom-[140px]"
      >
        <div>
          <img src="/PlayAgain.svg" alt="" @click="backToHome" />
        </div>
      </div>
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
  background-position: center center;
  background-size: cover;
  overflow: auto;
}

.typing {
  font-family: 'Noto Sans TC', sans-serif;
  color: #a56477;
  font-weight: 700;
}

.fade-content {
  opacity: 0;
  transition: opacity 3s ease-in-out;
}

.fade-content.fade-in {
  opacity: 1;
}

.a-enter-vr-button {
  display: none !important;
}
</style>

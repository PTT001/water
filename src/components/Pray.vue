<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import axios from "axios";
import { Typed } from "@duskmoon/vue3-typed-js";
import { useRoute } from "vue-router";
import router from "../rotuer";

const route = useRoute();

const options = {
  strings: ["點擊輸入文字...(24字內)"],
  // loop: true,
  typeSpeed: 100,
  showCursor: false,
};

const sending = ref(false);
const messageSent = ref(false);
const send_success = ref(false);
const typing = ref(false);
const messageData = ref({
  msg: "",
  type: "",
});
const filterWords = ref([]);
const textareaRef = ref(null);
const text = ref(true);
const type = route.query.type;

//safari 100vh
const setViewportHeight = () => {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty("--adjusted-vh", `${vh}px`);
};

setViewportHeight();
window.addEventListener("resize", setViewportHeight);

onMounted(async () => {
  try {
    const response = await axios.get("filter_words.json");
    filterWords.value = response.data;
  } catch (error) {
    console.error(error);
  }

  videoPlayer.value.load();
  messageData.value.type = route.query.type;
});

function SendMessage(message_data, progressCallBack) {
  return ArplanetResourceBridge.SendMessage(message_data, progressCallBack);
}

const videoEnded = ref(false);

const ClickSendMessagge = async () => {
  showVideo.value = true;
  sending.value = true;
  videoEnded.value = false;
  videoPlayer.value.play();

  if (messageData.value.msg !== "") {
    filterMessage();
    SendMessage(messageData.value, (evt) => {})
      .then(async (res) => {
        send_success.value = true;
        sending.value = false;
        checkAndNavigate();
      })
      .catch((err) => {
        sending.value = false;
        send_success.value = false;
        toast.error(`${err.message}`);
      });
  }
};

const onVideoEnded = () => {
  showVideo.value = false;
  videoEnded.value = true;
  checkAndNavigate();
};

const checkAndNavigate = async () => {
  if (videoEnded.value && send_success.value) {
    router.push(`/result`);
  }
};

function filterMessage() {
  filterWords.value.forEach((word) => {
    messageData.value.msg = messageData.value.msg.replace(
      new RegExp(`${word}`, "g"),
      "*"
    );
  });
}

function shrinkTextarea(event) {
  typing.value = false;
  if (messageData.value.msg === "") {
    text.value = true;
  }
}

const focusTextarea = () => {
  text.value = false;
  nextTick(() => {
    textareaRef.value.focus();
  });
};

const showVideo = ref(false);
const videoPlayer = ref(null);

const activeImage = ref(0);

const toggleImages = () => {
  activeImage.value = activeImage.value === 0 ? 1 : 0;
};

let interval;

onMounted(async () => {
  interval = setInterval(toggleImages, 700);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div>
    <div
      id="background"
      class="section0 flex justify-center bg-zoom-transition"
    >
      <div class="section1" v-show="!messageSent">
        <div
          class="flex justify-center mt-[10px] sm:mt-[30px] md:mb-[100px] lg:scale-[1.8] lg:mt-[100px]"
        >
          <img src="/Pray_Title.svg" alt="1" @click="button1" />
        </div>

        <div>
          <div
            class="mt-[20px] sm:mt-[50px] relative md2:scale-[1.5] lg:mt-[300px] lg:scale-[2]"
          >
            <img src="/cloud.svg" alt="" class="scale-[1.1] sm:scale-[1.3]" />

            <div
              class="absolute inset-0 top-6 flex items-center justify-center"
            >
              <Typed :options="options" v-show="text">
                <h1 class="typing" @click="focusTextarea"></h1>
              </Typed>

              <textarea
                onkeydown="if(event.keyCode == 13) return false;"
                class="typing"
                v-show="!text"
                maxlength="24"
                @blur="shrinkTextarea"
                cols="8"
                rows="3"
                v-model="messageData.msg"
                ref="textareaRef"
                style="
                  background-color: #f8f8f8;
                  color: #a56477;
                  font-weight: 700;
                "
              ></textarea>
            </div>
          </div>

          <div id="lamp" class="lamp lamp-transition">
            <div
              class="flex justify-center -mt-5 relative sm:scale-[1.1] md2:scale-[1.5] md2:mt-14"
              v-if="route.query.type == 0"
            >
              <img src="/Flowerlamp2.svg" alt="" />
            </div>

            <div
              class="flex justify-center -mt-5 relative sm:scale-[1.1]"
              v-else
            >
              <img src="/houselamp2.svg" alt="" />
            </div>
          </div>
        </div>

        <div
          class="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 lg:scale-[1.5] lg:bottom-[100px]"
        >
          <div v-if="!typing && messageData.msg && !sending">
            <img
              :class="{
                'scale-up': activeImage === 0,
                'scale-down': activeImage !== 0,
              }"
              src="/hasInput.svg"
              alt=""
              @click="ClickSendMessagge"
            />
          </div>

          <div v-if="!typing && !messageData.msg">
            <img src="/NoInput.svg" alt="" />
          </div>
        </div>
      </div>
    </div>

    <div
      :class="[
        'video-container',
        'opacity-0',
        'pointer-events-none',
        { 'opacity-100': showVideo },
      ]"
    >
      <video
        id="myVideo"
        ref="videoPlayer"
        class="full-screen-video"
        preload="auto"
        @ended="onVideoEnded"
      >
        <source
          :src="`https://s3.ap-southeast-1.amazonaws.com/coreinteraction.arplanets.com/web_project/prod/minhsiungdashiye/waterlight/video${type}.mp4`"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
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
  background-position: center bottom;
  background-size: cover;
  overflow: auto;
}

.video-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  background-color: black;
}

.full-screen-video {
  transition: opacity 0.5s ease;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.typing {
  font-family: "Noto Sans TC", sans-serif;
  color: #cccccc;
  resize: none;
  overflow: hidden;
}

.scale-up {
  transform: scale(1.1);
  transition: transform 0.5s ease-in-out;
}

.scale-down {
  transform: scale(1);
  transition: transform 0.5s ease-in-out;
}
</style>

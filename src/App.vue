<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import axios from 'axios';
import { Typed } from '@duskmoon/vue3-typed-js';

const options = {
  strings: ['點此輸入文字'],
  loop: true,
  typeSpeed: 100,
  showCursor: false,
};

const sending = ref(false);
const messages = ref([]);
const messageSent = ref(false);
const send_success = ref(false);
const typing = ref(false);
const show_messages = ref(false);
const messageData = ref({
  msg: '',
});
const filterWords = ref([]);
const textareaRef = ref(null);
const text = ref(true);

//safari 100vh
const setViewportHeight = () => {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty('--adjusted-vh', `${vh}px`);
};

setViewportHeight();
window.addEventListener('resize', setViewportHeight);

onMounted(async () => {
  try {
    const response = await axios.get('filter_words.json');
    filterWords.value = response.data;
  } catch (error) {
    console.error(error);
  }
});

function SendMessage(message_data, progressCallBack) {
  return ArplanetResourceBridge.SendMessage(message_data, progressCallBack);
}

function ListMessage(beforeDays = 180, pageNum = 100) {
  return ArplanetResourceBridge.ListAllMessage(beforeDays, pageNum);
}

function GetListMessageBySort(sort = 'desc') {
  return ArplanetResourceBridge.GetListMessageBySort(sort);
}

const ClickSendMessagge = async () => {
  if (messageData.value.msg !== '') {
    sending.value = true;
    filterMessage();
    SendMessage(messageData.value, evt => {
      if (evt.lengthComputable) {
        let percentComplete = evt.loaded / evt.total;
        console.log('上傳' + Math.round(percentComplete * 100) + '%');
      }
    })
      .then(res => {
        messageData.value = {
          msg: '',
        };

        send_success.value = true;
        messageSent.value = true;

        setTimeout(() => {
          // ShowUIList()
          sending.value = false;
          send_success.value = false;
        }, 1000);
      })
      .catch(err => {
        sending.value = false;
        toast.error(`上傳失敗，${err.message}`);
      });
  }
};

function ShowUIList() {
  show_messages.value = true;

  ListMessage()
    .then(res => {
      console.log(res, '?');
      //取得所有排序的訊息資料
      messages.value = GetListMessageBySort('desc');
    })
    .catch(err => {
      toast.error(`留言取得失敗，${err.message}`);
    });
}

function filterMessage() {
  filterWords.value.forEach(word => {
    messageData.value.msg = messageData.value.msg.replace(
      new RegExp(`${word}`, 'g'),
      '*'
    );
  });
}

function expandTextarea(event) {
  typing.value = true;
  event.target.rows = 10;
  event.target.cols = 1;
  event.target.placeholder = '';
}

function shrinkTextarea(event) {
  typing.value = false;
  if (messageData.value.msg === '') {
    event.target.rows = 10;
    event.target.cols = 1;
    text.value = true;
  }
}

const backToHome = () => {
  messageSent.value = false;
  text.value = true;
};

const focusTextarea = () => {
  text.value = false;
  nextTick(() => {
    textareaRef.value.focus();
    console.log(123);
  });
};
</script>

<template>
  <div class="section0">
    <!-- <button @click="ShowUIList">列表</button> -->
    <!-- <div v-for="message in messages">
        <div>
          <h2>{{ message.state.msg }}</h2>
        </div>
      </div> -->
    <div class="section1" v-show="!messageSent">
      <div class="frame">
        <img src="/frame.svg" alt="" />
      </div>

      <div class="test" v-if="!sending">
        <Typed :options="options" v-show="text">
          <h1 class="typing" @click="focusTextarea"></h1>
        </Typed>

        <textarea
          v-show="!text"
          maxlength="10"
          rows="10"
          cols="1"
          class="vertical-input"
          @focus="expandTextarea"
          @blur="shrinkTextarea"
          v-model="messageData.msg"
          ref="textareaRef"
        ></textarea>
      </div>

      <div class="test" v-else>
        <h1>傳送中</h1>
      </div>

      <div class="Send" v-if="!typing && messageData.msg">
        <img src="/Send.png" alt="" @click="ClickSendMessagge" />
      </div>

      <div class="Send" v-if="!typing && !messageData.msg">
        <img src="/untyped.png" alt="" @click="ClickSendMessagge" />
      </div>
    </div>

    <div class="section2" v-show="messageSent">
      <div class="frame">
        <img src="/frame2.svg" alt="" />
      </div>

      <div class="Send">
        <img src="/again.png" alt="" @click="backToHome" />
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
  background-image: url(/bg.svg);
  background-size: cover;
  background-attachment: fixed;
  background-position: center center;
  overflow: auto;
}

.test {
  writing-mode: vertical-lr;
  font-family: 'Noto Sans TC', sans-serif;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: #ba8e37;
}

.vertical-input {
  writing-mode: horizontal-tb;
  color: #987226;
  font-weight: bold;
  font-size: 18px;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  line-height: 20px;
}

.frame {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.Send {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

@media (min-width: 360px) {
  .Send {
    bottom: 15%;
  }
}

@media (min-width: 390px) {
  .Send {
    bottom: 20%;
  }
}

@media (min-width: 768px) {
  .frame {
    top: 25%;
    transform: translateX(-50%) scale(1.8);
  }

  .vertical-input {
    font-size: 30px;
    line-height: 30px;
  }

  .Send {
    bottom: 15%;
  }
}

@media (min-width: 820px) {
  .frame {
    top: 30%;
    transform: translateX(-50%) scale(2.5);
  }

  .vertical-input {
    font-size: 40px;
    line-height: 40px;
  }
}

@media (min-width: 1200px) {
  .frame {
    top: 35%;
    transform: translateX(-50%) scale(3);
  }

  .Send {
    transform: translateX(-50%) scale(1.3);
  }
}
</style>

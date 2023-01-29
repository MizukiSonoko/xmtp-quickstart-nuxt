<script lang="ts" setup>
import { Signer } from '@/service/web3';
import { Message, XmtpClient } from '@/service/xmtp';
import { ref } from "@nuxtjs/composition-api";

// service components
const singer = new Signer();
const xmtp = new XmtpClient();

// addresses 
const address = ref("");
const partner = ref("");

// send message
const newMessage = ref("");

// loaded messages
const messages = ref([] as Message[]);

const connect = () => {
  singer.connectWallet(async (addr: string) => {
    address.value = addr;
    await xmtp.init(singer);
  });
}

const loadMessage = async () => {
  messages.value = await xmtp.getMessagesFrom(partner.value);
}

const sendMessage = async () => {
  messages.value.push(await xmtp.sendMessage(newMessage.value, partner.value));
}
</script>

<template>
  <div class="m-4">
    Hello world! 
    <div v-if="address.length !== 0">
      <p>I'm {{ address }}</p>
      <input class="border w-1/3" v-model="partner" placeholder="partner address"/>
      <button class="rounded-lg m-4 p-2 bg-gray-200" @click="loadMessage" >LoadMessage</button>
    </div>
    <button v-else class="rounded-lg m-4 p-2 bg-gray-200" @click="connect" >Connect</button>
    <br/>
    <div class="p-4" v-if="messages.length !== 0">
      <div class="my-4 px-2 py-3 shadow-md rounded-lg" v-for="(m,i) in messages" :key="i">
        <p class="text-xs">From: {{ m.from }} / {{  m.sent }}</p>
        <p class="text-base font-bold">{{ m.content }}</p>
      </div>
      <div class="my-4 px-2 py-3 shadow-md rounded-lg">
        <p class="text-xs">From: {{ address }}</p>
        <input class="border w-1/3" v-model="newMessage" placeholder="new message"/>
        <button class="rounded-lg m-4 p-2 bg-gray-200" @click="sendMessage" >Submit</button>
      </div>
    </div>
  </div> 
</template>


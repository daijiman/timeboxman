<template>
	<div class="m-10">
		<input
			id="room-id"
			v-model="roomId"
			class="border rounded text-center w-36 p-1"
			maxlength="10"
		/>
		<button
			id="room-button"
			class="border rounded p-1"
			@click="sendGetRoomId"
		>
			Room
		</button>
		<button
			id="set-room-id-button"
			class="border rounded p-1"
			@click="manualSendSetRoomId"
		>
			Set Room
		</button>
		<div class="m-1">
			<input
				id="room-url"
				v-model="roomUrl"
				class="border rounded text-center w-max p-1"
			/>
			<button id="copy-button" class="border rounded p-1" @click="doCopy">
				URLをコピーする
			</button>
		</div>
	</div>
</template>
    
<script>
import Vue from "vue";
import { mapState } from "vuex";
export default Vue.extend({
  props: [],
  data() {
    return {};
  },
  computed: {
    ...mapState(["timerTime"]),
  },
  methods: {
  },
});
</script>
<script>
	import chatInput from '../../components/chatinput.vue';
	import messageShow from '../../components/messageshow.vue';
	export default {
		data() {
			return {
				token:"",
				aid:"",
				style: {
					pageHeight: 0,
					contentViewHeight: 0,
					footViewHeight: 90,
					mitemHeight: 0,
				},
				scrollTop: 0,
				messages: [{
					user: 'home',
					type: 'head', //input,content 
					content: '你好!'
				}]
			}
		},
		components: {
			chatInput,
			messageShow
		},
		
		created: function() {
			const res = uni.getSystemInfoSync();
			this.style.pageHeight = res.windowHeight;
			this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100); //像素
		},
		methods: {
			getInputMessage: function(message) { //获取子组件的输入数据
				//往界面添加一行自己的消息
				this.addMessage(message.id, message.content, false);
				//把自己的消息发送到服务端
				this.sendMessage(message.content);
			},
			addMessage: function(user, content, hasSub, subcontent) {
				var that = this;
				that.messages.push({
					user: user,
					content: content,
					hasSub: hasSub,
					subcontent: subcontent
				});
			},
			// sendMessage: function(info) {
			// 	var that = this;
			// 	uni.request({
			// 		url: 'http://192.168.0.109:8111/Mes/mess',
			// 		data: {
			// 			uid: 1,
			// 			message: info
			// 		},
			// 		success: (res) => {
			// 			that.scrollToBottom();
			// 		}
			// 	});
			// },
			// sendMessage: function(info) {
			// 	var that = this;
			// 	uni.request({
			// 		url: 'http://192.168.0.109:8111/Mes/save',
			// 		data: {
			// 			token: that.token,
			// 			accid: thar.aid,
			// 			content:info,
			// 		},
			// 		success: (res) => {
			// 			that.scrollToBottom();
			// 		}
			// 	});
			// },
			scrollToBottom: function() {
				var that = this;
				var query = uni.createSelectorQuery();
				query.selectAll('.m-item').boundingClientRect();
				query.select('#scrollview').boundingClientRect();
				query.exec(function(res) {
					that.style.mitemHeight = 0;
					res[0].forEach(function(rect) {
						that.style.mitemHeight = that.style.mitemHeight + rect.height + 20;
					});

					if (that.style.mitemHeight > that.style.contentViewHeight) {
						that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight;
					}
				});
			},
		}
	}
</script>
<template>
	<view class="uni-column">
		<view class="content" id="content" :style="{height:style.contentViewHeight+'px'}">
			<scroll-view id="scrollview" scroll-y="true" :style="{height:style.contentViewHeight+'px'}" :scroll-with-animation="true"
			 :scroll-top="scrollTop">
				<message-show v-for="(message,index) in messages" :key="index" v-bind:message="message" :id="index"></message-show>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<view class="foot">
			<chat-input @send-message="getInputMessage"></chat-input>
		</view>
	</view>
</template>

<style>
	.uni-column {
		display: flex;
		flex-direction: column;
	}

	.content {

		display: flex;
		flex: 1;
		margin-bottom: 100px;

	}

	.foot {
		position: fixed;
		width: 100%;
		height: 90px;
		min-height: 90px;
		left: 0px;
		bottom: 0px;
		overflow: hidden;
	}
</style>

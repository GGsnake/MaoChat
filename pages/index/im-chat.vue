<template>
	<view class="uni-column">
		<view class="content" id="content" :style="{height:style.contentViewHeight+'px'}">
			<scroll-view id="scrollview" scroll-y="true" :style="{height:style.contentViewHeight+'px'}" :scroll-with-animation="true"
			 :scroll-top="scrollTop">
				<page-foot :name="name"></page-foot>
				<message-show v-for="(message,index) in messages" :key="index" :message="message" :cid="index"></message-show>
				<view id="bottom"></view>
			</scroll-view>
		</view>
		<view class="foot">
			<chat-input @send-message="getInputMessage" @focus="inputGetFocus"></chat-input>
		</view>
	</view>
</template>

<script>
	import chatInput from '../../components/chatinput.vue';
	import messageShow from '../../components/messageshow.vue';

	export default {
		data() {
			return {
				name: 'xcecd@qq.com',
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
		onLoad: function(option) {
			const res = uni.getSystemInfoSync();
			this.style.pageHeight = res.windowHeight;
			this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100); //像素
			var that = this;
			let token = uni.getStorageSync('token');
			if (token) {
				that.token = token;
				
				that.aid = option.uid;
			} else {
				uni.navigateTo({
					url: '../login/login/login',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			// uni.connectSocket({
			// 	// url: 'ws://192.168.0.109:8111/websocket', //仅为示例，并非真实接口地址。
			// });
			uni.onSocketOpen(function(res) {});
			uni.onSocketMessage(function(res) {
				// console.log('欢迎你用户id发出：' + res.data);
				that.addMessage('home', res.data, false);
				that.scrollToBottom();
			});
		},
		methods: {
			getInputMessage: function(message) { //获取子组件的输入数据
				// console.log(message);
				this.addMessage('customer', message.content, false);
				this.sendMessage(message.content);
				// this.toRobot(message.content);
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
			sendMessage: function(info) {
				console.log(this.aid);
				// var tk = this.aid;
				// var aid = this.aid;
				var that = this;
				uni.request({
					url: 'http://192.168.0.109:8111/Mes/save',
					data: {
						token: that.token,
						accid: that.aid,
						content: info,
					},
					success: (res) => {
						that.scrollToBottom();
					}
				});
			},
			scrollToBottom: function() {
				var that = this;
				var query = uni.createSelectorQuery();
				query.selectAll('.m-item').boundingClientRect();
				query.select('#scrollview').boundingClientRect();

				query.exec(function(res) {
					that.style.mitemHeight = 0;
					res[0].forEach(function(rect) {
						// console.info(rect.height);
						that.style.mitemHeight = that.style.mitemHeight + rect.height + 20;
					});

					if (that.style.mitemHeight > that.style.contentViewHeight) {
						that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight;
					}
				});
			},
			toRobot: function(info) {
				// this.addMessage('home', info, false);
				var apiUrl = 'http://www.tuling123.com/openapi/api';
				uni.request({
					url: apiUrl,
					data: {
						"key": 'acfbca724ea1b5db96d2eef88ce677dc',
						"info": info,
						"userid": 'uni-test'
					},
					success: (res) => {
						console.log("s", res);
						this.addMessage('home', res.data.text, false);
						this.scrollToBottom();
						console.log('request success:' + res.data.text);
					},
					fail: (err) => {
						console.log('request fail', err);
						uni.showModal({
							content: err.errMsg,
							showCancel: false
						})
					}
				});
			}
		}
	}
</script>

<style>
	.uni-column {
		display: flex;
		flex-direction: column;
	}

	.content {

		display: flex;
		flex: 1;
		margin-bottom: 100upx;
	}

	.foot {
		position: fixed;
		width: 100%;
		height: 90upx;
		min-height: 90upx;
		left: 0upx;
		bottom: 0upx;
		overflow: hidden;
	}
</style>

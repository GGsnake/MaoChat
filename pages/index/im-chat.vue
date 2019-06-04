<template>
	<view class="uni-column">
		<view class="content" id="content" :style="{height:style.contentViewHeight+'px'}">
			<scroll-view id="scrollview" scroll-y="true" :style="{height:style.contentViewHeight+'px'}" :scroll-with-animation="true"
			 :scroll-top="scrollTop">
				<page-foot :name="name"></page-foot>
				<message-show v-for="(message,index) in messages" :key="index" :message="message" :cid="index" :bbd="aid" :fimg="img"
				 :myimg="user.userName"></message-show>
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
				user: {},
				key: "",
				scrollTop: 0,
				messages: []
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
			//判断是否已登录
			if (token) {
				let user = uni.getStorageSync('user');
				that.token = token;
				that.user = user;
				//对方的Id
				that.aid = option.uid;
				that.img = option.img;

				let uid = user.id;
				//聊天缓存KEY
				that.key = uid + 'chat:' + that.aid;
				//

				let chatData = uni.getStorageSync(that.key);
				if (chatData) {
					if (chatData.length != 0) {
						that.messages = chatData;
						//增量查询聊天记录
						that.loadHistory(chatData[chatData.length - 1].lastId);
					}
				} else {
					//本地无缓存全量加载聊天历史消息
					that.loadHistory(null);
				}
			} else {
				uni.navigateTo({
					url: '../login/login/login',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
			//开启socket
			uni.connectSocket({
				url: that.wss + '/websocket/' + that.token, //仅为示例，并非真实接口地址。
			});
			uni.onSocketOpen(function(res) {});
			uni.onSocketMessage(function(res) {
				//接受服务端回传消息
				let use = JSON.parse(res.data);
				let dev = "home";
				if (that.user.id == use.sid) {
					dev = "customer"
				}
				that.messages.push({
					user: dev,
					content: use.content,
					hasSub: false,
					subcontent: 'ccc',
					aid: use.accid,
					sid: use.sid
				});
				this.scrollToBottom();
			});
		},
		methods: {
			//加载离线消息
			loadHistory: function(sendtime) {
				let that = this;
				uni.request({
					url: that.base + '/Mes/history',
					data: {
						token: that.token,
						uid: that.aid,
						sendtime: sendtime
					},
					success: (res) => {
						let chatData = res.data.data;
						chatData.forEach(function(mes) {
							let dev = "home";
							if (that.user.id == mes.sid) {
								dev = "customer";
							}
							that.messages.push({
								user: dev,
								lastId: mes.id,
								content: mes.content,
								hasSub: 0,
								subcontent: mes.content,
								aid: mes.accid,
								sid: mes.sid
							});
						});
						uni.setStorageSync(that.key, that.messages);
						that.scrollToBottom();
					}
				});
			},
			getInputMessage: function(message) { //获取子组件的输入数据
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
					subcontent: subcontent,
					aid: that.aid,
					sid: that.user.id
				});
			},
			loadChat: function(info) {
				var that = this;
				uni.request({
					url: that.base + '/Mes/save',
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

			sendMessage: function(info) {
				var that = this;
				uni.request({
					url: that.base + '/Mes/save',
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

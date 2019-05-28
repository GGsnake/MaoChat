<template>
	<view style="padding-top: 40upx;">
		<view class="inputArea">
			<input v-model="loginPhone" placeholder="请输入手机" type="number" maxlength="11" class="inputClass" />
		</view>
		<view class="inputArea">
			<input v-model="loginPassword" placeholder="请输入登录密码" type="password" class="inputClass" />
		</view>
		<view style="padding: 0 10%;">
			<text style="color: red;">{{message}}</text>
		</view>
		<view class="inputArea">
			<button style="border-radius:22px;" type="primary" @click="goLogin">登 录</button>
		</view>
		<view class="inputArea">
			<text style="float:right;color:blue;" @click="openRegisterPage">>>注册>></text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginPhone: '',
				loginPassword: '',
				message: ''
			}
		},
		onLoad() {
			let token = uni.getStorageSync('token');
			if (token) {
				uni.showLoading({
					title: '有缓存。。。',
					mask: false
				});
				uni.reLaunch({
					url: '../../index/list'
				});
			}
			
		},
		methods: {
			openRegisterPage() {
				uni.navigateTo({
					url: '../login/register',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			goLogin() {
				let loginPhone = this.loginPhone;
				let loginPassword = this.loginPassword;
				console.log(loginPhone);
				// if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(loginPhone))) {
				// 	this.message = "手机号码有误，请重填";
				// 	return false;
				// }
				// if (!loginPassword) {
				// 	this.message = "密码为空";
				// 	return false;
				// }
				uni.showLoading({
					title: '登录中。。。',
					mask: false
				});
				let token = uni.getStorageSync('token');
				if (token) {
					uni.showLoading({
						title: '有缓存。。。',
						mask: false
					});
				}
				uni.request({
					url: 'http://192.168.0.109:8111/user/login?uid=' + loginPhone, //此处使用了全局变量拼接url（main.js文件中），关于全局变量官方问答里有
					method: 'GET', //get或post
					// header: {
						// 'token':
					// },
					success: res => {
						let data = res.data;
						if (data.success === true) {
							uni.showLoading({
								title: '登录成功',
								mask: false
							});
							uni.setStorageSync('token', data.data);
							uni.hideLoading();
							uni.reLaunch({
								url: '../../index/index'
							});
						} else {
							// uni.removeStorageSync('userinfo');
							this.message = data.error;
							uni.hideLoading();
						}
					},
					fail: () => {
						uni.hideLoading();
						this.message = "网络连接失败";
					},
					complete: () => {}
				});
			}
		}
	}
</script>

<style>
	.inputArea {
		padding: 20upx 10%;
	}

	.inputClass {
		border: 2px solid #ccc;
		border-radius: 22px;
		outline: 0;
		padding: 8px 15px;
	}
</style>

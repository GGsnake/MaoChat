<template>
	<view style="padding-top: 40upx;">
		<view class="inputArea">
			<input v-model="loginPhone" placeholder="请输入用户名" type="number" maxlength="11" class="inputClass" />
		</view>
		<view class="inputArea">
			<input v-model="loginPassword" placeholder="请输入密码" type="password" class="inputClass" />
		</view>
		<view style="padding: 0 10%;">
			<text style="color: red;">{{message}}</text>
		</view>
		<view class="inputArea">
			<button style="border-radius:22px;" type="primary" @click="goLogin">登 录</button>
		</view>
		<view class="inputArea">
			<text style="float:right;color:blue;">暂未开放注册</text>
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
			let token = uni.getStorageSync('user');
			if (token) {
				// uni.showLoading({
				// 	title: '存着',
				// 	mask: false
				// });
				uni.navigateTo({
					url: '../../index/list',
					success: res => {},
					fail: () => {},
					complete: () => {}
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
				// if (!(/^1(3|4|5|7|8|9)\d{9}$/.test(loginPhone))) {
				// 	this.message = "手机号码有误，请重填";
				// 	return false;
				// }
				let that = this;
				let loginPhone = this.loginPhone;
				let loginPassword = this.loginPassword;
				// if (!loginPassword) {
				// 	this.message = "密码为空";
				// 	return false;
				// }
				uni.showLoading({
					title: '登录中',
					mask: false
				});
				uni.request({
					url: that.base + '/user/login',
					method: 'POST',
					data: {
						phone: loginPhone,
						password: loginPassword
					},
					success: res => {
						let data = res.data;
						if (data.success === true) {
							uni.showLoading({
								title: '登录成功',
								mask: false
							});
							uni.setStorageSync('user', data.data.user);
							uni.setStorageSync('token', data.data.token);
							uni.hideLoading();
							uni.reLaunch({
								url: '../../index/list'
							});
						} else {
							uni.hideLoading();
							uni.showToast({
								title: data.error.errMsg,
								duration: 1111
							});
						}
					},
					fail: (res) => {
						
						uni.hideLoading();
						
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

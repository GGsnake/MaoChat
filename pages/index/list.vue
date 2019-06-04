<template>
	<view>
		<scroll-view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
			<cu-custom bgColor="bg-gradual-pink" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">列表</block>
			</cu-custom>
				<view class="cu-bar bg-white solid-bottom margin-top" @click="exit()">
				<view class="action">
					<text class="cuIcon-title text-orange "></text> 退出帐号
				</view>
			</view>
			<view class="cu-bar bg-white solid-bottom margin-top">
				<view class="action">
					<text class="cuIcon-title text-orange "></text> 好友列表
				</view>
			</view>
			<view class="cu-list menu-avatar">
				<view class="cu-item" v-for="(item, index) in users" :key="index" @click="detail(item)">
					<view class="cu-avatar round lg" :style="{backgroundImage: 'url('+item.userName+')'}"></view>
					<!-- <view class="cu-avatar round lg" :backgroundImage="'url('+item.userName+')'"></view> -->
					<!-- <view class="cu-avatar round lg" style="background-image:url(https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1558696906738&di=b34d17beb6f4ad13118831066c5343d5&imgtype=0&src=http%3A%2F%2Fcocoo.top%2Fdata%2Fattachment%2Fportal%2F201808%2F18%2F093952dvvir77qgyov2xvr.png);"></view> -->
					<view class="content">
						<view class="text-grey">{{item.name}}</view>
						<view class="text-gray text-sm flex">
							<text class="text-cut">
								<text class="cuIcon-infofill text-red  margin-right-xs"></text>
								{{item.signature}}
							</text> </view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">22:20</view>
						<view class="cu-tag round bg-grey sm">5</view>
					</view>
				</view>
			</view>
		
			<!-- <view class="cu-list menu-avatar">
				<view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" v-for="(item,index) in 4" :key="index"
				 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target="'move-box-' + index">
					<view class="cu-avatar round lg" :style="[{backgroundImage:'url(https://ossweb-img.qq.com/images/lol/web201310/skin/big2100'+ (index+2) +'.jpg)'}]"></view>
					<view class="content">
						<view class="text-grey">文晓港</view>
						<view class="text-gray text-sm">
							<text class="cuIcon-infofill text-red  margin-right-xs"></text> 消息未送达</view>
					</view>
					<view class="action">
						<view class="text-grey text-xs">22:20</view>
						<view class="cu-tag round bg-grey sm">5</view>
					</view>
					<view class="move">
						<view class="bg-grey">置顶</view>
						<view class="bg-red">删除</view>
					</view>
				</view>
			</view>
 -->
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: 'https://upload.jianshu.io/users/upload_avatars/6347713/dacc8e24-9379-48dc-80c5-5529b37b3ad0.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/96/h/96',
				iconList: [{
					icon: 'cardboardfill',
					color: 'red',
					badge: 120,
					name: 'VR'
				}, {
					icon: 'recordfill',
					color: 'orange',
					badge: 1,
					name: '录像'
				}, {
					icon: 'picfill',
					color: 'yellow',
					badge: 0,
					name: '图像'
				}, {
					icon: 'noticefill',
					color: 'olive',
					badge: 22,
					name: '通知'
				}, {
					icon: 'upstagefill',
					color: 'cyan',
					badge: 0,
					name: '排行榜'
				}, {
					icon: 'clothesfill',
					color: 'blue',
					badge: 0,
					name: '皮肤'
				}, {
					icon: 'discoverfill',
					color: 'purple',
					badge: 0,
					name: '发现'
				}, {
					icon: 'questionfill',
					color: 'mauve',
					badge: 0,
					name: '帮助'
				}, {
					icon: 'commandfill',
					color: 'purple',
					badge: 0,
					name: '问答'
				}, {
					icon: 'brandfill',
					color: 'mauve',
					badge: 0,
					name: '版权'
				}],
				modalName: null,
				gridCol: 3,
				gridBorder: false,
				menuBorder: false,
				menuArrow: false,
				menuCard: false,
				users: [],
				skin: false,
				listTouchStart: 0,
				listTouchDirection: null,
			};
		},
		onLoad() {
			console.log("gogogo");
			var that = this;
			uni.request({
				url: that.base+'/user/list',
				// header: JSON.stringify(),
				data: {
					token: uni.getStorageSync('token'),
				},
				dataType: 'json',
				success: (res) => {
					console.log(res.data);
					that.users = res.data.data;
				}
			});
		},
		methods: {
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			detail(e) {
				var img=encodeURIComponent(e.userName);
				uni.navigateTo({
					url: 'im-chat?uid=' + e.id+'&img='+img,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			exit() {
				uni.removeStorageSync('token');
				uni.navigateTo({
					url: '../login/login/login',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			getInfo(e) {
				var that = this;
				uni.request({
					// url: 'http://192.168.0.109:8111/user/list',
					url:that.base +'/user/list',
					// header: JSON.stringify(),
					header: {
						token: "sssssssssssssss"
					},
					data: {
						message: info
					},
					success: (res) => {
						that.scrollToBottom();
					}
				});
			},
			hideModal(e) {
				this.modalName = null
			},
			Gridchange(e) {
				this.gridCol = e.detail.value
			},
			Gridswitch(e) {
				this.gridBorder = e.detail.value
			},
			MenuBorder(e) {
				this.menuBorder = e.detail.value
			},
			MenuArrow(e) {
				this.menuArrow = e.detail.value
			},
			MenuCard(e) {
				this.menuCard = e.detail.value
			},
			SwitchSex(e) {
				this.skin = e.detail.value
			},

			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},

			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},

			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			}
		}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}

	.switch-sex::after {
		content: "\e716";
	}

	.switch-sex::before {
		content: "\e7a9";
	}

	.switch-music::after {
		content: "\e66a";
	}

	.switch-music::before {
		content: "\e6db";
	}
</style>

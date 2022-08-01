<template>
	<div>
		<el-dialog
			:visible="visible"
			width="790px"
			custom-class="nft-dialog"
			:title="$t('lang.chooseCamp')"
			:center="true"
			@close="closeDialog"
		>
			<div class="nft-dialog-body">
				<div class="subtitle">
					{{$t('lang.ticketPrice')}}:
				</div>
				<div class="nft-nums">
					<img src="@/assets/img/nft.svg" class="nft-icon" />
					<span class="num">{{Price}}</span>
				</div>
				<div class="choose-container">
					<div class="choose-item item-smile" @click="activeSmile" :class="{'active': isSmile}"></div>
					<div class="choose-or">
						{{$t('lang.or')}}
					</div>
					<div class="choose-item item-angry" @click="activeAngry" :class="{'active':isAngry}"></div>
				</div>
				<div class="choose-actions">
					<el-button class="nft-btn" @click="submit" :disabled="disabled">{{$t('lang.Confirm')}}</el-button>
				</div>
			</div>
			<weberr :show="weberr" :closeable="true"></weberr>
		</el-dialog>
		<complete-dialog ref="CompleteDialog" @reload="reload"></complete-dialog>
	</div>
</template>

<script>
	import ad from "../../../utils/web3Helper";
	import CompleteDialog from '../../modules/completeDialog.vue';
	import Weberr from '../../modules/weberr.vue';
	export default {
		name: 'campDialog',
		data() {
			return {
				visible:false,
				typa: 0,
				isSmile:false,
				isAngry:false,
				TokenID: '',
				Price: "0.1",
				weberr:false,
			}
		},
		components: {
			CompleteDialog,
			Weberr,
		},
		mounted() {},
		computed:{
			disabled:function(){
				if (this.isAngry || this.isSmile) {
					return false;
				}else{
					return true;
				}
			}
		},
		methods: {
			activeSmile() {
				if(this.isSmile == false){
					this.isSmile = true;
					this.isAngry = false;
					this.typa = 1;
				}else {
					this.isSmile = false;
				}
			},
			activeAngry(){
				if(this.isAngry == false){
					this.isAngry = true;
					this.isSmile = false;
					this.typa = 2;
				}else{
					this.isAngry = false;
				}
			},
			submit(){
				this.weberr = true;
				var that = this;
				ad.vote(this.TokenID,this.Price,this.typa,function(hash){
					console.log("vote.success hash",hash);
					that.weberr = false;
					that.$refs.CompleteDialog.type = that.typa;
					that.$refs.CompleteDialog.openDialog(hash);
					that.closeDialog();
				},function(reson){
					console.log("vote.err",reson);
					var data = {
						"title":that.$t("lang.votingFailed"),
						"desc":that.$t("lang.failedDesc")
					}
					that.weberr = false;
					that.$emit('fail',data);
				});
			},
			reload(data){
				this.$emit('reload',data);
			},
			openDialog(){
				this.visible = true;
			},
			closeDialog(){
				this.visible = false;
			},

		},
	}
</script>

<style lang="less" scoped>
/deep/.nft-dialog {
	border-radius:40px;
	.el-dialog__header {
		padding:30px 30px 15px;
		.el-dialog__title {
			font-size:36px; font-weight:800; line-height:50px;
		}
		.el-dialog__headerbtn {
			width:48px; height:48px;
			.el-dialog__close {
				background:url("~@/assets/img/close.svg") no-repeat center center/cover; width:48px; height:48px; transition: all .5s; cursor:pointer;
				&:before {
					content:""
				}
				&:hover {transform:rotate(180deg);}
			}
		}
	}
	.el-dialog__body {padding:10px 40px 40px;}

	.nft-dialog-body {
		.subtitle {text-align:center; font-weight:800; font-size:18px; line-height:25px;}
		.desc {text-align:center;}
		.nft-nums {text-align:center; display:flex; justify-content: center; align-items:center;
			.num {font-size:48px; line-height:65px; font-weight:800; margin-left:15px;}
		}
		.choose-container {
			border:#979797 2px dashed; border-radius:28px; padding:50px 70px; display:flex; justify-content:space-between; align-items:center; margin:30px 50px;
			.choose-item {
				border:#DCDCDC 1px solid; border-radius:40px; width:152px; height:152px; background-repeat:no-repeat; background-position:center center; background-size:120px 120px; cursor:pointer; transition:all .1s;
				&.item-smile {
					background-image:url('~@/assets/img/icon-sm-gray.svg');
				}
				&.item-angry {
					background-image:url('~@/assets/img/icon-k-gray.svg');
				}
				&.item-smile:hover, &.active.item-smile {
					border:#000 4px solid; background-image:url('~@/assets/img/icon-sm.svg');
				}
				&.item-angry:hover, &.active.item-angry {
					border:#000 4px solid; background-image:url('~@/assets/img/icon-k.svg');
				}
			}
			.choose-or {border:#ABABAB 1px solid; border-radius:10em; padding:3px 10px;}
		}
		.choose-actions {
			padding:0 120px;
			.nft-btn {
				height:56px; border-radius:10em; text-align:center; background:#FFDDA9; color:#000; font-size:16px; line-height:26px; padding:15px 0; cursor:pointer; display:block; width:100%; box-sizing:border-box; border-color:#ffdDA9;
				&.is-disabled{
					opacity:.6; background:#FFDDA9; border-color:#ffdDA9; color:#999; cursor:not-allowed;
				}
			}
		}
		.endtime {
			display:flex; justify-content:center; align-items:center; padding:20px 0 15px; font-size:16px; font-weight:800;
			.timer {font-size:24px; margin-left:10px;}
		}
	}
}
</style>

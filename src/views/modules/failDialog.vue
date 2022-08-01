<template>
	<div>
		<el-dialog
			:visible="visible"
			width="620px"
			custom-class="nft-dialog"
			:title="null"
			:center="true"
			@close="closeDialog"
		>
			<div class="nft-dialog-body">
				<div class="circle-warning"></div>
				<div class="title">{{title}}</div>
				<div class="desc">{{descriptionText}}</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'failDialog',
		data() {
			return {
				visible:false,
				title: '',
				descriptionText:'',
				timer:null,
			}
		},
		created() {
		},
		methods: {
			openDialog(){
				this.visible = true;
				this.timer = setTimeout(this.closeDialog,3*1000);
			},
			closeDialog(){
				if (this.timer){
					clearTimeout(this.timer);
				}
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
	.el-dialog__body {padding:10px 40px 40px; }


	.nft-dialog-body {
		.circle-warning {
			background:url('~@/assets/img/circle_warning.png') no-repeat center center/cover; width:122px; height:122px; margin:0 auto 20px;
		}
		.title {font-weight:800; font-size:36px; line-height:44px;  padding:0 0 20px; text-align:center; text-transform:uppercase; color:#12022F;}
		.desc {text-align:center; color:#12022F; line-height:22px; font-size:18px; padding:0 0 20px;}
	}

}
/deep/.el-dialog__footer {
		padding:0px 50px 40px;
		.nft-dialog-footer {
			display:flex; justify-content: space-between;
		}
	}
.nft-btn {height:56px; border-radius:10em; text-align:center; background:#FFDDA9; color:#000; font-size:16px; line-height:26px; padding:15px 60px; cursor:pointer; display:inline-block; font-weight:800;
	&:hover {opacity:.6;}
	&.disabled, &.is-disabled, &.is-disabled:hover{opacity:.6; background:#FFDDA9; color:#999; border-color:#FFDDA9;}
}
.nft-btn-default {height:56px; border-radius:10em; border:#dcdcdc 1px solid; text-align:center; color:#000; font-size:16px; line-height:26px; padding:15px 55px; cursor:pointer; display:inline-block; font-weight:800;}
</style>

import ad from "@/utils/web3Helper";
import request from "@/services/request";
import {
    throttle
} from "@/utils/common.js";
let mixin = {
    methods: {
        sign() {
            let address = this.$store.getters.address;
            if (!address) {
                return
            }
            request.get_user({
                address
            }).then((res) => {
                if (res.code == 200) {
                    ad.Sign(
                        `Please sign in to REVONFT，verifying that you are the owner of this Ethereum address：${'\n'}${address}:${res.data.nonce}${'\n'}${'\n'}This request will not trigger a blockchain transaction or cost any gas fees.${'\n'}${'\n'}Your authentication status will reset after 24 hours.${'\n'}${'\n'}${'['}${res.data.sign_time}${']'}`,
                        res.data.address,
                        (success) => {
                            request
                                .metamask_login({
                                    address,
                                    sig_hex: success,
                                })
                                .then((metamask) => {
                                    sessionStorage.setItem("Token", metamask.data.token);
                                    sessionStorage.setItem("iSsignature", true);
                                    sessionStorage.setItem("TimeOut",new Date().getTime());
                                    location.reload()
                                });
                        },
                        (err) => {}
                    );
                }
            });
        },
        getSign() {
            // 引入防抖函数 防止多次签名
            throttle(this.sign, 3000, true)
        },
    }
}
export default mixin;
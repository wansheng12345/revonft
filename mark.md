## VUE 笔记
1. 刷新组件方法
    -1.1 更改v-if的值 false true
    <component v-if="Refresh"></component>
    -1.2 使用内置$fourceupdate方法
    this.$fourceupdate()
    -1.3 绑定key值，改变key值
2. keep-alive 
    vue自带组件，缓存组件状态。提升性能
    include => 字符串、数组或正则。只有名称匹配的组件会被缓存
    exclude => 字符串、数组或正则。任何名称匹配的组件都不会被缓存
    exclude优先于include，
    配合路由使用
    ## router.js
    meta:{
        keepAlive:true, // 需要被缓存
    }
    ## 组件内
    <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    ## 不缓存的一定要再写一遍，不然页面不会加载
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    生命周期
    初次进入时：created > mounted > activated；退出后触发 deactivated
    第二次进入时：activated；
    # CommonJS
    exports和module.exports本来指向的是同一个引用地址，真正导入的是module.exports，exports={} ，会报错，只能改属性
    require的引入存在缓存，多次引入，只会执行一次
    CommonJS 加载是同步的，在node中因为文件都是本地的，但浏览器文件都是服务器上的，webpack中使用是进行了打包处理
    CommonJS是对模块的浅拷贝，esmodule是对模块的引用
## React 笔记
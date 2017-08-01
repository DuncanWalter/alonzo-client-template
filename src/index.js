import Vue from 'vue'
import { } from './components/app.js'
import { inject } from './utils/plugins.js'

// Expose the global style glob for independent consumption
export { default as styles } from './index.styl'
export { plugin } from './utils/plugins.js'

// HMR friendly bootstrapping for the modern era
(function bootstrap(el){
    inject({
        'alonzo-client-template': module.exports
    });
    if(Vue.component('az-root') === undefined){
        console.log('> Bootstrapping app!');
        Vue.component('az-root', {
            render(){
                return ( <az-app/> );
            },
        });
        var vm = new Vue({ 
            el: el,
            render(){
                return( <az-root/> );
            },
        });
        (window||{}).__bootstrap__ = {
            update: vm.$forceUpdate.bind(vm),
            id: module.id,
        };
    } else {
        if(((window||{}).__bootstrap__||{}).id === module.id){ window.__bootstrap__.update(); }
    }
})(document.getElementById('anchor'));

if(module.hot){ 
    // enables HMR // $FlowFixMe
    module.hot.accept(); 
    // console.log(module); 
}


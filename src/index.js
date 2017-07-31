import Vue from 'vue'
import App from './components/App.js'

// enables HMR
if(module.hot){ module.hot.accept(); }

// HMR friendly bootstrapping for the modern era
(function bootstrap(el, render){
    if(Vue.component('az-root') === undefined){
        console.log('> Bootstrapping app!');
        // (window||{}).__bootstrap__ = { hash: 0 };
        Vue.component('az-root', {
            // data: ()=>(window||{}).__bootstrap_data__,
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
        (window||{}).__vm__ = vm; 
    } else {
        if((window||{}).__vm__){ window.__vm__.$forceUpdate(); }
    }
})(document.getElementById('anchor'));


// The beginnings of a universal plugin library
const modules = {};

export function plugin(name: string){

    if(modules[name] === undefined){

        let window = undefined;
        let document = undefined;
        let process =undefined;
        let require = undefined;
        let exports = undefined;
        let xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = () => { 
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
                (str => {
                    (new Function(str)).call(modules);
                })(xmlHttp.responseText);
            }
            xmlHttp.open('GET', `localhost:3674/plugin/@{name}`, true); // true for asynchronous 
            xmlHttp.send(null);
        }
    }
};


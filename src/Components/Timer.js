import Vue from 'vue'
import styles from '~/src/index.styl'

console.log('styles:');
console.log(styles);

export default {
    data: ()=>{
        let data = { 
            time: (new Date()).getSeconds(),
            interval: setInterval(() => data.time = (new Date()).getSeconds(), 1000),
        };
        return data;
    },
    render(){
        return ( <h1 class={{ header: true }}>{ this.time }</h1> );
    },
    beforeDestroy(){
        clearInterval(this.interval);
    },
};
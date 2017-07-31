import Vue from 'vue'

export default Vue.component('az-timer', {
    data: ()=>{
        let data = { 
            time: (new Date()).getTime(),
            interval: setInterval(() => data.time = (new Date()).getSeconds(), 1000),
        };
        return data;
    },
    render(){
        return ( <h1>{ this.time }</h1> );
    },
    beforeDestroy(){
        clearInterval(this.interval);
    },
});
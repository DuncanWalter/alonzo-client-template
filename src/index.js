import Vue from 'vue'

export function bootstrap(el){
    return new Vue({ 
        el: el,
        render(){
            return(
                <h1>TESTING NEW HEAT</h1>
            )
        },
    });
};

bootstrap(document.getElementById('anchor'));


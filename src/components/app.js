// import vl from '~/static/vue.png'
// import wp from '~/static/webpack.svg'
// import st from '~/static/stylus.svg' 
// import el from '~/static/eslint.svg'

import { view } from '~/src/services/store'
import comment from './counter'


// app.js defines the root vue component of a web application.
// the default export is a vue settings object.
export default {
    components: {
        comment
    },
    render(){
        return <div class='container centered col'>
            <div class='card' style={{'min-width':'70%'}}>
                <div class='hollow'>
                    <comment sil={ view }/>
                </div>
            </div>
        </div>

            //         {/* <div class='centered hollow'><h1>HELLO TEMPLATE</h1></div>
            //         <div class='centered focus'/>
            //         <div class='content row'>
            //             {[false, wp, vl, st, el, false].map(img => {
            //                 return img ? 
            //                 <div class='f2'><img src={ img } style={{width:'150px', height: '150px'}}/></div> :
            //                 <div class='f1'></div>;
            //             })}
            //         </div>
            //         <div class='centered focus'/>
            //         <div class='hollow'/> */}
        
    },
};
// import vl from '~/static/vue.png'
// import wp from '~/static/webpack.svg'
// import st from '~/static/stylus.svg' 
// import el from '~/static/eslint.svg'

import { view } from '~/src/services/store'
import comment from './comment'

view.define({
    text: 'This is a root level comment',
    score: 0,
    editing: false,
});

// app.js defines the root vue component of a web application.
// the default export is a vue settings object.
export default {
    components: {
        comment
    },
    render(){
        return <div class='container centered col'>
            <div class='card' style={{'min-width':'70%'}}>
                <div class='header'>
                    <p>This is a quick 'n dirty demonstration of state management using silhouette, a utility library for and slight alteration of the state atom (DFA) pattern. Check the dev console and open redux devtools to see some of the inner working of the machine.</p>
                </div>
                <div id="kat"></div>
                <div class='hollow'>
                    <comment sil={ view }/>
                </div>
            </div>
        </div>
        katex.render("\\frac{numerator}{denominator}", kat);
    },
};



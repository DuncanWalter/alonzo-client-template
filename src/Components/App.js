import Timer from './timer.js'
import wp from '~/static/logo.png'

// app.js defines the root vue component of a web application.
// the default export is a vue settings object.
export default {
    props:['env' /* 'prod' | 'dev' */],
    components: {
        Timer: Timer
    },
    render(){
        return (
            <div>
                <Timer/>
                <img src={ wp }/>
            </div>
        );
    },
};
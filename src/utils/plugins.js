/*
Dynamically loading JS plugins is an operation rife with HMR and security challenges.
This module aims to tackle that problem so that it doesn't need to be reinvented all the time.
Hopefully this also allows for greater importing flexibility in the long run.
*/

window.__modules__ = window.__modules__ || { raw: {}, promised: {} };
var _modules = window.__modules__;

// plugin :: ([string]: module) -> void
export function inject(modules){
    Object.keys(modules).reduce((acc, key) => {
        acc.raw[key] = modules[key];
        acc.promised[key] = Promise.resolve(acc.raw[key]);
        return acc;
    }, _modules);
}

// plugin :: (string[]) -> void
export function plugin(...modules){
    modules.reduce((acc, mod)=>{
        if((_modules||{})[mod] !== undefined){
            acc[mod] = _modules[mod];
        } else {
            // sand-boxing for security TODO research proper form for the sandbox
            let window = undefined;
            let document = undefined;
            let process = undefined;
            let require = undefined;
            let exports = undefined;
            let req = new XMLHttpRequest();
            try{
                req.onreadystatechange = () => { 
                    console.log('just to be sure...');
                    console.log(this);
                    if (req.readyState === 4 && req.status === 200){
                        (str => {
                            (new Function(str)).call(_modules.raw);
                        })(req.responseText);
                    } else {
                        throw new Error(`> failed to load @{mod} plugin`);
                    }
                    req.open('GET', `localhost:3674/plugin/@{mod}`, true);
                    req.send(null);
                }
            } catch(err){
                console.error(err);
                throw new Error(`> failed to load @{mod} plugin`);
            }
        }
        return acc;
    }, {})
}
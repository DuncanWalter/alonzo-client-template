
window.__modules__ = window.__modules__ || { raw: {}, promised: {} }
var _modules: { raw: {[string]: any}, promised: {[string]: Promise<any>} } = window.__modules__;

export function inject(modules: {[string]: any}){
    Object.keys(modules).reduce((acc, key) => {
        acc.raw[key] = modules[key];
        acc.promised[key] = Promise.resolve(acc.raw[key]);
    }, _modules);
}

export function plugin(...modules: Array<string>){
    modules.reduce((acc: {[string]: any}, mod)=>{
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
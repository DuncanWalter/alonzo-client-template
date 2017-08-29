
// an example of how vue plugins might work with silhouette

let gen = (function*(){
    let i = 0;
    while(true){
        yield ++i;
    }
})();

let id = () => gen.next().value;

function bind(template, data, sil, that){
    Object.keys(template).forEach(key => {
        if(template[key] instanceof Function){
            sil.extend(key, template[key].bind(that));
        } else if(template[key] instanceof Object){
            data[key] = data[key] || {}; 
            bind(template[key], data[key], sil[key], that);
        } 
    });
    sil.asObservable().subscribe(val => {
        Object.keys(val).forEach(key => {
            if(data[key] !== val[key]){
                console.log('updating...', val[key]);
                data[key] = val[key];
            }
        });
    });
}

function augment(shape, template, component){
    let __shape__ = () => Object.assign({id: id()}, shape);
    component.props = component.props ? [...component.props, 'sil'] : ['sil'];
    let next = component.data || (() => {});
    component.data = function(...args){
        let data = next.call(this, ...args) || {};
        this.sil.define(__shape__());
        let b = { v: undefined };
        this.sil.asObservable().subscribe(v => b.v = v);
        bind(template, data, this.sil, b.v);
        return data;
    };
    return component;
}

export default augment({
    text: 'PLACEHOLDER TEXT',
    score: 0,
    collapsed: true,
    children: [],
}, {
    ['add comment'](s, a){ 
        if(this.id === a.id){
            return Object.assign({}, s, {children: [...s.children, {}]});
        } else {
            return s;
        }
    },
    ['remove comment'](s, a){
        let children = s.children.filter(s => s.id !== a.id);
        return children.length === s.children.length ? s : Object.assign({}, s, { children });
    },
    score: {
        ['up-vote'](s, a){
            return this.id === a.id ? s + 1 : s; 
        },
        ['down-vote'](s, a){ 
            return this.id === a.id ? s - 1 : s; 
        },
    }
}, {
    name: 'comment',
    render(){
        let sil = this.sil;
        if(!sil){console.log('NO SIL!!!', this)}
        let d = sil.dispatch.bind(sil);
        let i = { id: this.id };
        
        return <div style={{ margin: 5 }}>
            <div class='row'>
                { this.id }
                <div class='f1'></div>
            </div>
            <div class='row'>
                <div class='button clear' onClick={() => d('up-vote', i)}>/\</div>
                <div class='button clear'>{ this.score }</div>
                <div class='button clear' onClick={() => d('down-vote', i)}>\/</div>
                <div class='button clear' onClick={() => d('add comment', i)}>reply</div>
                <div class='button clear' onClick={() => d('remove comment', i)}>X</div>
                <div class='f1'></div>
            </div>
            <div class='row'>
                <div style={{ width: 37 }}>
                    <div style={{ background: '#fafafa', width: 6 }}/>
                </div>
                <div class='col'>
                    {this.children.map((c, i) => <comment sil={sil.children[i]} />)}
                </div>
                <div class='f1'></div>
            </div>
        </div>
    }
});



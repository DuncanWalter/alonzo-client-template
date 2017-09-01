
// an example of how vue plugins might work with silhouette.
// The code enclosed in these comments would be invisible.
///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

let gen = (function*(){
    let i = 0;
    while (true) {
        yield ++i;
    }
})();

let id = () => gen.next().value;

function bind(behavior, data, sil) {
    Object.keys(behavior).forEach(key => {
        if (behavior[key] instanceof Function) {
            sil.extend(key, behavior[key]);
        } else if (behavior[key] instanceof Object) {
            bind(behavior[key], data[key], sil[key]);
        }
    });
}

function augment(component) {
    let { shape, behavior, data, render } = component;

    component.props = component.props ? [...component.props, 'sil'] : ['sil'];

    component.data = function(...args){
        let __data__ = (data || (() => {return {};})).call(this, ...args);
        if(shape instanceof Object){
            shape.id = id();
            Object.keys(shape).forEach(key => {
                if (__data__[key] === undefined) {
                    __data__[key] = shape[key];
                }
            });
        } else {
            this.id = this.id || id();
        }
        this.sil.define(shape);
        return __data__;
    };

    component.render = function(...args){
        this.sil.asObservable().subscribe(val => {
            if (val instanceof Object) {
                Object.keys(val).forEach(key => {
                    if (this._data[key] !== val[key]) {
                        this._data[key] = val[key];
                    }
                });
            }
        });
        bind(behavior(this.id), this._data, this.sil);
        return render.call(this, ...args);
    };
    return component;
}

///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


let inputField = augment({
    shape: '',
    behavior(id){
        return {
            ['text-entry'](s, a) {
                return id === a.id ? a.text : s;
            }
        };
    },
    render(){
        let temp = undefined;
        this.sil.asObservable().subscribe(t => temp = t);
        return <textarea value={temp} autofocus onInput={ event => {
            this.sil.dispatch('text-entry', { id: this.id, text: event.target.value });
        } } />;
    },
});

console.log('INPUT FIELD', inputField);

export default augment({
    name: 'comment',
    components: {
        'input-field': inputField
    },
    shape: {
        text: '',
        score: 0,
        collapsed: false,
        children: [],
        editing: true,
    },
    behavior(id){
        return {
            ['add comment'](s, a) {
                if (id === a.id) {
                    return Object.assign({}, s, { children: [...s.children, {}] });
                } else {
                    return s;
                }
            },
            ['remove comment'](s, a) {
                let children = s.children.filter(s => s.id !== a.id);
                return children.length === s.children.length ? s : Object.assign({}, s, { children });
            },
            score: {
                ['up-vote'](s, a) {
                    return id === a.id ? s + 1 : s;
                },
                ['down-vote'](s, a) {
                    return id === a.id ? s - 1 : s;
                }
            },
            editing: {
                ['set editing'](s, a) {
                    return id === a.id ? a.editing || !s : s;
                }
            }
        };
    },
    render(){
        let sil = this.sil;
        let d = sil.dispatch.bind(sil);
        let i = { id: this.id };

        return <div style={{ margin: 5 }}>
            <div class='row'>
                { this.editing ? <input-field sil={ sil.text } id={ this.id }/> : this.text }
                <div class='f1'></div>
            </div>
            <div class='row'>
                { this.editing ? [] : [
                    <div class='button clear' onClick={() => d('down-vote', i)}><i class='fa fa-chevron-left'/></div>,
                    <div class='button clear'>{ this.score }</div>,
                    <div class='button clear' onClick={() => d('up-vote', i)}><i class='fa fa-chevron-right'/></div>,
                    <div class='button clear' onClick={() => d('add comment', i)}><i class='fa fa-reply'/></div>,
                ]}
                <div class='button clear' onClick={() => d('remove comment', i)}><i class='fa fa-remove'/></div>
                <div class='button clear' onClick={() => d('set editing', i)}><i class={'fa fa-' + (this.editing ? 'save' : 'edit')}/></div>
                <div class='f1'></div>
            </div>
            <div class='row'>
                <div style={{ width: 37 }}>
                    <div style={{ background: '#fafafa', width: 6 }}/>
                </div>
                <div class='col'>
                    { this.children.map((c, i) => <comment sil={ sil.children[i] } /> ) }
                </div>
                <div class='f1'></div>
            </div>
        </div>
    },
});

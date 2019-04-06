import Vue from 'vue';

import alertBoxVue from './alert';

const AlertBoxeConstructor = Vue.extend(alertBoxVue);


let instance;

let initInstance=()=>{
    instance =new AlertBoxeConstructor({
        el:document.createElement('div')
    });
    document.body.append(instance.$el);
}

let alert = function(title){
    if(!instance){
        initInstance();
    }
    instance.preappendShow(title);
}


Vue.alert = Vue.prototype.$alert = alert;

export default alert;
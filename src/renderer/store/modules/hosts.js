import db from '../../../datastore';

console.log(db.get("hosts").value())

const state = {
  hosts: db.get("hosts").value()
}

console.log(state.hosts);

const mutations = {
  removeHost(state, payload) {
    console.log(`payload=${payload}`)
    let index = state.hosts.findIndex((d) => d.label === payload);
    console.log(`payload=${payload},index=${index}`)
    state.hosts.splice(index, 1);
    db.get('hosts').remove({
      label: payload
    }).write();
    return 1;
  },
  addHost(state, payload) {
    state.hosts.push(payload);
console.log(payload);
    db.get('hosts').push(payload).write();

  }
}

const actions = {
  // payload 连接名称
  removeHost(context, payload) {
    console.log('开始提交删除');
     //context提交
    return context.commit('removeHost', payload);
  },
  addHost(context, payload) {
    context.commit('addHost', payload);
  }
}

export default {
  state,
  mutations,
  actions
}
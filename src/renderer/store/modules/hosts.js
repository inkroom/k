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
    return new Promise(function (resolve, reject) {
      // if (/* 异步操作成功 */){
      resolve(value);
      // } else {
      //   reject(error);
      // }
    });
  },
  addHost(state, payload) {


  }
}

const actions = {
  // payload 连接名称
  removeHost(context, payload) {
    let index = state.hosts.findIndex((d) => d.label === payload);
    if (index === -1) {
      return new Promise((resolve, reject) => {
        reject(1);
      });
    }
    else {
      state.hosts.splice(index, 1);
      db.get('hosts').remove({
        label: payload
      }).write();
      return new Promise((resolve, reject) => {
        resolve(index);
      });
    }
  },
  addHost(context, payload) {
    state.hosts.push(payload);
    db.get('hosts').push(payload).write();
    return new Promise((resolve, reject) => {
      resolve(1);
    });
  }
}

export default {
  state,
  mutations,
  actions
}
import db from '../../../datastore';

console.log(db.get("hosts").value())

const state = {
  hosts: db.get("hosts").value()
}

console.log(state.hosts);

const mutations = {
  removeHost(state, payload) {
    console.log(payload)
    let index = state.hosts.findIndex((d) => {
      console.log('-------')
      console.log(d);
      console.log(payload);
      return d.label === payload;
    });
    console.log(state.hosts);
    console.log(`删除index=${index}`);
    if (index === -1) {
      // return new Promise((resolve, reject) => {
      //   reject(index);
      // });
    } else {
      let temp = state.hosts.slice();
      temp.splice(index, 1);
      state.hosts = temp;
      // state.hosts.splice(index, 1);
      db.get('hosts').remove({
        label: payload
      }).write();
      // return new Promise((resolve, reject) => {
      //   resolve(index);
      // });
    }
  },
  addHost(state, payload) {
    console.log(payload);
    console.log(`vuex添加=${payload}`)
    try {
      db.get('hosts').push(payload).write();
      console.log('文件写入结束')
    } catch (e) {
      console.log('文件写入有问题')
      console.log(e);
    }
    try {
      console.log('开始写入vuex')
      state.hosts.push(Object.assign({}, payload));
      console.log('vuex写入结束')
    } catch (e) {
      console.log('vuex写入有问题')
      console.log(e);
    }

    // return new Promise((resolve, reject) => {
    //   resolve(1);
    // });
  }
}

const actions = {
  // payload 连接名称
  removeHost(context, payload) {
    console.log('action')
    return new Promise((resolve, reject) => {
      console.log('开始commit')
      context.commit('removeHost', payload);
      console.log('触发promise');
      resolve();
    });
  },
  addHost(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit('addHost', payload);
      resolve();
    });
  }
}

export default {
  state,
  mutations,
  actions
}
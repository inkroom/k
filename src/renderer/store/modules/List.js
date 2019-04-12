
import db from '../../../db';

const state = {
  list: db.get('musics').value()
  //  [{ name: "测试歌曲名", originName: "酷狗", time: "00:00", status: false, id: 1 }]
}

const mutations = {
  removeMusic(state, index) {
    state.list.splice(index, 1);
    db.get('musics').remove({ id: state.list[index].id }).write();
  },
  addMusics(state, musics) {
    musics.forEach(element => {
      state.list.push(element);
      db.get('musics').push(element).write();
    });
  },
  updateMusic(state, data) {
    console.log(data.music);
    state.list[data.index] = data.music;
    db.set(`musics[${data.index}]`,data.music).write();
  }
}

const getters = {
  list(state) {
    return state.list;
  }
}
const actions = {
  removeMusic({ commit, state }, music) {
    let index = state.list.findIndex(d => d.id == music.id);
    if (index != -1) {
      commit('removeMusic', index);
      return Promise.resolve(index);
    }
    return Promise.reject(music);
  },
  addMusics({ commit, state }, musics) {

    //加入数据

    commit('addMusics', musics);
  },
  updateMusic({commit}, data) {
    commit('updateMusic',data);
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}

import { createStore } from 'vuex';

const store = createStore({
  state: {
    user: null, // ou o objeto de usuário, se estiver autenticado
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  // Outras configurações do Vuex...
});

export default store;

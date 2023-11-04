<template>
  <div class="admin-signin">
    <h1>Área de Administração</h1>
    <button class="signin-button" @click="signInWithGoogle">Login com Google</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Importe os módulos de autenticação do Firebase
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    const signInWithGoogle = async () => {
      try {
        // Crie um provedor de autenticação do Google
        const provider = new GoogleAuthProvider();

        // Faça login com o Google usando a instância Firebase já inicializada
        const auth = getAuth();
        await signInWithPopup(auth, provider);

        store.dispatch('setUser', auth.currentUser);
        router.push('/');
      } catch (error) {
        console.error('Erro ao autenticar com o Google:', error);
      }
    };

    return {
      email,
      password,
      signInWithGoogle,
    };
  },
};
</script>


<style scoped>
.admin-signin {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.signin-button {
  background-color: #4285f4;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.signin-button:hover {
  background-color: #357ae8;
}
</style>

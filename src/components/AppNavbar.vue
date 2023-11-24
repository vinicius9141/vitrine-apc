<template>
  <nav class="navbar">
    <router-link to="/" class="navBarItem"> <i class="fa-solid fa-house" style="margin-right: 5px;"></i> Página Inicial</router-link>
    <router-link v-if="userIsAuthenticated" to="/cadastrar-loja" class="navBarItem"> <i class="fa-solid fa-plus" style="margin-right: 5px;"></i>Cadastrar Loja</router-link>
    <button @click="logout" v-if="userIsAuthenticated" class="navBarItemExit"> <i class="fa-solid fa-right-from-bracket" style="margin-right: 5px;"></i>Sair</button>
    <router-link v-else to="/admin-signin" class="navBarItem"><i class="fa-solid fa-lock" style="margin-right: 5px;"></i> Área adm</router-link>
  </nav>
</template>

<script>
import { ref } from 'vue';
import { signOut } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = getAuth();
    const userIsAuthenticated = ref(false);
    const router = useRouter();

    onAuthStateChanged(auth, (user) => {
      userIsAuthenticated.value = !!user;
    });

    const logout = async () => {
      try {
        await signOut(auth);
        router.push('/');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    };

    return {
      userIsAuthenticated,
      logout,
    };
  },
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  color: #fff;
  background-color: #333;
  color: #fff;
  height: 3rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

ul {
  list-style: none;
  display: flex;
  justify-content: space-around;
  padding: 0;
}

li {
  margin: 10px;
}

a {
  text-decoration: none;
  color: #fff;
}

button {
  background-color: #d9534f;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #c9302c;
}

a.navBarItem {
    font-size: 1.2rem;
    padding: 1rem;
    color: #FFF;
}
a.navBarItem:hover{
  color:#40b883;
}
</style>

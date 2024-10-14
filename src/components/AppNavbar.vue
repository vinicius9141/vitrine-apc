
<script>
import { ref } from 'vue';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = getAuth();
    const userIsAuthenticated = ref(false);
    const router = useRouter();

    // Verifica o estado de autenticação do usuário
    onAuthStateChanged(auth, (user) => {
      userIsAuthenticated.value = !!user; // Atualiza a variável com base na presença de um usuário
    });

    const logout = async () => {
      try {
        await signOut(auth); // Faz logout do Firebase
        router.push('/'); // Redireciona para a página inicial após logout
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
  height: 3rem;
  display: flex;
  align-items: center;
  gap: 2rem;
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

a.navBarItem:hover {
  color: #40b883;
}
</style>

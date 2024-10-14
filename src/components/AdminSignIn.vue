<template>
  <div class="app-container">
     <button @click="logout" class="logoff-button">Logoff</button>
    <div class="app-header">
      <h1>Administração de Estabelecimentos</h1>
    </div>
    <button class="add-button" @click="showAddEstablishmentModal">Adicionar Estabelecimento</button>
    
    <div class="notifications-container">
      <h3>Notificações</h3>
      <ul>
        <li v-for="(notification, index) in unresolvedNotifications" :key="index" class="notification-item">
          <p>{{ notification.message }}</p>
          <button @click="resolveNotification(index)" class="resolve-button">Resolvido</button>
        </li>
        <li v-if="unresolvedNotifications.length === 0">Nenhuma notificação pendente.</li> <!-- Mensagem quando não há notificações -->
      </ul>
    </div>

    <ul class="establishment-list">
      <li v-for="loja in lojas" :key="loja.id" class="establishment-item">
        <span>{{ loja.Nome }}</span>
        <div>
          <button class="edit-button" @click="editEstablishment(loja)">Editar</button>
          <button class="delete-button" @click="showDeleteConfirmation(loja)">Deletar</button>
        </div>
      </li>
    </ul>

    <!-- Modal para adicionar/editar estabelecimentos -->
    <div v-if="isModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Editar Estabelecimento' : 'Adicionar Estabelecimento' }}</h2>
        <input v-model="newEstabelecimento.Nome" class="modal-input" placeholder="Nome" />
        <input v-model="newEstabelecimento.Categoria" class="modal-input" placeholder="Categoria" />
        <input v-model="newEstabelecimento.Imagem" class="modal-input" placeholder="Imagem URL" />
        <input v-model="newEstabelecimento.InstagramLink" class="modal-input" placeholder="Link do Instagram" />
        <input type="date" v-model="newEstabelecimento.dataInicio" class="modal-input" />
        <select v-model="newEstabelecimento.Plano" @change="checkPlano()" class="modal-select">
          <option value="free">Free</option>
          <option value="Medium">Medium</option>
          <option value="Pro">Pro</option>
        </select>
        <div v-if="showEnderecoCardapio">
          <input v-model="newEstabelecimento.Endereco" class="modal-input" placeholder="Endereço" />
          <input v-model="newEstabelecimento.Cardapio" class="modal-input" placeholder="Cardápio" />
        </div>
        <div v-if="showComentarios">
          <textarea v-model="newEstabelecimento.Comentarios" class="modal-input" placeholder="Comentários"></textarea>
        </div>
        <div class="modal-actions">
          <button class="modal-button" @click="isEditing ? updateEstablishment() : saveEstablishment()">Salvar</button>
          <button class="modal-button" @click="closeModal()">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Confirmação de Deleção -->
    <div v-if="isDeleteConfirmationVisible" class="modal-overlay">
      <div class="modal-content">
        <h2>Confirmar Deleção</h2>
        <p>Você tem certeza que deseja deletar {{ lojaToDelete.Nome }}?</p>
        <div class="modal-actions">
          <button class="modal-button" @click="confirmDelete">Sim</button>
          <button class="modal-button" @click="closeDeleteConfirmation">Não</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, computed } from 'vue'; // Adicione 'computed' aqui
import { db } from '../firebase'; 
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { differenceInDays } from 'date-fns';
import { getAuth, signOut } from 'firebase/auth';

export default {
  setup() {
    const lojas = ref([]);
    const notifications = ref([]);
    const isModalVisible = ref(false);
    const isEditing = ref(false);
    const isDeleteConfirmationVisible = ref(false);
    const lojaToDelete = ref(null);
    const newEstabelecimento = ref({
      Nome: '',
      Categoria: '',
      Imagem: '',
      InstagramLink: '',
      dataInicio: '',
      Plano: 'free',
      Endereco: '',
      Cardapio: '',
      Comentarios: '',
    });
    const showEnderecoCardapio = ref(false);
    const showComentarios = ref(false);

    onMounted(async () => {
      await fetchLojas();
      checkVencimento();
      checkForNotifications();
    });

    const fetchLojas = async () => {
      try {
        const lojasRef = collection(db, 'lojas');
        const lojasSnapshot = await getDocs(lojasRef);
        lojas.value = lojasSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      } catch (error) {
        console.error('Erro ao buscar lojas:', error);
      }
    };

    const checkVencimento = () => {
      const today = new Date();
      lojas.value.forEach((estabelecimento) => {
        if (estabelecimento.Plano === 'Medium' || estabelecimento.Plano === 'Pro') {
          const dataInicio = new Date(estabelecimento.dataInicio);
          const diasPassados = differenceInDays(today, dataInicio);
          const diasRestantes = 30 - diasPassados;

          if (diasRestantes <= 5 && diasRestantes > 0) {
            notifications.value.push({
              message: `O estabelecimento ${estabelecimento.Nome} tem apenas ${diasRestantes} dias restantes para o vencimento.`,
              resolved: false,
            });
          } else if (diasRestantes <= 0) {
            // Rebaixar para plano Free
            estabelecimento.Plano = 'Free';
            notifications.value.push({
              message: `O plano do estabelecimento ${estabelecimento.Nome} foi rebaixado para Free.`,
              resolved: false,
            });
            updateEstablishment(estabelecimento);
          }
        }
      });
    };

    const checkForNotifications = () => {
      console.log('Notificações:', notifications.value); // Adicione esta linha para depurar
      if (notifications.value.length > 0) {
        console.log('Notificações não resolvidas:', unresolvedNotifications.value); // Debugging
      }
    };

    const resolveNotification = (index) => {
      if (notifications.value[index]) { // Verifique se a notificação existe
        notifications.value[index].resolved = true; // Marca a notificação como resolvida
      }
};

    // Computed property para notificações não resolvidas
    const unresolvedNotifications = computed(() => {
      return notifications.value ? notifications.value.filter(notification => !notification.resolved) : [];
    });

    const showAddEstablishmentModal = () => {
      isModalVisible.value = true;
      isEditing.value = false;
    };

    const editEstablishment = (estabelecimento) => {
      isModalVisible.value = true;
      isEditing.value = true;
      newEstabelecimento.value = estabelecimento;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    const checkPlano = () => {
      if (newEstabelecimento.value.Plano === 'Medium') {
        showEnderecoCardapio.value = true;
        showComentarios.value = false;
      } else if (newEstabelecimento.value.Plano === 'Pro') {
        showEnderecoCardapio.value = true;
        showComentarios.value = true;
      } else {
        showEnderecoCardapio.value = false;
        showComentarios.value = false;
      }
    };

    const saveEstablishment = async () => {
      const lojasRef = collection(db, 'lojas');
      const newEstablishment = await addDoc(lojasRef, newEstabelecimento.value);
      lojas.value.push({ ...newEstabelecimento.value, id: newEstablishment.id });
      closeModal();
    };

    const updateEstablishment = async (estabelecimento = newEstabelecimento.value) => {
      const lojasRef = doc(db, 'lojas', estabelecimento.id);
      await updateDoc(lojasRef, estabelecimento);
      const index = lojas.value.findIndex((e) => e.id === estabelecimento.id);
      if (index !== -1) {
        lojas.value[index] = estabelecimento;
      }
      closeModal();
    };

    const showDeleteConfirmation = (estabelecimento) => {
      isDeleteConfirmationVisible.value = true;
      lojaToDelete.value = estabelecimento;
    };

    const confirmDelete = async () => {
      const lojasRef = doc(db, 'lojas', lojaToDelete.value.id);
      await deleteDoc(lojasRef);
      lojas.value = lojas.value.filter((e) => e.id !== lojaToDelete.value.id);
      closeDeleteConfirmation();
    };

    const closeDeleteConfirmation = () => {
      isDeleteConfirmationVisible.value = false;
      lojaToDelete.value = null;
    };

        const logout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        console.log('Usuário deslogado com sucesso');
        // Redirecionar ou realizar qualquer ação necessária após o logoff
      } catch (error) {
        console.error('Erro ao fazer logoff:', error);
      }
    };

    return {
      lojas,
      isModalVisible,
      isEditing,
      newEstabelecimento,
      showEnderecoCardapio,
      showComentarios,
      unresolvedNotifications, // Adicione esta linha
      isDeleteConfirmationVisible,
      showAddEstablishmentModal,
      editEstablishment,
      closeModal,
      saveEstablishment,
      updateEstablishment,
      showDeleteConfirmation,
      confirmDelete,
      closeDeleteConfirmation,
      checkPlano,
      logout,
      resolveNotification,
    };
  },
};
</script>

<style>
.app-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header {
  background-color: #333;
  color: #fff;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.app-main {
  padding: 20px;
}

.establishment-management {
  margin-bottom: 20px;
}

.add-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
}

.establishment-list {
  list-style: none;
  padding: 0;
}

.establishment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.edit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 50%;
}

.modal-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.modal-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel {
  background-color: #ccc;
  color: #333;
}

.app-footer {
  background-color: #333;
  color: #fff;
  padding: 10px;
  border-top: 1px solid #ddd;
  text-align: center;
}
.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}


.notifications-container {
  background-color: #fff;
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.notifications-container h3 {
  margin-bottom: 15px;
}

.notification-item {
  background-color: #f1f1f1;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.notification-item p {
  margin: 0;
}

.notification-item small {
  color: #888;
}

.notifications-container {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #dee2e6;
}

.notification-item p {
  margin: 0;
}

.resolve-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;
}

.resolve-button:hover {
  background-color: #218838;
}

.logoff-button {
  background-color: #f44336; /* Cor vermelha */
  color: white; /* Texto branco */
  border: none; /* Sem borda */
  padding: 10px 20px; /* Espaçamento interno */
  border-radius: 5px; /* Bordas arredondadas */
  cursor: pointer; /* Cursor de mão */
}

.logoff-button:hover {
  background-color: #d32f2f; /* Cor mais escura ao passar o mouse */
}
</style>
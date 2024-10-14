<template>
  <div>
    <h2 class="store-list-title">Explore Nossos Roles</h2>

    <div class="category-filter-wrapper">
      <div class="search-filter">
        <label for="searchInput">Buscar Loja:</label>
        <div class="search-wrapper">
          <input id="searchInput" v-model="searchQuery" placeholder="Digite para buscar..." />
          <i class="fas fa-search"></i>
        </div>
      </div>

      <div class="categoryFilter">
        <label for="categorySelect">Filtrar por Categoria:</label>
        <select id="categorySelect" v-model="selectedCategory">
          <option value="">Todas</option>
          <option v-for="category in categories" :key="category">{{ category }}</option>
        </select>
      </div>
    </div>

    <ul class="store-list">
      <li v-for="loja in filteredLojas" :key="loja.id" class="store-item" @click="openModal(loja)">
        <img :src="loja.data().Imagem" alt="Imagem da Loja" class="store-image" />
        <h3 class="store-title">{{ loja.data().Nome }}</h3>
        <p class="store-detail">Categoria: {{ loja.data().Categoria }}</p>
        <p class="store-detail hg-rating">
          Avaliação Média: {{ calculateAverageRating(loja) }} estrelas
        </p>
        <span class="insta-title"><i class="fa-brands fa-instagram"></i> {{ loja.data().InstagramLink }}</span>
      </li>
    </ul>

    <!-- Modal da Loja -->
    <div v-if="isModalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ selectedLoja?.data().Nome }}</h2>
        <img :src="selectedLoja?.data().Imagem" alt="Imagem da Loja" class="modal-store-image" />
        <p>Categoria: {{ selectedLoja?.data().Categoria }}</p>
        <a :href="getInstagramLink(selectedLoja?.data().InstagramLink)" target="_blank">
          <span class="insta-title">
            <i class="fa-brands fa-instagram"></i> Visite o Instagram
          </span>
        </a>

        <!-- Exibir a avaliação média -->
        <p>Avaliação Média: {{ calculateAverageRating(selectedLoja) }} estrelas</p>

        <!-- Verifica se o plano não é Free -->
        <div v-if="!isFreePlan(selectedLoja)">
          <!-- Exibir comentários -->
          <div v-if="selectedLoja?.data().comments && selectedLoja.data().comments.length > 0">
            <h3>Comentários:</h3>
            <ul>
              <li v-for="(comment, index) in selectedLoja?.data().comments" :key="index">
                {{ comment }}
              </li>
            </ul>
          </div>

          <!-- Exibir cardápio -->
          <div v-if="selectedLoja?.data().Cardapio && selectedLoja.data().Cardapio.length > 0">
            <h3>Cardápio:</h3>
            <ul>
              <li v-for="item in selectedLoja?.data().Cardapio" :key="item.id">
                {{ item.nome }} - {{ item.preco }}
              </li>
            </ul>
          </div>
        </div>

        <button @click="openRatingModal" class="modal-rating-button">Avalie Também</button>
        <button @click="closeModal" class="modal-close-button">Fechar</button>
      </div>
    </div>

    <!-- Modal para avaliação -->
    <div v-if="isRatingModalVisible" class="modal-overlay" @click="closeRatingModal">
      <div class="modal-content" @click.stop>
        <h2>Avaliar {{ selectedLoja?.data().Nome }}</h2>
        <p>Selecione sua avaliação:</p>

        <div class="rating-control">
          <button @click="decreaseRating" class="rating-button">-</button>
          <star-rating
            :rating="userRating"
            :increment="0.5"
            :star-size="30"
            :read-only="false"
            class="star-rating"
            @rating-selected="setRating"
          />
          <button @click="increaseRating" class="rating-button">+</button>
        </div>

        <p>Sua Avaliação : {{ userRating }} estrelas</p>
        <textarea v-model="userComment" class="comment-box" placeholder="Deixe um comentário..."></textarea>
        <button @click="submitRating" class="modal-rating-button">Enviar Avaliação</button>
        <button @click="closeRatingModal" class="modal-close-button">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import StarRating from 'vue3-star-ratings';

export default {
  components: {
    StarRating,
  },
  data() {
    return {
      lojas: [],
      selectedCategory: '',
      searchQuery: '',
      selectedLoja: null,
      isModalVisible: false,
      isRatingModalVisible: false,
      userRating: 0,
      userComment: '',
    };
  },
  async created() {
    const db = getFirestore(this.$firebaseApp);
    const lojasCollection = collection(db, 'lojas');
    try {
      const querySnapshot = await getDocs(lojasCollection);
      querySnapshot.forEach((doc) => {
        this.lojas.push(doc);
      });
    } catch (error) {
      console.error('Erro ao obter as lojas:', error);
    }
  },
  computed: {
    categories() {
      const uniqueCategories = [...new Set(this.lojas.map((loja) => loja.data().Categoria))];
      return [''].concat(uniqueCategories);
    },
    filteredLojas() {
      return this.lojas.filter((loja) => {
        const matchesCategory = !this.selectedCategory || loja.data().Categoria === this.selectedCategory;
        const matchesSearch = !this.searchQuery || loja.data().Nome.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    },
  },
  methods: {
    getInstagramLink(username) {
      return `https://www.instagram.com/${username}`;
    },
    setRating(rating) {
      this.userRating = rating;
      console.log('Estrelas selecionadas:', this.userRating);
    },
    openModal(loja) {
      this.selectedLoja = loja;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.closeRatingModal();
    },
    openRatingModal() {
      this.isRatingModalVisible = true;
    },
    closeRatingModal() {
      this.isRatingModalVisible = false;
    },
    increaseRating() {
      if (this.userRating < 5) {
        this.userRating = Math.min(5, this.userRating + 0.5);
      }
    },
    decreaseRating() {
      if (this.userRating > 0) {
        this.userRating = Math.max(0, this.userRating - 0.5);
      }
    },
    async submitRating() {
      await this.saveRating(this.selectedLoja, this.userRating, this.userComment);
      this.userRating = 0;
      this.userComment = '';
      this.closeRatingModal();
    },
    async saveRating(loja, rating, comment) {
      const db = getFirestore(this.$firebaseApp);
      const lojaRef = doc(db, 'lojas', loja.id);
      const lojaData = (await getDoc(lojaRef)).data();

      if (!lojaData.ratings) {
        lojaData.ratings = [];
      }
      if (!lojaData.comments) {
        lojaData.comments = [];
      }

      lojaData.ratings.push(rating);
      lojaData.comments.push(comment);

      await updateDoc(lojaRef, lojaData);
    },
    isFreePlan(loja) {
      if (loja && loja.data) {
        const plano = loja.data().Plano;
        console.log('Plano:', plano);
        return plano == 'free';
      }
    },
    calculateAverageRating(loja) {
      const ratings = loja.data().ratings || [];
      const total = ratings.reduce((acc, rating) => acc + rating, 0);
      return ratings.length ? (total / ratings.length).toFixed(1) : 0;
    },
  },
};
</script>

<style scoped>
/* Estilos para os filtros de busca e categoria */
.category-filter-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  gap: 20px;
  font-size: 18px;
  background-color: #edf2f7;
  border-radius: 8px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-filter {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-filter input {
  padding-right: 40px;
  height: 40px;
  border: 2px solid #63b3ed;
  width: 20rem;
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.search-filter input:focus {
  box-shadow: 0 0 5px rgba(99, 179, 237, 0.5);
}

.search-filter i {
  position: absolute;
  right: 10px;
  color: #63b3ed;
  cursor: pointer;
}
#categorySelect {
  width: 200px;
  border: 2px solid #63b3ed;
  height: 40px;
  border-radius: 8px;
  padding: 0 10px;
}
/* Fim estilos filtros e categotias  */
/* Estilos para o layout da loja e modal */

.store-list-title {
  background: #f1f5f9;
  color: #2b6cb0;
  padding: 1rem;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
}

.store-list {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.store-item {
  background-color: #fff;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  padding: 15px;
  max-width: 21rem;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.store-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.store-image {
   width: 300px; /* Definindo a largura para 300px */
  height: 300px; /* Definindo a altura para 300px */
  object-fit: cover; /* Corta a imagem para preencher o espaço sem distorção */
  border-radius: 8px;
}

.store-title {
  font-size: 18px;
  font-weight: 600;
  color: #2b6cb0;
  margin-top: 10px;
}

.insta-title {
  background: linear-gradient(90deg, #f56565 0%, #ed64a6 100%);
  padding: 5px;
  border-radius: 4px;
  font-weight: 500;
  color: white;
  display: inline-block;
  margin-top: 10px;
  transition: background 0.3s ease;
}

.insta-title:hover {
  background: linear-gradient(90deg, #ed64a6 0%, #f56565 100%);
}

/* Estilos para o modal */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; 
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  z-index: 1010; 
}

.modal-store-image {
  width: 300px; /* Definindo a largura para 300px */
  height: 300px; /* Definindo a altura para 300px */
  object-fit: cover; /* Corta a imagem para preencher o espaço sem distorção */
  border-radius: 5px; 
}

.evaluate-button, .submit-button {
  background-color: #48bb78;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.evaluate-button:hover, .submit-button:hover {
  background-color: #38a169;
}

.modal-close-button {
  background-color: #e53e3e;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

/* Caixa de texto para comentário */
.rating-control {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}

.rating-button {
  background-color: #edf2f7;
  border: 1px solid #cbd5e0;
  border-radius: 5px;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}

.rating-button:hover {
  background-color: #e2e8f0;
}

.comment-box {
  width: 100%;
  height: 80px;
  margin-top: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 5px;
  padding: 10px;
}
.vue3-star-ratings__icon {
  fill: #d3d3d3; /* Cor padrão das estrelas inativas (cinza) */
  transition: fill 0.2s; /* Suaviza a transição de cor */
}

.vue3-star-ratings__icon.active {
  fill: #ff9800; /* Cor das estrelas ativas (laranja) */
}

.vue3-star-ratings__icon.half-active {
  fill: #ff9800; /* Coloração da estrela que representa a metade */
  mask: linear-gradient(90deg, transparent 50%, #ff9800 50%); /* Para criar o efeito de metade */
}

.modal-rating-button, .modal-submit-button {
  background-color: #4a90e2; /* Cor de fundo azul */
  color: white; /* Cor do texto */
  padding: 5px 21px; /* Espaçamento interno */
  border: none; /* Remove a borda padrão */
  border-radius: 5px; /* Bordas arredondadas */
  cursor: pointer; /* Cursor de mão ao passar o mouse */
  font-size: 16px; /* Tamanho da fonte */
  transition: background-color 0.3s, transform 0.2s; /* Transição suave */
  margin-top: 10px; /* Margem superior */
  margin-right: 10px;
}

/* Efeito de hover */
.modal-rating-button:hover, .modal-submit-button:hover {
  background-color: #357ab8; /* Cor de fundo quando o mouse passa sobre o botão */
  transform: translateY(-2px); /* Leve movimento para cima */
}

/* Botão de fechar */
.modal-close-button {
  background-color: #e53e3e; /* Cor de fundo vermelho */
  color: #fff; /* Cor do texto */
  padding: 5px 21px; /* Espaçamento interno */
  border: none; /* Remove a borda padrão */
  border-radius: 5px; /* Bordas arredondadas */
  cursor: pointer; /* Cursor de mão ao passar o mouse */
  font-size: 16px; /* Tamanho da fonte */
  transition: background-color 0.3s; /* Transição suave */
  margin-top: 10px; /* Margem superior */
}

/* Efeito de hover */
.modal-close-button:hover {
  background-color: #c53030; /* Cor de fundo quando o mouse passa sobre o botão */
}

.hg-rating{
  background: #fbcb0c5e;
  border-radius: 8px;
  padding: 2px;
}
</style>

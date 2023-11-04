<template>
  <div>
    <h2 class="store-list-title">Todas as Lojas</h2>

    <!-- Filtro de Categorias -->
    <div class="category-filter">
      <label for="categorySelect">Filtrar por Categoria:</label>
      <select id="categorySelect" v-model="selectedCategory">
        <option value="">Todas</option>
        <option v-for="category in categories" :key="category">{{ category }}</option>
      </select>
    </div>

    <!-- Campo de Busca -->
    <div class="search-filter">
      <label for="searchInput">Buscar Loja:</label>
      <input id="searchInput" v-model="searchQuery" placeholder="Digite para buscar..." />
    </div>

    <ul class="store-list">
      <li v-for="loja in filteredLojas" :key="loja.id" class="store-item">
        <h3 class="store-title">{{ loja.data().Nome }}</h3>
        <p class="store-detail">Categoria: {{ loja.data().Categoria }}</p>
        <p class="store-detail">Link do Instagram: <a :href="loja.data().InstagramLink">{{ loja.data().InstagramLink
        }}</a></p>
        <img :src="loja.data().Imagem" alt="Imagem da Loja" class="store-image" />
      </li>
    </ul>
  </div>
</template>


<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      lojas: [],
      selectedCategory: '', // Categoria selecionada no filtro
      searchQuery: '', // Consulta de busca
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
      // Obtenha todas as categorias únicas de suas lojas
      const uniqueCategories = [...new Set(this.lojas.map((loja) => loja.data().Categoria))];
      return [''].concat(uniqueCategories); // Adicione uma opção para "Todas" as categorias
    },
    filteredLojas() {
      // Filtre as lojas com base na categoria selecionada e na consulta de busca
      return this.lojas.filter((loja) => {
        const matchesCategory = !this.selectedCategory || loja.data().Categoria === this.selectedCategory;
        const matchesSearch = !this.searchQuery || loja.data().Nome.toLowerCase().includes(this.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    },
  },
};
</script>


<style scoped>
.store-list-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.store-list {
  list-style: none;
  padding: 0;
}

.store-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 20px;
}

.store-title {
  font-size: 20px;
  margin: 0;
}

.store-detail {
  margin: 5px 0;
}

.store-image {
  max-width: 20%;
  border-radius: 5px;
}

.category-filter {
  margin-bottom: 10px;
}
</style>

<template>
  <div>
    <h2 class="store-list-title">Todos os roles</h2>

    <div class="category-filter-wrapper">
      <!-- Campo de Busca -->
      <div class="search-filter">
        <label for="searchInput">Buscar Loja:</label>
        <div class="search-wrapper">
          <input id="searchInput" v-model="searchQuery" placeholder="Digite para buscar..." />
          <i class="fas fa-search"></i>
        </div>
      </div>

      <!-- Filtro de Categorias -->
      <div class="categoryFilter">
        <label for="categorySelect">Filtrar por Categoria:</label>
        <select id="categorySelect" v-model="selectedCategory">
          <option value="">Todas</option>
          <option v-for="category in categories" :key="category">{{ category }}</option>
        </select>
      </div>
    </div>

    <ul class="store-list">
      <li v-for="loja in filteredLojas" :key="loja.id" class="store-item">
        <a :href="getInstagramLink(loja.data().InstagramLink)" target="_blank">
          <img :src="loja.data().Imagem" alt="Imagem da Loja" class="store-image" />
          <h3 class="store-title">{{ loja.data().Nome }}</h3>
          <p class="store-detail">Categoria: {{ loja.data().Categoria }}</p>
          <p class="store-detail">
          
          <span class="insta-title"><i class="fa-brands fa-instagram"></i> {{ loja.data().InstagramLink }}</span>
        </p>
       </a>
      
      </li>
    </ul>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import CarrosselComponent from './CarrosselComponent.vue';

export default {
   components: {
    // Registro de componente
  },
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
  methods: {
    getLojasByCategory(category) {
      // Filtra as lojas para uma categoria específica
      return this.lojas.filter((loja) => loja.data().Categoria === category);
    },
    getInstagramLink(username) {
      // Gere o link do Instagram redirecionando para o perfil do usuário
      return `https://www.instagram.com/${username}`;
    },
  },
};
</script>



  <style scoped>

  .store-list-title {
      background: #35495e;
      color: #fff;
      padding: 1rem;
  }

  .store-list {
      list-style: none;
      padding: 0;
      display: flex;
      justify-content: center;
      align-content: center;
      flex-wrap: wrap;
      gap: 10px;
  }

  .store-item {
    border: 1px solid #35495e;
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 20px;
    max-width: 20rem;
  }

  .store-title {
      font-size: 20px;
      margin: 0;
      color: #40b883;
      border-radius: 8px;
      text-transform: capitalize;
      padding: 0.5rem;
  }

  .store-detail {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      align-content: center;
      gap: 5px;
      padding: 10px;
  }
  .store-detail i {
      color: #ffffff;
  }

  .store-image {
    max-width: 290px;
    max-height: 150px;
    object-fit: cover;
    border-radius: 5px;
  }

  .category-filter-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      gap: 10px;
      font-size: 18px;
  }
  .search-wrapper {
    position: relative;
  }
  .search-filter{
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .search-filter input {
    padding-right: 30px; /* Espaçamento para acomodar o ícone */
    height: 40px;
    border: 3px solid #40b883;
    width: 20rem;
    border-radius: 8px;
  }

  .search-filter i {
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translateY(-50%);
      color: #35495e;
      cursor: pointer;
      background: #40b883;
      padding: 10px;
      border-radius: 8px;
  }
  select#categorySelect {
      width: 200px;
      border: 1px solid #40b883;
      height: 30px;
      text-align: center;
  }

  span.insta-title {
      color: #fff;
      padding: 3px;
      border-radius: 4px;
      font-weight: 500;
      background: linear-gradient(90deg, rgba(132,11,92,1) 0%, rgba(11,66,132,1) 100%);
  }
  @media screen and (max-width: 768px) {
    .category-filter-wrapper, .search-filter  {
      flex-direction: column  ;
    }
    .category-filter-wrapper label, .search-filter label {
        font-size: 28px;
      }

  }
  </style>

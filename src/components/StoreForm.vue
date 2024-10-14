<template>
  <div>
    <h2>Criar uma nova loja</h2>
    <form @submit.prevent="criarLoja">
      <div>
        <label for="nome">Nome da Loja:</label>
        <input id="nome" v-model="novaLoja.nome" type="text" required />
      </div>
      <div>
        <label for="categoria">Categoria:</label>
        <select id="categoria" v-model="novaLoja.categoria" required>
          <option value="" disabled>Selecione uma categoria</option>
          <option value="Categoria 1">Bar</option>
          <option value="Categoria 2">Restaurante</option>
          <option value="Categoria 3">Hotel</option>
          <!-- Adicione mais opções de categoria, se necessário -->
        </select>
      </div>
      <div>
        <label for="instagramLink">Link do Instagram:</label>
        <input id="instagramLink" v-model="novaLoja.instagramLink" type="text" required />
      </div>
      <div>
        <label for="imagemLoja">Imagem da Loja:</label>
        <input id="imagemLoja" type="file" accept="image/*" @change="handleImagemChange" />
      </div>
      <button type="submit">Criar Loja</button>
    </form>
    <SuccessPopup ref="successPopup" /> <!-- Adicione o popup como uma referência -->
  </div>
</template>


<script>
import SuccessPopup from './SuccessPopup.vue'; // Importe o componente do popup
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default {
  components: {
    SuccessPopup,
  },
  data() {
    return {
      novaLoja: {
        nome: '',
        categoria: '',
        instagramLink: '',
        imagem: null, // Para armazenar o arquivo de imagem
      },
    };
  },
  methods: {
  async criarLoja() {
      const db = getFirestore(this.$firebaseApp);
      const lojasCollection = collection(db, 'lojas');

      // Fazer upload da imagem para o Firebase Storage
      if (this.novaLoja.imagem) {
        const storage = getStorage(this.$firebaseApp);
        const storageRef = ref(storage, `imagens_lojas/${this.novaLoja.imagem.name}`);
        await uploadBytes(storageRef, this.novaLoja.imagem);
        const imagemURL = await getDownloadURL(storageRef);

        this.novaLoja.Imagem = imagemURL; // Defina o URL da imagem
      }

      // Certifique-se de que o campo "Imagem" tenha um valor definido
      if (!this.novaLoja.Imagem) {
        this.novaLoja.Imagem = ''; // Defina como uma string vazia se não houver URL de imagem
      }

      // Agora, adicione os dados da loja ao Firestore
      addDoc(lojasCollection, {
        Nome: this.novaLoja.nome,
        Categoria: this.novaLoja.categoria,
        InstagramLink: this.novaLoja.instagramLink,
        Imagem: this.novaLoja.Imagem, // Garanta que o campo "Imagem" tenha um valor definido
      })
        .then((docRef) => {
           this.$refs.successPopup.openPopup();
          console.log('Loja criada com sucesso com o ID:', docRef.id);
          // Redirecione o usuário para uma página de sucesso ou exiba uma mensagem.
        })
        .catch((error) => {
          console.error('Erro ao criar a loja:', error);
          // Exiba uma mensagem de erro para o usuário, se necessário.
        });
    },
    handleImagemChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.novaLoja.imagem = file;
      }
    },
  },
};
</script>

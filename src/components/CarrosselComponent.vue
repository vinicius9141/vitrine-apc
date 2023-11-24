<template>
  <div class="carousel">
    <button @click="prevSlide">Anterior</button>
    <img :src="currentImage" alt="Imagem do carrossel" />
    <button @click="nextSlide">Próximo</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        'https://via.placeholder.com/350x500/ff0000/ffffff',
        'https://via.placeholder.com/350x500/00ff00/000000',
        'https://via.placeholder.com/350x500/0000ff/ffffff',
        'https://via.placeholder.com/350x500/00ff00/000000',
        'https://via.placeholder.com/350x500/0000ff/ffffff',
        'https://via.placeholder.com/350x500/00ff00/000000',
        'https://via.placeholder.com/350x500/0000ff/ffffff',
        'https://via.placeholder.com/350x500/00ff00/000000',
        'https://via.placeholder.com/350x500/0000ff/ffffff',
        // Adicione mais URLs de imagens conforme necessário
      ],
      currentIndex: 0,
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex];
    },
  },
  methods: {
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.images.length) % this.images.length;
    },
  },
};
</script>

<style scoped>
.carousel {
  text-align: center;
}

button {
  margin: 10px;
}
</style>

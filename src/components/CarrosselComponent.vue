<template>
  <div class="guitar-neck">
    <h1>Guitarras</h1>
    <div class="carousel">
       <button @click="nextSlide" class="next-button"><i class="fa-solid fa-arrow-left"></i></button>
      <transition name="fade" mode="out-in">
        <div class="slide" :key="currentIndex">
          <img v-for="(image, index) in currentSlide" :key="index" :src="image" alt="Imagem do carrossel"
            class="border-animation" />
        </div>
      </transition>
      <button @click="prevSlide" class="prev-button"><i class="fa-solid fa-arrow-right"></i></button>
     
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        'https://d3alv7ekdacjys.cloudfront.net/Custom/Content/Products/11/69/1169661_guitarra-les-paul-gibson-standard-slash-appetite-burst-ms_m2_637816655406828969.jpg',
        'https://http2.mlstatic.com/D_NQ_NP_866711-MLB47530374946_092021-O.webp',
        'https://http2.mlstatic.com/D_NQ_NP_818515-MLA50418287455_062022-O.webp',
        'https://http2.mlstatic.com/D_NQ_NP_824847-MLA51294832688_082022-O.webp',
        'https://http2.mlstatic.com/D_NQ_NP_677456-MLA48892458547_012022-O.webp',
        'https://http2.mlstatic.com/D_NQ_NP_898890-MLB53316593213_012023-O.webp',
        'https://http2.mlstatic.com/D_NQ_NP_620303-MLB71679493662_092023-O.webp',
        'https://http2.mlstatic.com/D_NQ_NP_748816-MLB71769717310_092023-O.webp',
        'https://http2.mlstatic.com/D_NQ_NP_914395-MLB71832532755_092023-O.webp',
        // Adicione mais URLs de imagens conforme necessário
      ],
      currentIndex: 0,
      itemsPerPage: 5,
      transitionName: 'fade',
    };
  },
  computed: {
    currentSlide() {
      const start = this.currentIndex * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.images.slice(start, end);
    },
  },
  methods: {
    nextSlide() {
      const totalSlides = Math.ceil(this.images.length / this.itemsPerPage);
      this.currentIndex = (this.currentIndex + 1) % totalSlides;
      this.transitionName = 'slide-left';
    },
    prevSlide() {
      const totalSlides = Math.ceil(this.images.length / this.itemsPerPage);
      this.currentIndex =
        (this.currentIndex - 1 + totalSlides) % totalSlides;
      this.transitionName = 'slide-right';
    },
  },
};
</script>

<style scoped>
.guitar-neck {
  background-color: #e4e4e4;
  /* Cor de madeira para simular o braço da guitarra */
  padding: 20px;
  position: relative;
}

h1 {
  color: #fff;
  /* Cor do texto branco */
  text-align: center;
  position: relative;
  z-index: 1;
}


.carousel {
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  justify-content:center;
}

.slide img {
  max-width: 250px;
  max-height: 500px;
  object-fit: cover;
  padding: 10px;
  border-radius: 8px;
  border: 4px solid #ff0000;
  box-sizing: border-box;
  filter: grayscale(1);
  transition: all .3s;
  border-radius: 140px;
  cursor: pointer;
}
.slide img:hover {
  transition: all .3s;
  cursor: pointer;
  filter: none;
}

.slide {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.border-animation {
  animation: borderAnimation 4s linear infinite;
}

@keyframes borderAnimation {

  0%,
  100% {
    border-color: red;
  }

  50% {
    border-color: black;
  }
}

.fade-enter-active,
.fade-leave-active,
.slide-left-enter-active,
.slide-right-enter-active,
.slide-left-leave-active,
.slide-right-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-enter,
.fade-leave-to,
.slide-left-enter,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(0);
}

.slide-left-enter,
.slide-left-leave-to {
  transform: translateX(100%);
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(-100%);
}

button.prev-button, button.next-button {
    min-width: 92px;
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(22,22,23,1) 35%, rgba(255,0,0,1) 100%);
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 8px;
    cursor: pointer;
}
button.next-button{
  background: linear-gradient(-90deg, rgba(2,0,36,1) 0%, rgba(22,22,23,1) 35%, rgba(255,0,0,1) 100%);
}

button {
  margin: 10px;
}
</style>
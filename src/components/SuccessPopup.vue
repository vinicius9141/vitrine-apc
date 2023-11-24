<template>
  <div class="success-popup" v-if="show">
    <div class="popup-content">
      <p>Cadastro realizado com sucesso!</p>
      <button @click="closePopup">Fechar</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    openPopup() {
      this.show = true;
    },
    closePopup() {
      this.show = false;
    },
  },
};
</script>

<style scoped>
.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(47, 221, 12, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

button {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background: #0056b3;
}
</style>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])
</script>

<template>
  <div class="product-card">
    <img :src="product.photo" :alt="product.title" class="product-image" />
    <div class="product-info">
      <h3>{{ product.title }}</h3>
      <p class="category">{{ product.category }}</p>
      <p class="description">{{ product.description }}</p>
      <div class="price-action">
        <span class="price">{{ product.price }} €</span>
        <button @click="emit('add-to-cart', product)">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: white;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 1rem;
}

.product-info h3 {
  margin: 0 0 0.5rem 0;
}

.category {
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.price-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.price {
  font-weight: bold;
  font-size: 1.1rem;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style>

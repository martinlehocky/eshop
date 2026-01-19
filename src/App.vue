<script setup>
import { ref, computed, reactive } from 'vue'
import ProductCard from './components/ProductCard.vue'
import CartDrawer from './components/CartDrawer.vue'
import productsData from './data/products.json'
import { CIcon } from '@coreui/icons-vue';
import { cilCart } from '@coreui/icons';

async function fetchData(){
  const response = await fetch('http://localhost:3333/produkty')
  const products = await response.json()

  console.log(products)
}

fetchData()

async function addProduct() {
  const response = await fetch('http://localhost:3333/produkty', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Product 3",
      category: "phone",
      price: 350
    })
  });
  
  const product = await response.json();
  console.log(product);
}

const products = ref(productsData)
const isCartOpen = ref(false)
const cart = ref([])

const filters = reactive({
  text: '',
  category: '',
  priceMin: null,
  priceMax: null
})

const categories = computed(() => {
  return [...new Set(products.value.map(p => p.category))]
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesText = product.title.toLowerCase().includes(filters.text.toLowerCase())
    const matchesCategory = filters.category ? product.category === filters.category : true
    const matchesPriceMin = filters.priceMin ? product.price >= filters.priceMin : true
    const matchesPriceMax = filters.priceMax ? product.price <= filters.priceMax : true

    return matchesText && matchesCategory && matchesPriceMin && matchesPriceMax
  })
})

const cartItemCount = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.qty, 0)
})

const addToCart = (product) => {
  const existingItem = cart.value.find(item => item.id === product.id)

  if (existingItem) {
    existingItem.qty++
  } else {
    cart.value.push({ ...product, qty: 1 })
  }

  isCartOpen.value = true
}

const updateQuantity = (id, change) => {
  const item = cart.value.find(i => i.id === id)
  if (item) {
    item.qty += change
    if (item.qty <= 0) {
      removeFromCart(id)
    }
  }
}

const removeFromCart = (id) => {
  cart.value = cart.value.filter(item => item.id !== id)
}

const clearCart = () => {
  cart.value = []
}
</script>

<template>
  <div class="app-container">
    <header class="header">
      <h1>E-Shop!</h1>
      <div class="cart-icon" @click="isCartOpen = true">
        <CIcon :icon="cilCart" :height="24" />
        <span class="badge" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
      </div>
    </header>

    <button @click="addProduct()">ADD PRODUCT</button>
    <div class="filters">
      <input v-model="filters.text" placeholder="Search products..." />

      <select v-model="filters.category">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <div class="price-range">
        <input type="number" v-model.number="filters.priceMin" placeholder="Min Price" />
        <input type="number" v-model.number="filters.priceMax" placeholder="Max Price" />
      </div>
    </div>

    <main class="product-grid">
      <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="addToCart"
      />
    </main>

    <CartDrawer
        :is-open="isCartOpen"
        :cart-items="cart"
        @close="isCartOpen = false"
        @update-quantity="updateQuantity"
        @remove-item="removeFromCart"
        @clear-cart="clearCart"
    />
  </div>
</template>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  margin-bottom: 2rem;
}

.cart-icon {
  margin-right: 1rem;
  position: relative;
  font-size: 1.5rem;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.8rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
  flex-wrap: wrap;
}

.filters input, .filters select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}
</style>

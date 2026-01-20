<script setup>
import { ref } from 'vue'
import { CIcon } from '@coreui/icons-vue'
import { cilChevronBottom } from '@coreui/icons'

const formData = ref({
  name: '',
  price: null,
  category: '',
  description: ''
})
const imageFile = ref(null)
const isExpanded = ref(false)

const emit = defineEmits(['product-added'])

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0]
}

const toggleForm = () => {
  isExpanded.value = !isExpanded.value
}

const submitForm = async () => {
  try {
    const data = new FormData()
    data.append('name', formData.value.name)
    data.append('price', formData.value.price)
    data.append('category', formData.value.category)
    data.append('description', formData.value.description)
    if (imageFile.value) {
      data.append('image', imageFile.value)
    }

    const response = await fetch('http://localhost:3333/produkty', {
      method: 'POST',
      body: data
    })

    if (response.ok) {
      const newProduct = await response.json()
      alert('Produkt uspesne pridany!')
      emit('product-added', newProduct)
      formData.value = { name: '', price: null, category: '', description: '' }
      imageFile.value = null
      isExpanded.value = false
    } else {
      const text = await response.text()
      alert('Chyba pri pridavani: ' + text)
    }
  } catch (error) {
    console.error('Error adding product:', error)
    alert('Nastala chyba pri komunikacii so serverom.')
  }
}
</script>

<template>
  <div class="add-product-form">
    <div class="form-header" @click="toggleForm">
      <h2>Pridat novy produkt</h2>
      <CIcon :icon="cilChevronBottom" class="toggle-icon" :class="{ 'rotated': isExpanded }" size="lg"/>
    </div>

    <transition name="expand">
      <div v-show="isExpanded" class="form-content">
        <form @submit.prevent="submitForm" class="form-grid">
          <div class="form-group">
            <label>Nazov produktu:</label>
            <input v-model="formData.name" required />
          </div>

          <div class="form-group">
            <label>Cena:</label>
            <input type="number" v-model="formData.price" required />
          </div>

          <div class="form-group">
            <label>Kategoria:</label>
            <input v-model="formData.category" required />
          </div>

          <div class="form-group">
            <label>Obrazok:</label>
            <input type="file" @change="handleFileUpload" accept="image/*" />
          </div>

          <div class="form-group full-width">
            <label>Popis:</label>
            <textarea v-model="formData.description"></textarea>
          </div>

          <div class="form-group full-width">
            <button type="submit">Pridat produkt</button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.add-product-form {
  background: #f9f9f9;
  padding: 0;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #eee;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.2s;
}

.form-header:hover {
  background-color: #f0f0f0;
}

.form-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.toggle-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.rotated {
  transform: rotate(180deg);
}

.form-content {
  padding: 1.5rem;
  padding-top: 0;
  border-top: 1px solid #eee;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.full-width {
  grid-column: 1 / -1;
}

input, textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 0.25rem;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #3aa876;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 500px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}
</style>

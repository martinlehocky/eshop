<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  price: null,
  category: '',
  description: ''
})
const imageFile = ref(null)

const emit = defineEmits(['product-added'])

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0]
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
      // Reset form
      formData.value = { name: '', price: null, category: '', description: '' }
      imageFile.value = null
      // Reset file input manually if needed, or let Vue handle it via key or ref
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
    <h2>Pridat novy produkt</h2>
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
</template>

<style scoped>
.add-product-form {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #eee;
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
</style>

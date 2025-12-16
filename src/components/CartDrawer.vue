<script setup>
import { CIcon } from '@coreui/icons-vue';
import { cilTrash } from '@coreui/icons';

const props = defineProps({
  isOpen: Boolean,
  cartItems: Array
})

const emit = defineEmits(['close', 'update-quantity', 'remove-item', 'clear-cart'])

const handleBuy = () => {
  Swal.fire({
    title: 'Thank you!',
    text: 'Your purchase was successful.',
    icon: 'success',
    confirmButtonText: 'Cool'
  }).then(() => {
    emit('clear-cart')
    emit('close')
  })
}

const total = props.cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
</script>

<template>
  <div class="drawer-overlay" :class="{ open: isOpen }" @click.self="emit('close')">
    <div class="drawer">
      <div class="drawer-header">
        <h2>Your Cart</h2>
        <button class="close-btn" @click="emit('close')">X</button>
      </div>

      <div class="drawer-body">
        <div v-if="cartItems.length === 0" class="empty-msg">Cart is empty</div>

        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-details">
              <h4>{{ item.title }}</h4>
              <p>{{ item.price }} €</p>
            </div>
            <div class="item-actions">
              <button @click="emit('update-quantity', item.id, -1)">-</button>
              <span>{{ item.qty }}</span>
              <button @click="emit('update-quantity', item.id, 1)">+</button>
              <button class="remove-btn" @click="emit('remove-item', item.id)"><CIcon :icon="cilTrash" :height="24" /></button>
            </div>
          </div>
        </div>
      </div>

      <div class="drawer-footer" v-if="cartItems.length > 0">
        <div class="total">Total: {{ cartItems.reduce((sum, i) => sum + (i.price * i.qty), 0) }} €</div>
        <button class="buy-btn" @click="handleBuy">Buy Now</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.item-actions {
  display: flex;
  align-items: center;
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
  z-index: 1000;
}

.drawer-overlay.open {
  visibility: visible;
  opacity: 1;
}

.drawer {
  position: absolute;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100%;
  background: white;
  transition: right 0.3s;
  display: flex;
  flex-direction: column;
}

.drawer-overlay.open .drawer {
  right: 0;
}

.drawer-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.item-actions button {
  margin: 0 5px;
  padding: 2px 8px;
  cursor: pointer;
}

.drawer-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
}

.buy-btn {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 10px;
}

.remove-btn {
  background: transparent;
  border: none;
}
</style>

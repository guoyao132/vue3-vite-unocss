<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="h-100vh">
    <RouterView v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </RouterView>
  </div>
</template>

<style></style>

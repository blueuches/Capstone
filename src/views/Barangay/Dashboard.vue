<template>
  <div>
    <h1> Dashboard</h1>
    <p v-if="profile">
      Logged in as: {{ profile.first_name }} {{ profile.last_name }}
    </p>

    <button @click="logout">
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { logout, profile } = useAuth()</script>

<style scoped>
/* CSS goes here */
</style>

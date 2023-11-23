<template>
  <div class="vuetify-image">
  <v-img
      :src="src"
      :alt="alt"
      :width="size"
      :height="size"
      :class="className"
      :cover="cover"
  />
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

const Component = defineComponent({
  name: 'VuetifyImage',

  props: {
    src: {
      type: String,
      default: './src/assets/ImageSvgFallback.svg',
    },
    alt: {
      type: String,
      default: 'image',
    },
    size: {
      type: String,
      default: '50',
    },
    className: {
      type: String,
      default: '',
    },
    cover: {
      type: Boolean,
      default: true,
    },
  },
});

export default Component;
</script>

<style scoped>
.vuetify-image {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

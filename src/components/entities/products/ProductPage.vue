<template>
  <EntityPage
    entity-type="product"
    :title="title"
    :item="state.entity"
    :loading="state.loading"
    :is-new="isNew()"
    :is-deletable="!isNew()"
  >
    <template #form-content>
      <div>
        <v-row align="start">
          <v-col cols="12">
            <VuetifyImage
              :src="state.entity.previewImage"
              size="250"
              class="thumbnail-preview"
              @click="openUploadDialog"
            />
            <v-file-input
              ref="input"
              accept=".png, .jpg, .jpeg"
              label="Product Thumbnail (1Mb max)"
              variant="outlined"
              show-size
              prepend-icon="mdi-camera"
              @change="uploadImage"
            >
            </v-file-input>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="state.entity.name"
              label="Name"
              variant="outlined"
              required
              hide-details="auto"
              :rules="rules.name"
              data-test="product-name"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="state.entity.categoryId"
              label="Category ID"
              variant="outlined"
              hide-details="auto"
              :items="listCategory"
              item-title="name"
              item-value="id"
              data-test="product-categoryId"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="state.entity.description"
              label="Description"
              variant="outlined"
              hide-details="auto"
              data-test="product-categoryId"
            />
          </v-col>
        </v-row>
      </div>
    </template>
  </EntityPage>
</template>

<script lang="ts">
import EntityPage from '@/components/common/EntityPage.vue';
import { defineComponent, onBeforeMount, reactive, watch, computed, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Product } from '../../../models/entities/Product';
import {AlertColor, dispatchAlert} from "@/utils/alerts";
import VuetifyImage from "@/components/common/VuetifyImage.vue";

interface State {
  entity: Product;
  loading: boolean;
}

const input = ref(null)

const Component = defineComponent({
  name: 'ProductDialog',

  components: {
    VuetifyImage,
    EntityPage,
  },

  props: {
    id: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const store = useStore();
    const router = useRouter();
    const product = new Product({});
    const previewImageMaxSize = 1000000;
    const isNew = () => !props.id;
    let listCategory: Ref<string[]> = ref([]);
    onBeforeMount(async () => {
      if (!isNew()) {
        const res = await store.dispatch(`productsModule/fetchItem`, props.id);
        if (!res) router.back();
      }
      listCategory.value = await store.dispatch(
        'categoriesModule/fetchAllItems',
        undefined,
      );
    });

    const state = reactive({
      entity: product,
      loading: computed(() => store.getters['productsModule/loading']),
    }) as State;
    watch(
      () => store.getters['productsModule/selectedItem'],
      (newValue: Product) => Object.assign(product, newValue),
      { immediate: false, deep: true },
    );
    const title = computed(() => {
      if (state.loading) return '';
      if (isNew()) return 'New Product';
      const getSelectedItem = store.getters['productsModule/selectedItem'];
      return getSelectedItem.name;
    });
    const rules = {
      name: [(v: string) => !!v || 'Name is required']
    };

    return {
      state,
      title,
      rules,
      isNew,
      listCategory,
      previewImageMaxSize,
    };
  },

  methods: {
    openUploadDialog() {
      console.log(input.value)
      input.value.click()
    },
    uploadImage(event: any, args) {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > this.previewImageMaxSize) {
        dispatchAlert(AlertColor.ERROR, 'File is too big');
        event.target.value = '';
      }
      this.state.entity.previewImage = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        this.state.entity.previewImage = reader.result
      }
      reader.readAsDataURL(file);
    },
  }
});

export default Component;
</script>
<style scoped>
.thumbnail-preview {
  height: 250px;
  width: 250px;
  overflow: hidden;
  margin-bottom: 10px;
}
.hidden-input {
  display: none;
}

</style>

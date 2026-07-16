<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useProduct } from '@/composables'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { imageUrl, firstImage } from '@/lib/utils'
import { computed, ref } from 'vue'
import { useCart } from '@/composables'

const route = useRoute()
const router = useRouter()
const { addItem, hasItem } = useCart()

const id = computed(() => Number(route.params.id))
const { data: product, isLoading, isError } = useProduct(id)

const priceFormat = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

const selectedImage = ref(0)

const images = computed(() => product.value?.images ?? [])
</script>

<template>
  <div class="space-y-6">
    <!-- Back -->
    <Button variant="ghost" size="sm" @click="router.back()">
      ← Назад
    </Button>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center py-24 text-muted-foreground"
    >
      Загрузка...
    </div>

    <!-- Error -->
    <div
      v-else-if="isError"
      class="flex flex-col items-center gap-3 py-24 text-center"
    >
      <p class="text-lg font-medium">Товар не найден</p>
      <p class="text-sm text-muted-foreground">
        Возможно, он был удалён или ссылка неверна
      </p>
      <Button variant="outline" size="sm" @click="router.push('/products')">
        Вернуться в каталог
      </Button>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="grid gap-8 lg:grid-cols-5">
      <!-- Images -->
      <div class="space-y-3 lg:col-span-2">
        <div class="aspect-square overflow-hidden bg-muted/20">
          <img
            v-if="images.length"
            :src="images[selectedImage] ? imageUrl(images[selectedImage]) : firstImage(images)"
            :alt="product.name"
            class="h-full w-full object-cover"
          />
          <div
            v-else
            class="flex h-full items-center justify-center text-6xl font-bold text-muted-foreground/20"
          >
            {{ product.name.charAt(0) }}
          </div>
        </div>
        <div
          v-if="images.length > 1"
          class="flex gap-2 overflow-x-auto"
        >
          <button
            v-for="(img, i) in images"
            :key="i"
            class="size-16 shrink-0 overflow-hidden rounded-lg border transition-all hover:opacity-80"
            :class="selectedImage === i ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60'"
            @click="selectedImage = i"
          >
            <img
              :src="imageUrl(img)"
              alt=""
              class="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="flex flex-col gap-5 lg:col-span-3">
        <div>
          <p class="text-sm text-muted-foreground">
            {{ product.category?.name ?? '—' }}
          </p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {{ product.name }}
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-3xl font-bold">{{ priceFormat(product.price) }}</span>
          <Badge
            variant="outline"
            :class="product.stock < 10 ? 'text-destructive border-destructive/30' : ''"
          >
            {{ product.stock < 10 ? 'Осталось мало' : 'В наличии' }}
          </Badge>
        </div>

        <Separator />

        <div v-if="product.description">
          <h3 class="mb-2 text-sm font-medium text-muted-foreground">Описание</h3>
          <p class="text-sm leading-relaxed">{{ product.description }}</p>
        </div>

        <div class="flex flex-col gap-2">
          <Button
            size="default"
            class="w-fit"
            :variant="hasItem(product.id) ? 'secondary' : 'default'"
            @click="addItem(product)"
          >
            {{ hasItem(product.id) ? 'Добавить ещё' : 'Добавить в корзину' }}
          </Button>
          <p class="text-xs text-muted-foreground">
            Артикул: #{{ product.id }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

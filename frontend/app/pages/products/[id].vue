<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { imageUrl, firstImage } from '@/lib/utils'
import { Minus, Plus } from '@lucide/vue'
import { computed, ref } from 'vue'

// Remount the page when navigating between products so setup (and the 404 check)
// re-runs and per-product state resets.
definePageMeta({ key: route => String(route.params.id) })

const route = useRoute()
const router = useRouter()
const { items, addItem, updateQuantity, hasItem } = useCart()

const id = computed(() => Number(route.params.id))
const { data: product, error } = await useProduct(id)

if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Товар не найден',
    fatal: true,
  })
}

// Compute meta eagerly here (Nuxt context is active). `firstImage` reads
// runtimeConfig, which is unavailable inside unhead's lazy getters.
const loaded = product.value
useSeoMeta({
  title: `${loaded.name} — Store`,
  description: loaded.description ?? 'Подробная информация о товаре.',
  ogTitle: `${loaded.name} — Store`,
  ogDescription: loaded.description ?? undefined,
  ogImage: firstImage(loaded.images),
})

const quantityInCart = computed(
  () => items.value.find(i => i.product.id === product.value?.id)?.quantity ?? 0,
)

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

    <!-- Product Detail -->
    <div v-if="product" class="grid gap-8 lg:grid-cols-5">
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
          <p class="mt-1 text-xs text-muted-foreground">
            Артикул: #{{ product.id }}
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

        <div class="flex items-center gap-3">
          <Button
            v-if="!hasItem(product.id)"
            size="default"
            class="w-fit"
            @click="addItem(product)"
          >
            Добавить в корзину
          </Button>
          <div v-else class="flex items-center gap-2">
            <button
              class="inline-flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
              @click="updateQuantity(product.id, quantityInCart - 1)"
            >
              <Minus class="size-4" />
            </button>
            <span class="w-8 text-center text-sm font-medium tabular-nums">
              {{ quantityInCart }}
            </span>
            <button
              class="inline-flex size-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
              @click="updateQuantity(product.id, quantityInCart + 1)"
            >
              <Plus class="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

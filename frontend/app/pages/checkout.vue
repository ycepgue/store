<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createOrder } from '@/api'
import AddressMap from '@/components/checkout/AddressMap.vue'
import DatePicker from '@/components/checkout/DatePicker.vue'
import TimePicker from '@/components/checkout/TimePicker.vue'

const { user, token, isAuthenticated } = useAuth()
const { items, totalPrice, clearCart } = useCart()

if (!isAuthenticated.value) {
  await navigateTo('/login?redirect=/checkout')
}

const priceFormat = (n: number) =>
  new Intl.NumberFormat('ru-RU').format(n) + ' ₽'

const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  customerName: user.value?.name ?? '',
  customerEmail: user.value?.email ?? '',
  phone: '',
  address: '',
  latitude: null as number | null,
  longitude: null as number | null,
  deliveryDate: today,
  deliverySlot: '12:00',
  comment: '',
})

const resolvingAddress = ref(false)
const error = ref('')
const loading = ref(false)

function onMapUpdate(payload: { lat: number; lng: number; address: string }) {
  form.latitude = payload.lat
  form.longitude = payload.lng
  if (payload.address) form.address = payload.address
}

async function submit() {
  error.value = ''
  if (!items.value.length) {
    error.value = 'Корзина пуста.'
    return
  }
  if (!form.address.trim()) {
    error.value = 'Укажите адрес доставки (выберите точку на карте или введите вручную).'
    return
  }
  loading.value = true
  try {
    const order = await createOrder(
      {
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        phone: form.phone || undefined,
        address: form.address,
        latitude: form.latitude ?? undefined,
        longitude: form.longitude ?? undefined,
        deliveryDate: form.deliveryDate,
        deliverySlot: form.deliverySlot,
        comment: form.comment || undefined,
        items: items.value.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      },
      token.value!,
    )
    clearCart()
    await navigateTo(`/orders?placed=${order.id}`)
  } catch (e: any) {
    error.value = e?.data?.message || 'Не удалось оформить заказ. Попробуйте ещё раз.'
  } finally {
    loading.value = false
  }
}

useHead({ title: 'Оформление заказа — Store' })
</script>

<template>
  <div class="py-6">
    <h1 class="mb-6 text-2xl font-bold tracking-tight">Оформление заказа</h1>

    <ClientOnly>
      <template #fallback>
        <div class="h-72 animate-pulse rounded-lg border border-border bg-muted/30" />
      </template>

    <div v-if="items.length === 0" class="rounded-lg border border-border p-8 text-center">
      <p class="text-sm text-muted-foreground">Корзина пуста.</p>
      <Button as-child variant="outline" class="mt-4">
        <NuxtLink to="/products">В каталог</NuxtLink>
      </Button>
    </div>

    <form v-else class="grid gap-6 lg:grid-cols-[1fr_360px]" @submit.prevent="submit">
      <!-- Left: delivery details -->
      <div class="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Адрес доставки</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col gap-4">
            <ClientOnly>
              <AddressMap
                :lat="form.latitude"
                :lng="form.longitude"
                @update="onMapUpdate"
                @resolving="resolvingAddress = $event"
              />
              <template #fallback>
                <div class="flex h-72 items-center justify-center rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground">
                  Загрузка карты…
                </div>
              </template>
            </ClientOnly>
            <div class="flex flex-col gap-1.5">
              <label for="address" class="text-sm font-medium">
                Адрес
                <span v-if="resolvingAddress" class="text-xs text-muted-foreground">(определяем…)</span>
              </label>
              <Input id="address" v-model="form.address" placeholder="Кликните по карте или введите адрес" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Дата и время</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium">Дата доставки</label>
              <DatePicker v-model="form.deliveryDate" :min="today" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium">Время</label>
              <TimePicker v-model="form.deliverySlot" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Контактные данные</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-4 sm:grid-cols-2">
            <div class="flex flex-col gap-1.5">
              <label for="name" class="text-sm font-medium">Имя получателя</label>
              <Input id="name" v-model="form.customerName" required placeholder="Иван Иванов" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="email" class="text-sm font-medium">Почта</label>
              <Input id="email" v-model="form.customerEmail" type="email" required />
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="phone" class="text-sm font-medium">Телефон</label>
              <Input id="phone" v-model="form.phone" type="tel" placeholder="+7 900 123-45-67" />
            </div>
            <div class="flex flex-col gap-1.5 sm:col-span-2">
              <label for="comment" class="text-sm font-medium">Комментарий к заказу</label>
              <textarea
                id="comment"
                v-model="form.comment"
                rows="2"
                placeholder="Код домофона, пожелания…"
                class="rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right: order summary -->
      <div>
        <Card class="lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>Ваш заказ</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col gap-3">
            <div v-for="item in items" :key="item.product.id" class="flex items-start justify-between gap-2 text-sm">
              <span class="min-w-0 flex-1">
                <span class="line-clamp-2">{{ item.product.name }}</span>
                <span class="text-muted-foreground"> × {{ item.quantity }}</span>
              </span>
              <span class="shrink-0 tabular-nums">{{ priceFormat(item.product.price * item.quantity) }}</span>
            </div>
            <Separator />
            <div class="flex items-center justify-between font-semibold">
              <span>Итого</span>
              <span class="tabular-nums">{{ priceFormat(totalPrice) }}</span>
            </div>
            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
            <Button type="submit" :disabled="loading" class="w-full">
              {{ loading ? 'Оформляем…' : 'Подтвердить заказ' }}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
    </ClientOnly>
  </div>
</template>

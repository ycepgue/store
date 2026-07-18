<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import StarRating from '@/components/review/StarRating.vue'
import { createReview } from '@/api'
import type { Review } from '@/types'

const props = defineProps<{
  productId: number
  reviews: Review[]
  // Пользователь заказывал этот товар (право оставить отзыв).
  canReview: boolean
}>()

const emit = defineEmits<{ submitted: [] }>()

const { token, isAuthenticated } = useAuth()

const count = computed(() => props.reviews.length)
const average = computed(() =>
  count.value === 0
    ? 0
    : props.reviews.reduce((sum, r) => sum + r.rating, 0) / count.value,
)
const averageLabel = computed(() => average.value.toFixed(1))

const dateFormat = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const open = ref(false)
const form = reactive({ rating: 0, comment: '' })
const submitting = ref(false)
const errorMsg = ref('')

const canSubmit = computed(() => form.rating >= 1 && !submitting.value)

function resetForm() {
  form.rating = 0
  form.comment = ''
  errorMsg.value = ''
}

async function submit() {
  errorMsg.value = ''
  if (form.rating < 1) {
    errorMsg.value = 'Поставьте оценку от 1 до 5 звёзд.'
    return
  }

  submitting.value = true
  try {
    await createReview(
      {
        productId: props.productId,
        rating: form.rating,
        comment: form.comment.trim() || undefined,
      },
      token.value!,
    )
    open.value = false
    resetForm()
    emit('submitted')
  } catch {
    errorMsg.value = 'Не удалось отправить отзыв. Попробуйте ещё раз.'
  } finally {
    submitting.value = false
  }
}

// Сбрасываем форму при каждом открытии модалки.
function onOpenChange(value: boolean) {
  open.value = value
  if (value) resetForm()
}
</script>

<template>
  <section class="space-y-5">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold tracking-tight">Отзывы</h2>
      <div v-if="count > 0" class="flex items-center gap-2">
        <StarRating :rating="Math.round(average)" size="sm" />
        <span class="text-sm font-medium">{{ averageLabel }}</span>
        <span class="text-sm text-muted-foreground">· {{ count }}</span>
      </div>
    </div>

    <!-- Список отзывов -->
    <div v-if="count > 0" class="space-y-4">
      <div v-for="review in reviews" :key="review.id" class="space-y-1.5">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">{{ review.author }}</span>
            <StarRating :rating="review.rating" size="sm" />
          </div>
          <span class="text-xs text-muted-foreground">
            {{ dateFormat(review.createdAt) }}
          </span>
        </div>
        <p v-if="review.comment" class="text-sm leading-relaxed text-muted-foreground">
          {{ review.comment }}
        </p>
      </div>
    </div>
    <p v-else class="text-sm text-muted-foreground">
      Отзывов пока нет. Будьте первым, кто оставит отзыв!
    </p>

    <Separator />

    <!-- Оставить отзыв -->
    <div>
      <template v-if="!isAuthenticated">
        <p class="text-sm text-muted-foreground">
          <NuxtLink to="/login" class="font-medium text-foreground underline underline-offset-4">
            Войдите
          </NuxtLink>,
          чтобы оставить отзыв.
        </p>
      </template>

      <template v-else-if="!canReview">
        <p class="text-sm text-muted-foreground">
          Оставить отзыв можно только на товар, который вы заказывали.
        </p>
      </template>

      <Dialog v-else :open="open" @update:open="onOpenChange">
        <DialogTrigger as-child>
          <Button>Оставить отзыв</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Ваш отзыв</DialogTitle>
          <DialogDescription>
            Поделитесь впечатлениями о товаре — это поможет другим покупателям.
          </DialogDescription>

          <form class="space-y-4" @submit.prevent="submit">
            <div class="space-y-1.5">
              <label class="text-sm text-muted-foreground">Ваша оценка</label>
              <StarRating v-model="form.rating" :readonly="false" size="lg" />
            </div>

            <div class="space-y-1.5">
              <label for="review-comment" class="text-sm text-muted-foreground">
                Комментарий <span class="text-xs">(необязательно)</span>
              </label>
              <textarea
                id="review-comment"
                v-model="form.comment"
                rows="3"
                maxlength="1000"
                placeholder="Поделитесь впечатлениями о товаре"
                class="dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-3"
              />
            </div>

            <p v-if="errorMsg" class="text-sm text-destructive">{{ errorMsg }}</p>

            <div class="flex justify-end gap-2">
              <DialogClose as-child>
                <Button type="button" variant="outline">Отмена</Button>
              </DialogClose>
              <Button type="submit" :disabled="!canSubmit">
                {{ submitting ? 'Отправка…' : 'Отправить' }}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </section>
</template>

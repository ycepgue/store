import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StarRating from './StarRating.vue'

describe('StarRating', () => {
  it('всегда рендерит пять звёзд', () => {
    const wrapper = mount(StarRating, { props: { rating: 3 } })
    expect(wrapper.findAll('button')).toHaveLength(5)
  })

  it('в режиме только чтения кнопки заблокированы', () => {
    const wrapper = mount(StarRating, { props: { rating: 4, readonly: true } })
    const buttons = wrapper.findAll('button')
    expect(buttons.every((b) => b.attributes('disabled') !== undefined)).toBe(
      true,
    )
  })

  it('в интерактивном режиме по клику эмитит update:modelValue', async () => {
    const wrapper = mount(StarRating, {
      props: { modelValue: 0, readonly: false },
    })
    await wrapper.findAll('button')[2].trigger('click')

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual([3])
  })

  it('в режиме только чтения клик не эмитит событие', async () => {
    const wrapper = mount(StarRating, {
      props: { rating: 2, readonly: true },
    })
    await wrapper.findAll('button')[4].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('выставляет доступную подпись с текущим значением', () => {
    const wrapper = mount(StarRating, { props: { rating: 5 } })
    expect(wrapper.attributes('aria-label')).toBe('Рейтинг 5 из 5')
  })
})

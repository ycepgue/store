<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap, Marker } from 'leaflet'

const props = defineProps<{
  lat: number | null
  lng: number | null
}>()

const emit = defineEmits<{
  (e: 'update', payload: { lat: number; lng: number; address: string }): void
  (e: 'resolving', value: boolean): void
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: LeafletMap | null = null
let marker: Marker | null = null
let L: typeof import('leaflet') | null = null

const DEFAULT_CENTER: [number, number] = [55.7558, 37.6173] // Москва

async function reverseGeocode(lat: number, lng: number) {
  emit('resolving', true)
  try {
    const data = await $fetch<{ display_name?: string }>(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: { format: 'json', lat, lon: lng, 'accept-language': 'ru' },
      },
    )
    return data?.display_name ?? ''
  } catch {
    return ''
  } finally {
    emit('resolving', false)
  }
}

function pinIcon() {
  return L!.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;transform:translate(-50%,-100%)">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="var(--color-primary,#0f172a)" stroke="white" stroke-width="1.5">
        <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5" fill="white" stroke="none"/>
      </svg></div>`,
    iconSize: [26, 26],
    iconAnchor: [0, 0],
  })
}

async function place(lat: number, lng: number, geocode = true) {
  if (!map || !L) return
  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng], { icon: pinIcon() }).addTo(map)
  }
  const address = geocode ? await reverseGeocode(lat, lng) : ''
  emit('update', { lat, lng, address })
}

function locateMe() {
  if (!import.meta.client || !navigator.geolocation) return
  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords
    map?.setView([latitude, longitude], 16)
    place(latitude, longitude)
  })
}

defineExpose({ locateMe })

onMounted(async () => {
  L = await import('leaflet')
  const start: [number, number] =
    props.lat != null && props.lng != null ? [props.lat, props.lng] : DEFAULT_CENTER

  map = L.map(mapEl.value!).setView(start, props.lat != null ? 16 : 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19,
  }).addTo(map)

  if (props.lat != null && props.lng != null) {
    place(props.lat, props.lng, false)
  }

  map.on('click', (e: any) => {
    place(e.latlng.lat, e.latlng.lng)
  })
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
  marker = null
})
</script>

<template>
  <div class="relative overflow-hidden rounded-lg border border-border">
    <div ref="mapEl" class="h-72 w-full" />
    <button
      type="button"
      class="absolute right-2 top-2 z-[400] rounded-md border border-border bg-background/90 px-2.5 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm transition-colors hover:bg-muted"
      @click="locateMe"
    >
      Моё местоположение
    </button>
  </div>
</template>

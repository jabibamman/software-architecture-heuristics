<template>
  <div
    class="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
  >
    <div class="flex items-center gap-4 mb-4">
      <slot name="icon" />
      <h2 class="text-xl font-semibold text-gray-800">
        <slot name="heading" />
      </h2>
    </div>
    <div class="text-gray-600 leading-relaxed text-sm">
      <slot />
    </div>
  </div>
</template>

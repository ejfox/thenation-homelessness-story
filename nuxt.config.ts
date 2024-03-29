// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  css: ["tachyons/css/tachyons.min.css"],
  modules: ['@nuxt/content'],
  content: {
    documentDriven: true,
    markdown: {
      remarkPlugins: [
        'remark-unwrap-images'
      ]
    }    
  }
})

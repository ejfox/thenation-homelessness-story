// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ["tachyons/css/tachyons.min.css"],
  modules: ['@nuxt/content'],
  content: {
    markdown: {
      remarkPlugins: [
        'remark-unwrap-images'
      ]
    }    
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Api key repodaki kök .env dosyasında duruyor.
  // Vite varsayılan olarak sadece frontend/ altını okur; bu yüzden envDir'i köke çekiyoruz.
  envDir: '../',
})

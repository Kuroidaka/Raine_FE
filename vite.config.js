import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  
  assetsInclude: ['**/*.cur', '**/*.ani'],
  server: {
    // https: {
    //   key: './localhost-key.pem',
    //   cert: './localhost.pem'
    // },
    host: '0.0.0.0', // This allows access from your local network IP
    port: 5173,
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false
            }
          ]
        ]
      }
    }),
    mkcert()
  ]
})
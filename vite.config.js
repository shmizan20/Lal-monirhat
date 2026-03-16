import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about_district: resolve(__dirname, 'about-district.html'),
        advisory_council: resolve(__dirname, 'advisory-council.html'),
        contact: resolve(__dirname, 'contact.html'),
        executive_committee: resolve(__dirname, 'executive-committee.html'),
        founder_president: resolve(__dirname, 'founder-president.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        history: resolve(__dirname, 'history.html'),
        members: resolve(__dirname, 'members.html'),
        projects: resolve(__dirname, 'projects.html'),
        registration: resolve(__dirname, 'registration.html'),
      },
    },
  },
});

import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        services: resolve(__dirname, 'services.html'),
        blog: resolve(__dirname, 'blog.html'),
        careers: resolve(__dirname, 'careers.html'),
        contact: resolve(__dirname, 'contact.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        notFound: resolve(__dirname, '404.html'),
        serviceArchitecture: resolve(__dirname, 'service-architectural-design.html'),
        serviceInterior: resolve(__dirname, 'service-interior-architecture.html'),
        serviceCreative: resolve(__dirname, 'service-creative-direction.html'),
        blogProportion: resolve(__dirname, 'blog-on-proportion-and-shadow.html'),
        blogMateriality: resolve(__dirname, 'blog-raw-materiality.html'),
        blogRest: resolve(__dirname, 'blog-the-architecture-of-rest.html'),
        blogAdaptiveReuse: resolve(__dirname, 'blog-adaptive-reuse.html'),
        blogMonolithic: resolve(__dirname, 'blog-monolithic-simplicity.html'),
      },
    },
  },
});

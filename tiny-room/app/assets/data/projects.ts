import type { Project } from '../../types';

const projects: Project[] = [
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    description:
      'A personal portfolio built with React and Vite showcasing my projects and skills.',
    imageUrl: 'https://picsum.photos/seed/portfolio/400/300',
    link: '#',
    tags: ['React', 'TypeScript', 'Vite'],
    category: 'Web Development',
    date: '2023-05-15',
    featured: true,
    technologies: ['React', 'TypeScript', 'SCSS', 'Vite'],
    details:
      'A responsive portfolio website built using modern web technologies. Features include dark mode, animated transitions, and a custom project showcase.',
    client: 'Self',
    duration: '3 weeks',
    images: [
      {
        url: 'https://picsum.photos/seed/portfolio1/800/600',
        caption: 'Homepage design with dark mode',
      },
      {
        url: 'https://picsum.photos/seed/portfolio2/800/600',
        caption: 'Projects showcase section',
      },
    ],
  },
  {
    id: 'ecommerce-store',
    title: 'E-commerce Store',
    description: 'A fake online store UI with product listings, cart, and checkout flow.',
    imageUrl: 'https://picsum.photos/seed/store/400/300',
    link: '#',
    tags: ['React', 'Redux', 'E-commerce'],
    category: 'Web Development',
    date: '2023-03-20',
    featured: false,
    technologies: ['React', 'Redux', 'Styled Components'],
    details:
      'An e-commerce store prototype featuring product listings, shopping cart functionality, and a simulated checkout process.',
    client: 'ABC Company',
    duration: '2 months',
    images: [
      {
        url: 'https://picsum.photos/seed/store1/800/600',
        caption: 'Product listing page',
      },
      {
        url: 'https://picsum.photos/seed/store2/800/600',
        caption: 'Shopping cart interface',
      },
      {
        url: 'https://picsum.photos/seed/store3/800/600',
        caption: 'Checkout process',
      },
    ],
  },
  {
    id: 'blog-platform',
    title: 'Blog Platform',
    description: 'A markdown-powered blog with tagging and search features.',
    imageUrl: 'https://picsum.photos/seed/blog/400/300',
    link: '#',
    tags: ['React', 'Markdown', 'Blog'],
    category: 'Web Development',
    date: '2023-01-10',
    featured: false,
    technologies: ['React', 'MDX', 'Next.js'],
    details:
      'A blog platform that supports Markdown content, tag-based filtering, and full-text search capabilities.',
    client: 'XYZ Publishing',
    duration: '6 weeks',
    images: [
      {
        url: 'https://picsum.photos/seed/blog1/800/600',
        caption: 'Blog homepage with featured articles',
      },
      {
        url: 'https://picsum.photos/seed/blog2/800/600',
        caption: 'Article page with markdown rendering',
      },
    ],
  },
];

export default projects;

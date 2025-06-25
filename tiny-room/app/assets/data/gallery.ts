import type { GalleryImage } from '../../types';

export const galleryImages: GalleryImage[] = [
  {
    id: 'mountain-lake',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
    alt: 'Mountain Lake',
    tags: ['Nature', 'Landscape', 'Water'],
    date: '2023-06-15',
    description: 'A serene mountain lake surrounded by forest and mountains',
    width: 800,
    height: 533,
    location: {
      name: 'Banff National Park, Canada',
    },
  },
  {
    id: 'desert',
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800',
    alt: 'Desert',
    tags: ['Nature', 'Desert', 'Landscape'],
    date: '2023-05-20',
    description: 'Vast desert landscape with sand dunes',
    width: 800,
    height: 533,
    location: {
      name: 'Sahara Desert',
    },
  },
  {
    id: 'forest',
    src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800',
    alt: 'Forest',
    tags: ['Nature', 'Forest', 'Green'],
    date: '2023-04-10',
    description: 'Dense forest with sunlight filtering through the trees',
    width: 800,
    height: 533,
    location: {
      name: 'Redwood National Park',
    },
  },
  {
    id: 'beach',
    src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800',
    alt: 'Beach',
    tags: ['Nature', 'Beach', 'Ocean'],
    date: '2023-07-05',
    description: 'Sandy beach with clear blue water',
    width: 800,
    height: 533,
    location: {
      name: 'Maldives',
    },
  },
  {
    id: 'city',
    src: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800',
    alt: 'City',
    tags: ['Urban', 'Architecture', 'City'],
    date: '2023-03-12',
    description: 'Modern city skyline with skyscrapers',
    width: 800,
    height: 533,
    location: {
      name: 'New York City',
    },
  },
  {
    id: 'desert-2',
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800',
    alt: 'Desert 2',
    tags: ['Nature', 'Desert', 'Sunset'],
    date: '2023-02-28',
    description: 'Desert landscape at sunset with golden light',
    width: 800,
    height: 533,
    location: {
      name: 'Atacama Desert',
    },
  },
];

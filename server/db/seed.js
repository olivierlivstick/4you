import db from './database.js';

const BRANDS = [
  { name: 'Amazon',    description: 'Des millions de produits livrés chez vous en un clic',      color: '#FF9900', category: 'Shopping'      },
  { name: 'Netflix',   description: 'Les meilleures séries, films et documentaires en streaming', color: '#E50914', category: 'Divertissement' },
  { name: 'Spotify',   description: 'Musique, podcasts et playlists pour tous les goûts',        color: '#1DB954', category: 'Musique'        },
  { name: 'Fnac',      description: 'Culture, tech et loisirs réunis en un seul endroit',        color: '#E2A028', category: 'Culture'        },
  { name: 'Zalando',   description: 'Mode, chaussures et accessoires livrés rapidement',         color: '#FF6900', category: 'Mode'           },
  { name: 'Uber Eats', description: 'Vos restaurants préférés livrés directement chez vous',     color: '#06C167', category: 'Restauration'   },
  { name: 'Airbnb',    description: 'Des logements uniques et authentiques partout dans le monde', color: '#FF385C', category: 'Voyage'       },
  { name: 'Steam',     description: 'Des milliers de jeux vidéo pour PC à découvrir',            color: '#1B2838', category: 'Jeux vidéo'     },
];

export function seedBrands() {
  const insert = db.prepare(
    'INSERT OR IGNORE INTO brands (name, description, color, category) VALUES (@name, @description, @color, @category)'
  );
  const seedAll = db.transaction(() => {
    for (const brand of BRANDS) {
      insert.run(brand);
    }
  });
  seedAll();
  console.log('✅ Brands seeded');
}

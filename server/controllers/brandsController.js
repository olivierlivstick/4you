import db from '../db/database.js';

export function getAllBrands(req, res) {
  const brands = db.prepare('SELECT * FROM brands ORDER BY name').all();
  res.json(brands);
}

export function getBrandById(req, res, next) {
  const { id } = req.params;
  const brand = db.prepare('SELECT * FROM brands WHERE id = ?').get(id);
  if (!brand) {
    const err = new Error('Enseigne introuvable');
    err.status = 404;
    return next(err);
  }
  res.json(brand);
}

export function createBrand(req, res, next) {
  const { name, description, color, category, photo = '' } = req.body;

  if (!name?.trim())        return res.status(400).json({ error: 'Le nom est obligatoire' });
  if (!description?.trim()) return res.status(400).json({ error: 'La description est obligatoire' });
  if (!color?.trim())       return res.status(400).json({ error: 'La couleur est obligatoire' });
  if (!category?.trim())    return res.status(400).json({ error: 'La catégorie est obligatoire' });

  try {
    const result = db.prepare(
      'INSERT INTO brands (name, description, color, category, photo) VALUES (@name, @description, @color, @category, @photo)'
    ).run({ name: name.trim(), description: description.trim(), color: color.trim(), category: category.trim(), photo: photo.trim() });

    res.status(201).json(db.prepare('SELECT * FROM brands WHERE id = ?').get(result.lastInsertRowid));
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: `Une enseigne nommée "${name}" existe déjà` });
    }
    next(err);
  }
}

export function updateBrand(req, res, next) {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM brands WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Enseigne introuvable' });

  const name        = req.body.name?.trim()        ?? existing.name;
  const description = req.body.description?.trim() ?? existing.description;
  const color       = req.body.color?.trim()       ?? existing.color;
  const category    = req.body.category?.trim()    ?? existing.category;
  const photo       = (req.body.photo ?? existing.photo ?? '').trim();

  if (!name)        return res.status(400).json({ error: 'Le nom est obligatoire' });
  if (!description) return res.status(400).json({ error: 'La description est obligatoire' });
  if (!color)       return res.status(400).json({ error: 'La couleur est obligatoire' });
  if (!category)    return res.status(400).json({ error: 'La catégorie est obligatoire' });

  try {
    db.prepare(
      'UPDATE brands SET name=@name, description=@description, color=@color, category=@category, photo=@photo WHERE id=@id'
    ).run({ id, name, description, color, category, photo });

    res.json(db.prepare('SELECT * FROM brands WHERE id = ?').get(id));
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: `Une enseigne nommée "${name}" existe déjà` });
    }
    next(err);
  }
}

export function deleteBrand(req, res) {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM brands WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Enseigne introuvable' });

  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE brand_id = ?').get(id).count;
  if (orderCount > 0) {
    return res.status(409).json({
      error: `Impossible de supprimer "${existing.name}" : ${orderCount} commande(s) liée(s)`,
    });
  }

  db.prepare('DELETE FROM brands WHERE id = ?').run(id);
  res.json({ success: true, deleted: existing });
}

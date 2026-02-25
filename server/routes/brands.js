import { Router } from 'express';
import { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand } from '../controllers/brandsController.js';

const router = Router();

router.get('/',      getAllBrands);
router.get('/:id',   getBrandById);
router.post('/',     createBrand);
router.put('/:id',   updateBrand);
router.delete('/:id', deleteBrand);

export default router;

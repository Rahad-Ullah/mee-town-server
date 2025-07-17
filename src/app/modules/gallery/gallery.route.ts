import express from 'express';
import { GalleryController } from './gallery.controller';

const router = express.Router();

router.get('/', GalleryController); 

export const GalleryRoutes = router;

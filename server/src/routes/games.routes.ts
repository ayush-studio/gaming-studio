import { Router } from 'express';
import { getAllGames, getGameBySlug } from '../controllers/games.controller';

const router = Router();

router.get('/', getAllGames);
router.get('/:slug', getGameBySlug);

export default router;

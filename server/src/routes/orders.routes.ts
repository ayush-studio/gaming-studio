import { Router } from 'express';
import { checkout, getOrder } from '../controllers/orders.controller';

const router = Router();

router.post('/checkout', checkout);
router.get('/:orderNumber', getOrder);

export default router;

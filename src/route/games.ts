import routerx from 'express-promise-router';
import { gameByUserId, gameSave, getRemainingTimes } from '../controller/gameController';

const router = routerx();

router.post('/gameByUserId', gameByUserId);
router.post('/save', gameSave);
router.get('/remainingTimes', getRemainingTimes);

export default router;

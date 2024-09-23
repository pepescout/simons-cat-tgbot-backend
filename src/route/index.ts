import routerx from 'express-promise-router';
import users from './users';
import games from './games';
import raids from "./raids";

const router = routerx();
router.use('/user', users);
router.use('/game', games);
router.use('/raid', raids);

export default router;

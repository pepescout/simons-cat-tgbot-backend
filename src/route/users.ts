import 'dotenv/config';
import routerx from 'express-promise-router';
import { getReferralsByUserId, getUserById, signUp } from '../controller/userController';
import passport from 'passport';

const router = routerx();

router.post('/signUp', signUp);
router.post('/getUserById', getUserById);
router.post('/getReferralsByUserId', getReferralsByUserId);
router.get('/xlogin', passport.authenticate('twitter', {
    scope: ['tweet.read', 'users.read', 'offline.access']
}));
router.get('/oauth/callback', 
    passport.authenticate('twitter'), 
    (req, res) => {
    res.redirect("/profile");
});
router.get('/profile', passport.authenticate('twitter'), (req, res) => {
  res.status(200).send(req.user)
});

export default router;

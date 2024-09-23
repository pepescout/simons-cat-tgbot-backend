import routerx from "express-promise-router";
import {
  connectTwitter,
  getAvailableRaids,
  getLeaderBoard,
  submitRaid,
} from "../controller/raidController";

const router = routerx();

// GET ROUTES
router.get("/getLeaderboard", getLeaderBoard);
router.get("/getAvailableRaids", getAvailableRaids);

// POST ROUTES
router.post("/connectTwitter", connectTwitter);
router.post("/submitRaid", submitRaid);

export default router;

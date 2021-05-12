import { Router } from 'express';
import geocodeController from './geocode';
import heartbeatController from './heartbeat';

const router = Router();

router.get('/heartbeat', heartbeatController);
router.get('/api/v1/geocode/:latitude/:longitude', geocodeController);

export default router;
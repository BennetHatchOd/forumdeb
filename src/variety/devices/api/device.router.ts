import {Router} from 'express';
import { deviceControllers } from '../../../instances';
import { authUserByRefreshT } from '../../../midlleware/authorization';

export const deviceRouter = Router({});

deviceRouter.get('/', authUserByRefreshT, deviceControllers.getDevices);
deviceRouter.delete('/', authUserByRefreshT, deviceControllers.closeManySessions);
deviceRouter.delete('/:deviceId', authUserByRefreshT, deviceControllers.closeOneSession);


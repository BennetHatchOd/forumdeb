import {Router} from 'express';
import { deviceControllers } from '../../../instances';
import { authUserByRefreshT } from '../../../midlleware/authorization';

export const deviceRouter = Router({});

deviceRouter.get('/', authUserByRefreshT, deviceControllers.getDevices.bind(deviceControllers));
deviceRouter.delete('/', authUserByRefreshT, deviceControllers.closeManySessions.bind(deviceControllers));
deviceRouter.delete('/:deviceId', authUserByRefreshT, deviceControllers.closeOneSession.bind(deviceControllers));


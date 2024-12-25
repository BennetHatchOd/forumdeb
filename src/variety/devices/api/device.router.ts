import {Router} from 'express';
import { deviceControllers } from './device.controller';

export const deviceRouter = Router({});

deviceRouter.get('/',  deviceControllers.getDevices);
deviceRouter.delete('/', deviceControllers.closeManySessions);
deviceRouter.delete('/:deviceId', deviceControllers.closeOneSession);


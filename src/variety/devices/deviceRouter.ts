import {Router} from 'express';
import { deviceControllers } from './deviceControllers';

export const deviceRouter = Router({});

deviceRouter.get('/',  deviceControllers.getDevices);
deviceRouter.delete('/', deviceControllers.closeManySessions);
deviceRouter.delete('/:id', deviceControllers.closeOneSession);


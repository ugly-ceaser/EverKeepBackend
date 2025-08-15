import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import contactRoutes from './contact.routes';
import vaultRoutes from './vault.routes';
import notificationRoutes from './notification.routes';
import mediaRoutes from './media.routes';
import healthRoutes from './health.routes';

const routes = Router();

routes.use('/health', healthRoutes);
routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/contacts', contactRoutes);
routes.use('/vaults', vaultRoutes);
routes.use('/notifications', notificationRoutes);
routes.use('/media', mediaRoutes);

export default routes;

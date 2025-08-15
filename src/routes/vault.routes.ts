import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { getVaultsQueryDto, createVaultDto, updateVaultDto, createVaultEntryDto, addVaultRecipientDto, verifyShareDto, updateVaultEntryDto } from '../dto/vault.dto';
import {
  listVaults,
  getVaultById,
  createVault,
  updateVault,
  deleteVault,
  listVaultEntries,
  createVaultEntry,
  deleteVaultEntry,
  listVaultRecipients,
  addVaultRecipient,
  removeVaultRecipient,
  verifyShareToken,
  updateVaultEntry,
} from '../controllers/vault.controller';
import { strictRateLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Public share verification endpoint (no auth)
router.post('/share/verify', strictRateLimiter, validate(verifyShareDto), verifyShareToken);

router.get('/', authMiddleware, validate(getVaultsQueryDto), listVaults);
router.get('/:id', authMiddleware, getVaultById);
router.post('/', authMiddleware, validate(createVaultDto), createVault);
router.patch('/:id', authMiddleware, validate(updateVaultDto), updateVault);
router.delete('/:id', authMiddleware, deleteVault);

router.get('/:id/entries', authMiddleware, listVaultEntries);
router.post('/:id/entries', authMiddleware, validate(createVaultEntryDto), createVaultEntry);
router.patch('/entries/:entryId', authMiddleware, validate(updateVaultEntryDto), updateVaultEntry);
router.delete('/:id/entries/:entryId', authMiddleware, deleteVaultEntry);
// Alias: delete an entry by its ID without vault id (matches frontend)
router.delete('/entries/:entryId', authMiddleware, deleteVaultEntry);

router.get('/:id/recipients', authMiddleware, listVaultRecipients);
router.post('/:id/recipients', authMiddleware, validate(addVaultRecipientDto), addVaultRecipient);
router.delete('/:id/recipients/:recipientId', authMiddleware, removeVaultRecipient);
// Alias: delete a recipient by its ID without vault id (matches frontend)
router.delete('/recipients/:recipientId', authMiddleware, removeVaultRecipient);

export default router; 
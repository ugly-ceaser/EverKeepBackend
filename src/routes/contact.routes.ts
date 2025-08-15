import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { getContactsQueryDto, createContactDto, updateContactDto } from '../dto/contact.dto';
import { listContacts, getContactById, createContact, updateContact, deleteContact, verifyContact } from '../controllers/contact.controller';

const router = Router();

router.get('/', authMiddleware, validate(getContactsQueryDto), listContacts);
router.get('/:id', authMiddleware, getContactById);
router.post('/', authMiddleware, validate(createContactDto), createContact);
router.patch('/:id', authMiddleware, validate(updateContactDto), updateContact);
router.delete('/:id', authMiddleware, deleteContact);
router.post('/:id/verify', authMiddleware, verifyContact);

export default router; 
import { Router } from 'express';
import { createLink, deleteLink, getLink, getLinks, updateLink } from '../controllers/link.controller.js';
import { requireToken } from '../middlewares/validationToken.js';
import { bodyLinkValidator } from '../middlewares/validatorManager.js';
const router = Router();

// GET      api/v1/links                all links
// GET      api/v1/links/:id            search link
// POST     api/v1/links                create link
// PATCH    api/v1/links                update link
// DELETE   api/v1/links/:id            remove link

router.get('/', requireToken, getLinks);
router.get('/:nanoLink', getLink);
router.post('/', requireToken, bodyLinkValidator, createLink);
router.delete('/:id', requireToken, deleteLink);
router.patch('/:id', requireToken, bodyLinkValidator, updateLink);

export default router;

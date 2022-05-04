import express from 'express';

import { getPosts, getPost, createPost, updatePost, likePost, deletePost, getPostCitiess, getPostMaxBalance } from '../controllers/posts.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/cities', getPostCitiess);
router.get('/max-balance', getPostMaxBalance);
router.post('/', createPost);
router.get('/:id', getPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/likePost', likePost);



export default router;
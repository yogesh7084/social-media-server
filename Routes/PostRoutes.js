import express from "express";
const router = express.Router();
import { createPost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from '../Controllers/PostController.js'

router.get('/', (req, res) => {
    res.json("posts api");
})

router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like', likePost);
router.get('/:id/getTimelinePosts', getTimelinePosts);

export default router;
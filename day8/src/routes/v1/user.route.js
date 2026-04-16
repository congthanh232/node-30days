import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { userQuerySchema, userParamsSchema, userBodySchema } from '../../schemas/user.schema.js';

const router = Router();

router.get('/', validate(userQuerySchema, 'query'), (req, res) => {
  res.json({ data: [{ id: 1, name: 'Alice' }], query: req.validated });
});

router.get('/:id', validate(userParamsSchema, 'params'), (req, res) => {
  res.json({ id: req.validated.id });
});

router.post('/', validate(userBodySchema, 'body'), (req, res) => {
  res.json({ message: 'Tạo user thành công', user: req.validated });
});

export default router;
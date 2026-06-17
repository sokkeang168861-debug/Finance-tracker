import { Router } from 'express';
import { getAccounts, getTransactions, createTransaction } from '../controllers/financeController';

const router = Router();
router.get('/accounts', getAccounts);
router.get('/transactions', getTransactions);
router.post('/transactions', createTransaction);

export default router;
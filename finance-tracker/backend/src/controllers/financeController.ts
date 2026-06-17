import { Request, Response } from 'express';
import pool, { query } from '../config/db';
import { ResultSetHeader } from 'mysql2';

export const getAccounts = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query('SELECT * FROM accounts ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const rows = await query(
      `SELECT t.*, a.name as account_name 
       FROM transactions t 
       JOIN accounts a ON t.account_id = a.id 
       ORDER BY t.date DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
};

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  const { account_id, amount, type, description } = req.body;

  if (!account_id || !amount || !type) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const insertSql = `INSERT INTO transactions (account_id, amount, type, description) VALUES (?, ?, ?, ?)`;
    const [insertResult] = await connection.execute<ResultSetHeader>(insertSql, [account_id, amount, type, description || null]);
    const insertedId = insertResult.insertId;

    const updateBalanceSql = type === 'INCOME' 
      ? 'UPDATE accounts SET balance = balance + ? WHERE id = ?'
      : 'UPDATE accounts SET balance = balance - ? WHERE id = ?';
    
    await connection.execute(updateBalanceSql, [amount, account_id]);
    await connection.commit();

    const [txRows]: any = await query('SELECT * FROM transactions WHERE id = ?', [insertedId]);
    res.status(201).json(txRows[0]);
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: 'Transaction matrix execution failed' });
  } finally {
    connection.release();
  }
};
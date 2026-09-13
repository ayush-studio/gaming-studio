import { Request, Response } from 'express';
import db from '../db/database';

export const getAllGames = (req: Request, res: Response): void => {
  try {
    const { genre, search, sortBy, badge } = req.query;

    let query = 'SELECT * FROM games WHERE 1=1';
    const params: (string | number)[] = [];

    if (genre && genre !== 'All') {
      query += ' AND genre = ?';
      params.push(genre as string);
    }

    if (badge && badge !== 'All') {
      query += ' AND badge = ?';
      params.push(badge as string);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR tagline LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (sortBy === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sortBy === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (sortBy === 'rating') {
      query += ' ORDER BY rating DESC';
    } else if (sortBy === 'release') {
      query += ' ORDER BY release_date DESC';
    } else {
      query += ' ORDER BY id ASC';
    }

    const stmt = db.prepare(query);
    const games = stmt.all(...params);

    res.json({ success: true, data: games });
  } catch (error) {
    console.error('getAllGames error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch games' });
  }
};

export const getGameBySlug = (req: Request, res: Response): void => {
  try {
    const { slug } = req.params;
    const stmt = db.prepare('SELECT * FROM games WHERE slug = ?');
    const game = stmt.get(slug);

    if (!game) {
      res.status(404).json({ success: false, message: 'Game not found' });
      return;
    }

    res.json({ success: true, data: game });
  } catch (error) {
    console.error('getGameBySlug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch game' });
  }
};

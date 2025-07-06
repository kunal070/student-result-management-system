import { Request, Response } from 'express';
import * as resultService from '../services/result.service';

export const getAllResults = async (_req: Request, res: Response) => {
    const response = await resultService.getAllResults();
    res.status(response.statusCode).json(response);
};

export const createResult = async (req: Request, res: Response) => {
    const response = await resultService.createResult(req.body);
    res.status(response.statusCode).json(response);
};

export const deleteResult = async (
  req: Request<{ id: string }>,
  res: Response
) => {
    const response = await resultService.deleteResult(req.params.id);
    res.status(response.statusCode).send();
};

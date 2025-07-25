import { Request, Response } from 'express';
import * as studentService from '../services/student.service';

export const getAllStudents = async (_req: Request, res: Response) => {
    const response = await studentService.getAllStudents();
    res.status(response.statusCode).json(response);
};

export const getStudentById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
    const response = await studentService.getStudentById(req.params.id);
    res.status(response.statusCode).json(response);
};

export const createStudent = async (req: Request, res: Response) => {
    const response = await studentService.createStudent(req.body);
    res.status(response.statusCode).json(response);
};

export const deleteStudent = async (
  req: Request<{ id: string }>,
  res: Response
) => {
    const response = await studentService.deleteStudent(req.params.id);
    res.status(response.statusCode).send();
};
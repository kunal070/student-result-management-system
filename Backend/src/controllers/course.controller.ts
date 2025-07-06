import { Request, Response } from 'express';
import * as courseService from '../services/course.service';

export const getAllCourses = async (_req: Request, res: Response) => {
    const response = await courseService.getAllCourses();
    res.status(response.statusCode).json(response);
};

export const getCourseById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
    const response = await courseService.getCourseById(req.params.id);
    res.status(response.statusCode).json(response);
};

export const createCourse = async (req: Request, res: Response) => {
    const response = await courseService.createCourse(req.body);
    res.status(response.statusCode).json(response);
};

export const deleteCourse = async (
  req: Request<{ id: string }>,
  res: Response
) => {
    const response = await courseService.deleteCourse(req.params.id);
    res.status(response.statusCode).send();
};

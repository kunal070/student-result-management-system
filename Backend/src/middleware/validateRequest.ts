import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';

export class ValidationError extends Error {
  public statusCode: number;
  public errors: Record<string, string[]>;

  constructor(message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

export const validateRequest = (
  schema: ZodSchema<any>,
  target: 'body' | 'params' | 'query' = 'body'
): RequestHandler => {
  return ((req: Request, res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = target === 'body' ? req.body :
                            target === 'params' ? req.params :
                            req.query;

      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const formattedErrors = formatZodErrors(result.error);
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors : formattedErrors,
        });
        return;
      }

      if (target === 'body') req.body = result.data;
      else if (target === 'params') req.params = result.data;
      else req.query = result.data;

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal validation error',
        ...(process.env.NODE_ENV === 'development' && {
          debug: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        })
      });
      return;
    }
  }) as RequestHandler;
};

const formatZodErrors = (zodError: ZodError): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};
  zodError.errors.forEach((error) => {
    const path = error.path.join('.');
    const field = path || 'root';
    
    if (!errors[field]) {
      errors[field] = [];
    }
    let message = error.message;
    errors[field].push(message);
  });
  
  return errors;
};

// Middleware for validating request body
export const validateBody = (schema: ZodSchema<any>): RequestHandler => {
  return validateRequest(schema, 'body');
};

// Middleware for validating route parameters
export const validateParams = (schema: ZodSchema<any>): RequestHandler => {
  return validateRequest(schema, 'params');
};

// Middleware for validating query parameters
export const validateQuery = (schema: ZodSchema<any>): RequestHandler => {
  return validateRequest(schema, 'query');
};

// Utility function to validate data programmatically 
export const validateData = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const formattedErrors = formatZodErrors(result.error);
    throw new ValidationError('Data validation failed', formattedErrors);
  }
  
  return result.data;
};
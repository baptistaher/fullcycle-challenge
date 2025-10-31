import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { CreateClientSchema } from './create-client.validation';

describe('CreateClient Schema Validation', () => {
  it('should validate valid data', () => {
    const validData = {
      name: 'John Doe',
      email: 'xHj0Y@example.com',
    };

    expect(CreateClientSchema.parse(validData)).toEqual({
      name: 'John Doe',
      email: 'xHj0Y@example.com',
    });
  });

  it('should invalidate data with empty name', () => {
    const invalidData = {
      name: '',
      email: 'xHj0Y@example.com',
    };

    expect(() => CreateClientSchema.parse(invalidData)).toThrowError(ZodError);

    try {
      CreateClientSchema.parse(invalidData);
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
      if (error instanceof ZodError) {
        expect(error.issues).toHaveLength(1);
        expect(error.issues[0].path).toEqual(['name']);
        expect(error.issues[0].message).toBe(
          'Too small: expected string to have >=1 characters'
        );
      }
    }
  });

  it('should invalidate data with invalid email', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'invalid-email',
    };

    expect(() => CreateClientSchema.parse(invalidData)).toThrowError(ZodError);

    try {
      CreateClientSchema.parse(invalidData);
    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);
      if (error instanceof ZodError) {
        expect(error.issues).toHaveLength(1);
        expect(error.issues[0].path).toEqual(['email']);
        expect(error.issues[0].message).toBe('Invalid email address');
      }
    }
  });
});

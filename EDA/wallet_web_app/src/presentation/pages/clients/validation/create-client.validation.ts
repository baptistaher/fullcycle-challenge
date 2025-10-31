import { z } from 'zod';

export const CreateClientSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export type CreateClientDTO = z.infer<typeof CreateClientSchema>;

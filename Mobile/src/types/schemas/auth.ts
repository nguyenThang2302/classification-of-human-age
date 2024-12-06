import { z } from 'zod';

export const authLoginSchema = z.object({
	data: z.object({
        access_token: z.string(),
        token_type: z.string(),
        expires_in:  z.string()
    })
});

export const authRegisterSchema = z.object({
	id: z.number(),
    email: z.string(),
});


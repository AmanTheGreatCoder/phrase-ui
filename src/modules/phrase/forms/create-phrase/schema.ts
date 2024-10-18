import { z } from 'zod';

export const PhraseStatus = z.enum(['active', 'pending', 'spam']);
export type PhraseStatus = z.infer<typeof PhraseStatus>;

const TranslationSchema = z.object({
	id: z.string().optional(),
	language: z.string().min(1, 'Language is required'),
	text: z.string().min(1, 'Translation text is required'),
});

const BasePhraseSchema = z.object({
	phrase: z.string().min(1, 'Phrase is required'),
	status: PhraseStatus,
	translations: z
		.array(TranslationSchema)
		.min(1, 'At least one translation is required'),
});

export const CreatePhraseSchema = BasePhraseSchema;
export type CreatePhraseSchema = z.infer<typeof CreatePhraseSchema>;

export const UpdatePhraseSchema = BasePhraseSchema.extend({
	id: z.string().min(1, 'Id is required'),
});

export type UpdatePhraseSchema = z.infer<typeof UpdatePhraseSchema>;

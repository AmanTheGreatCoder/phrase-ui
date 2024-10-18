import { ITranslation } from '@/modules/types/phrase';

export const formatPhraseOutput = (translations: ITranslation[]) => {
	return translations.reduce((acc: any, t) => {
		acc[t.language] = t.text;
		return acc;
	}, {});
};

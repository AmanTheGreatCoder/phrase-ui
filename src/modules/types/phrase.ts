export interface IPhrase {
	id: string;
	phrase: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	translations: ITranslation[];
}

export interface ITranslation {
	id: string;
	phraseId: string;
	language: string;
	text: string;
	createdAt: string;
	updatedAt: string;
}

export interface ILanguage {
	language: string;
	code: string;
}

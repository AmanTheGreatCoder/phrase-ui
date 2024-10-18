import {
	ILanguage,
	IPhrase,
	ISearchParams,
	ITranslation,
} from '@/modules/types/phrase';
import { CrudClient } from './templates/CrudClient';
import { AxiosResponse } from 'axios';
import { IApiParams, IApiResponse } from '../types';

export class PhraseClient extends CrudClient<IPhrase> {
	constructor() {
		super('phrase');
	}

	async getLanguages(): Promise<AxiosResponse<IApiResponse<ILanguage[]>>> {
		return await this.get('/languages');
	}

	async deleteTranslations(
		ids: string[]
	): Promise<AxiosResponse<IApiResponse<ITranslation[]>>> {
		return await this.delete('/translations', { data: { ids } });
	}

	async search(
		params: IApiParams
	): Promise<AxiosResponse<IApiResponse<IPhrase[]>>> {
		return await this.get('/search', {
			params,
		});
	}
}

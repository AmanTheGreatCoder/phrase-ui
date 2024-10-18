import { AxiosError } from 'axios';

export interface IApiResponse<
	T extends {
		[key: string]: any;
	}
> {
	success: boolean;
	statusCode: number;
	data: T | null;
	errors: {
		[key: string]: string;
	};
	meta?: {
		total: number;
		items: number;
		currentPage: number;
		perPage: number;
		lastPage: number;
		[key: string]: any;
	};
	path: string;
	message: string;
	stackTrace?: string;
}

export type IApiParams = {
	sort?: string;
	searchFields?: string;
	query?: string;
};

export type IApiError = AxiosError<IApiResponse<any>>;

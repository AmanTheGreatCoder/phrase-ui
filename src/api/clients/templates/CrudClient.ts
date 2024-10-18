import { IApiParams } from '@/api/types';
import { BaseClient } from './BaseClient';

export class CrudClient<
	T extends Record<string, any> = Record<string, any>,
	C extends Record<string, any> = Record<string, any>,
	U extends Record<string, any> = Record<string, any>
> extends BaseClient {
	private containsImage: boolean;
	constructor(endpoint: string, containsImage: boolean = false) {
		super(endpoint);
		this.containsImage = containsImage;
	}

	async all(params?: IApiParams) {
		return this.get<T[]>('/', { params });
	}

	async one(id: string) {
		return this.get<T>(`/${id}`);
	}

	async create(data: C) {
		return this.containsImage
			? this.postForm<T>('/', data)
			: this.post<T>('/', data);
	}

	async createForm(data: FormData) {
		return this.postForm<T>('/', data);
	}

	async update(id: string, data: U) {
		return this.containsImage
			? this.putForm<T>(`/${id}`, data)
			: this.put<T>(`/${id}`, data);
	}

	async remove(id: string) {
		return this.delete<T>(`/${id}`);
	}
}

import { api } from '@/api';
import { IApiParams } from '@/api/types';
import { useQuery } from '@tanstack/react-query';

export const usePhrases = (params: IApiParams) => {
	const { data, isLoading, refetch } = useQuery({
		queryKey: ['phrases', params],
		queryFn: () => api.phrase.search(params),
	});

	return {
		phrases: data?.data?.data,
		isLoading,
		refetchPhrases: refetch,
	};
};

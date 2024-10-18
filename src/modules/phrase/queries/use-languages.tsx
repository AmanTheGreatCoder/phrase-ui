import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

export const useLanguages = () => {
	const { data, isLoading: isLoadingLanguages } = useQuery({
		queryKey: ['languages'],
		queryFn: () => api.phrase.getLanguages(),
	});

	return {
		languages: data?.data?.data,
		isLoadingLanguages,
	};
};

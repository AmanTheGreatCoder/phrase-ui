import { api } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const getQueryKey = (id: string) => ['phrase', id];

export const usePhrase = (id: string) => {
	const queryClient = useQueryClient();

	const { data, isLoading, refetch } = useQuery({
		queryKey: getQueryKey(id),
		queryFn: () => api.phrase.one(id),
		enabled: !!id,
	});

	// const refetchPhrase = async () => {
	// 	if (id) {
	// 		await queryClient.refetchQueries({ queryKey: getQueryKey(id) });
	// 	}
	// };

	return {
		phrase: data?.data?.data,
		isLoading,
		refetchPhrase: refetch,
	};
};

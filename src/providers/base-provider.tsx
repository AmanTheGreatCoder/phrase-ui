'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, type FC, type ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

interface BaseProviderProps {
	children: ReactNode;
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		},
	},
});

const BaseProvider: FC<BaseProviderProps> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ToastContainer position='top-right' stacked theme={'light'} />;
			<Suspense>{children}</Suspense>
		</QueryClientProvider>
	);
};

export default BaseProvider;

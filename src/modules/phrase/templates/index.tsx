'use client';
import { api } from '@/api';
import { ILanguage } from '@/modules/types/phrase';
import {
	ArrowDownward,
	ArrowUpward,
	Delete,
	Edit,
	Search,
	Translate,
} from '@mui/icons-material';
import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormGroup,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Paper,
	Popover,
	Select,
	SelectChangeEvent,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { CreateEditPhraseForm } from '../forms/create-phrase';
import { useLanguages } from '../queries/use-languages';
import { usePhrases } from '../queries/use-phrases';
import { IApiParams } from '@/api/types';

type SortField = 'phrase' | 'status' | 'translations.language';
type SortOrder = 'asc' | 'desc';

export const PhraseTemplate: React.FC = () => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [selectedPhraseTranslations, setSelectedPhraseTranslations] =
		useState<any>(null);

	const [searchTerm, setSearchTerm] = useState('');
	const [sortFields, setSortFields] = useState<SortField[]>(['phrase']);

	const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

	const searchParams = useRef<IApiParams>({
		query: searchTerm,
		sort: sortFields.map((field) => `${field}:${sortOrder}`).join(','),
		searchFields: 'phrase,status,translations.text',
	});

	const { phrases, isLoading, refetchPhrases } = usePhrases(
		searchParams.current
	);

	const [isCreateEditFormOpen, setIsCreateEditFormOpen] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [phraseToDelete, setPhraseToDelete] = useState<string | null>(null);

	const deleteMutation = useMutation({
		mutationFn: (phraseId: string) => {
			return api.phrase.remove(phraseId);
		},
		onSuccess: () => {
			refetchPhrases();
			resetForm();
			toast.success('Phrase deleted successfully');
		},
		onError: (error) => {
			console.error(error);
			toast.error('Failed to delete phrase');
		},
	});

	const handleSortFieldChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const field = event.target.name as SortField;
		setSortFields((prev) =>
			event.target.checked ? [...prev, field] : prev.filter((f) => f !== field)
		);
	};

	const handleSortOrderChange = (event: SelectChangeEvent) => {
		setSortOrder(event.target.value as SortOrder);
	};

	const handleOpenCreateForm = () => {
		setIsCreateEditFormOpen(true);
	};

	const handleCloseCreateForm = () => {
		setIsCreateEditFormOpen(false);
		setEditId(null);
		resetForm();
	};

	const handleDeleteClick = (phraseId: string) => {
		setPhraseToDelete(phraseId);
		setDeleteDialogOpen(true);
	};

	const resetForm = () => {
		setIsCreateEditFormOpen(false);
		setEditId(null);
		setDeleteDialogOpen(false);
		setPhraseToDelete(null);
	};

	const handleDeleteConfirm = () => {
		if (phraseToDelete) {
			deleteMutation.mutate(phraseToDelete);
		}
	};

	const handleDeleteCancel = () => {
		resetForm();
	};

	const handleTranslationsClick = (
		event: React.MouseEvent<HTMLButtonElement>,
		translations: any
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedPhraseTranslations(translations);
	};

	const handleClosePopover = () => {
		setAnchorEl(null);
		setSelectedPhraseTranslations(null);
	};

	const { languages } = useLanguages();

	const open = Boolean(anchorEl);
	const queryClient = useQueryClient();

	const debouncedSearch = useCallback(
		debounce(() => {
			searchParams.current = {
				query: searchTerm,
				sort: sortFields.map((field) => `${field}:${sortOrder}`).join(','),
				searchFields: 'phrase,status',
			};
			refetchPhrases();
		}, 500),
		[searchTerm, sortFields, sortOrder, refetchPhrases]
	);

	useEffect(() => {
		debouncedSearch();
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const onCreateEditSuccess = () => {
		refetchPhrases();
	};

	return (
		<Container maxWidth='lg'>
			<Box my={4}>
				<Box display='flex' justifyContent='space-between' alignItems='center'>
					<Typography variant='h4' component='h1' gutterBottom>
						Phrases
					</Typography>
					<Button
						onClick={handleOpenCreateForm}
						variant='contained'
						color='primary'
					>
						Add Phrase
					</Button>
				</Box>

				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					gap={2}
					mt={2}
					mb={2}
				>
					<TextField
						fullWidth
						label='Search Phrases'
						value={searchTerm}
						onChange={handleSearchChange}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									{searchTerm && isLoading ? (
										<CircularProgress size={20} />
									) : (
										<Search />
									)}
								</InputAdornment>
							),
						}}
					/>

					<Paper sx={{ p: 2 }}>
						<Typography variant='subtitle1' gutterBottom>
							Sort By
						</Typography>

						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox
										checked={sortFields.includes('phrase')}
										onChange={handleSortFieldChange}
										name='phrase'
									/>
								}
								label='Phrase'
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={sortFields.includes('status')}
										onChange={handleSortFieldChange}
										name='status'
									/>
								}
								label='Status'
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={sortFields.includes('translations.language')}
										onChange={handleSortFieldChange}
										name='translations.language'
									/>
								}
								label='Translations'
							/>
						</FormGroup>
					</Paper>

					<FormControl sx={{ minWidth: 120 }}>
						<InputLabel id='sort-order-label'>Order</InputLabel>
						<Select
							labelId='sort-order-label'
							value={sortOrder}
							label='Order'
							onChange={handleSortOrderChange}
						>
							<MenuItem value='asc'>
								Ascending <ArrowUpward fontSize='small' />
							</MenuItem>
							<MenuItem value='desc'>
								Descending <ArrowDownward fontSize='small' />
							</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<TableContainer component={Paper} sx={{ mt: 2 }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Sr. No</TableCell>
								<TableCell>Phrase</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Translations</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{phrases?.map((phrase, index) => (
								<TableRow key={phrase.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{phrase.phrase}</TableCell>
									<TableCell>{phrase.status}</TableCell>
									<TableCell>
										<Button
											startIcon={<Translate />}
											onClick={(e) =>
												handleTranslationsClick(e, phrase.translations)
											}
										>
											View Translations ({phrase.translations.length})
										</Button>
									</TableCell>
									<TableCell>
										<IconButton
											onClick={() => {
												setEditId(phrase.id);
												setIsCreateEditFormOpen(true);
											}}
										>
											<Edit />
										</IconButton>
										<IconButton onClick={() => handleDeleteClick(phrase.id)}>
											<Delete />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
						<Popover
							open={open}
							anchorEl={anchorEl}
							onClose={handleClosePopover}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
						>
							<Box p={2} maxWidth={300} maxHeight={400} overflow='auto'>
								<Typography variant='h6' gutterBottom>
									Translations
								</Typography>
								{selectedPhraseTranslations?.map((translation: any) => (
									<Typography key={translation.id} variant='body2' gutterBottom>
										<strong>
											{languages?.find(
												(lang: ILanguage) => lang.code === translation.language
											)?.language || translation.language}
											:
										</strong>{' '}
										{translation.text}
									</Typography>
								))}
							</Box>
						</Popover>

						{/* <TableBody>
							{phrases?.map((phrase, index) => (
								<TableRow key={phrase.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{phrase.phrase}</TableCell>
									<TableCell>{phrase.status}</TableCell>
									<TableCell>
										{Object.values(
											formatPhraseOutput(phrase.translations)
										).join(', ')}
									</TableCell>
									<TableCell>
										<IconButton
											onClick={() => {
												setEditId(phrase.id);
												setIsCreateEditFormOpen(true);
											}}
										>
											<Edit />
										</IconButton>
										<IconButton onClick={() => handleDeleteClick(phrase.id)}>
											<Delete />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody> */}
					</Table>
				</TableContainer>
			</Box>
			<CreateEditPhraseForm
				open={isCreateEditFormOpen}
				editId={editId as string | undefined}
				onClose={handleCloseCreateForm}
				onSuccess={onCreateEditSuccess}
			/>
			<Dialog
				open={deleteDialogOpen}
				onClose={handleDeleteCancel}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>{'Confirm Deletion'}</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						Are you sure you want to delete this phrase? This action cannot be
						undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteCancel}>Cancel</Button>
					<Button onClick={handleDeleteConfirm} autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

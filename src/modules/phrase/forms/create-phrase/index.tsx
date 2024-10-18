'use client';
import { api } from '@/api';
import { ILanguage } from '@/modules/types/phrase';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Close } from '@mui/icons-material';
import Delete from '@mui/icons-material/Delete';
import {
	Autocomplete,
	Box,
	Button,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	TextField,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLanguages } from '../../queries/use-languages';
import { usePhrase } from '../../queries/use-phrase';
import { CreatePhraseSchema, PhraseStatus, UpdatePhraseSchema } from './schema';

interface CreatePhraseFormProps {
	open: boolean;
	onClose: () => void;
	editId?: string;
	onSuccess: () => void;
}

const modalStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 600,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	maxHeight: '90vh',
	overflowY: 'auto',
};

export const CreateEditPhraseForm = ({
	open,
	onClose,
	editId,
	onSuccess,
}: CreatePhraseFormProps) => {
	const [removedTranslationIds, setRemovedTranslationIds] = useState<
		string[] | null
	>(null);

	const [isEditMode, setIsEditMode] = useState(false);

	const schema = isEditMode ? UpdatePhraseSchema : CreatePhraseSchema;
	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
		setValue,
	} = useForm<CreatePhraseSchema | UpdatePhraseSchema>({
		resolver: zodResolver(schema),
		defaultValues: {
			phrase: '',
			status: 'active',
			translations: [{ language: '', text: '' }],
		},
	});

	const { phrase, isLoading, refetchPhrase } = usePhrase(editId as string);

	const handleClose = () => onClose();

	const translations = watch('translations');

	const addTranslation = () => {
		setValue('translations', [...translations, { language: '', text: '' }]);
	};

	const removeTranslation = (index: number, id?: string) => {
		if (editId && id) {
			setRemovedTranslationIds((prev) => [...(prev || []), id]);
		}
		setValue(
			'translations',
			translations.filter((_, i) => i !== index)
		);
	};

	const deleteTranslationsMutation = useMutation({
		mutationFn: (ids: string[]) => api.phrase.deleteTranslations(ids),
		onSuccess: () => {
			toast.success('Translations deleted successfully');
		},
		onError: (error) => {
			toast.error('Failed to delete translations');
		},
	});

	useEffect(() => {
		console.log('edit id', editId);
		setIsEditMode(!!editId);
	}, [editId]);

	useEffect(() => {
		if (isEditMode && phrase) {
			reset({
				id: phrase.id,
				phrase: phrase.phrase,
				status: phrase.status as PhraseStatus,
				translations: phrase.translations,
			});
		} else {
			reset({
				phrase: '',
				status: 'active',
				translations: [{ language: '', text: '' }],
			});
		}
	}, [phrase, isEditMode, reset]);

	const createPhraseMutation = useMutation({
		mutationFn: (data: CreatePhraseSchema) => api.phrase.create(data),
		onSuccess: () => {
			toast.success('Phrase created successfully');
			onSuccess();
			handleClose();
		},
		onError: (error) => {
			toast.error('Failed to create phrase');
		},
	});

	const updatePhraseMutation = useMutation({
		mutationFn: (data: UpdatePhraseSchema) => api.phrase.update(data.id, data),
		onSuccess: () => {
			toast.success('Phrase updated successfully');
			onSuccess();
			refetchPhrase();
			handleClose();
		},
		onError: (error) => {
			toast.error('Failed to update phrase');
		},
	});

	const { languages, isLoadingLanguages } = useLanguages();

	const onSubmit = (data: CreatePhraseSchema | UpdatePhraseSchema) => {
		console.log('edit id', editId);
		if (editId) {
			if (removedTranslationIds && removedTranslationIds.length > 0) {
				deleteTranslationsMutation.mutate(removedTranslationIds, {
					onSuccess: () => {
						updatePhraseMutation.mutate(data as UpdatePhraseSchema);
					},
					onError: (error) => {
						toast.error('Failed to delete translations');
					},
				});
			} else {
				updatePhraseMutation.mutate(data as UpdatePhraseSchema);
			}
		} else {
			createPhraseMutation.mutate(data);
		}
	};

	console.log('form errors', errors);

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={modalStyle}>
				<Box display='flex' justifyContent='flex-end'>
					<IconButton
						disabled={
							createPhraseMutation.isPending || updatePhraseMutation.isPending
						}
						onClick={handleClose}
					>
						<Close />
					</IconButton>
				</Box>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Controller
						name='phrase'
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								fullWidth
								label='Phrase'
								error={!!errors.phrase}
								helperText={errors.phrase?.message}
								margin='normal'
							/>
						)}
					/>
					<Controller
						name='status'
						control={control}
						render={({ field }) => (
							<FormControl fullWidth margin='normal'>
								<InputLabel>Status</InputLabel>
								<Select {...field} label='Status'>
									<MenuItem value='active'>Active</MenuItem>
									<MenuItem value='pending'>Pending</MenuItem>
									<MenuItem value='spam'>Spam</MenuItem>
								</Select>
							</FormControl>
						)}
					/>
					{translations.map((translation, index) => (
						<Box key={index} display='flex' alignItems='center' mt={2}>
							<Controller
								name={`translations.${index}.language`}
								control={control}
								render={({ field }) => (
									<Autocomplete
										{...field}
										options={languages as ILanguage[]}
										getOptionLabel={(option: any) =>
											typeof option === 'string'
												? languages?.find((lang: any) => lang.code === option)
														?.language || option
												: `${option.language} (${option.code})`
										}
										renderInput={(params) => (
											<TextField
												{...params}
												label='Language'
												error={!!errors.translations?.[index]?.language}
												helperText={
													errors.translations?.[index]?.language?.message
												}
											/>
										)}
										onChange={(_, newValue: any) =>
											field.onChange(newValue ? newValue.code : '')
										}
										value={field.value}
										disabled={!!editId && !!translation.id}
										sx={{ mr: 1, flexGrow: 1 }}
										isOptionEqualToValue={(option: any, value: any) =>
											option.code === value || option.code === value?.code
										}
									/>
								)}
							/>
							<Controller
								name={`translations.${index}.text`}
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Translation'
										error={!!errors.translations?.[index]?.text}
										helperText={errors.translations?.[index]?.text?.message}
										sx={{ mr: 1, flexGrow: 1 }}
									/>
								)}
							/>
							<IconButton
								onClick={() => removeTranslation(index, translation.id)}
								disabled={translations.length <= 1}
							>
								<Delete />
							</IconButton>
						</Box>
					))}

					{/* {translations.map((translation, index) => (
						<Box key={index} display='flex' alignItems='center' mt={2}>
							<Controller
								name={`translations.${index}.language`}
								control={control}
								render={({ field }) => (
									<Autocomplete
										{...field}
										options={languages as any}
										getOptionLabel={(option) =>
											typeof option === 'string'
												? option
												: `${option.name} (${option.code})`
										}
										renderInput={(params) => (
											<TextField
												{...params}
												label='Language'
												error={!!errors.translations?.[index]?.language}
												helperText={
													errors.translations?.[index]?.language?.message
												}
											/>
										)}
										onChange={(_, newValue) =>
											field.onChange(newValue ? newValue.code : '')
										}
										value={
											languages?.find(
												(lang: any) => lang.code === field.value
											) || null
										}
										disabled={!!editId && !!translation.id}
										sx={{ mr: 1, flexGrow: 1 }}
										isOptionEqualToValue={(option, value) =>
											option.code === value || option.code === value?.code
										}
									/>
								)}
							/>
							<Controller
								name={`translations.${index}.text`}
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label='Translation'
										error={!!errors.translations?.[index]?.text}
										helperText={errors.translations?.[index]?.text?.message}
										sx={{ mr: 1, flexGrow: 1 }}
									/>
								)}
							/>
							<IconButton
								onClick={() => removeTranslation(index, translation.id)}
								disabled={translations.length <= 1}
							>
								<Delete />
							</IconButton>
						</Box>
					))} */}

					<Button startIcon={<Add />} onClick={addTranslation} sx={{ mt: 2 }}>
						Add Translation
					</Button>
					<Button
						type='submit'
						variant='contained'
						color='primary'
						className='disabled:opacity-50 disabled:cursor-not-allowed'
						disabled={
							createPhraseMutation.isPending || updatePhraseMutation.isPending
						}
						fullWidth
						sx={{ mt: 2 }}
					>
						{editId ? 'Update Phrase' : 'Create Phrase'}
					</Button>
				</form>
			</Box>
		</Modal>
	);
};

import { useForm } from "@tanstack/react-form";
import type { FormEvent } from "react";
import { Button } from "@/presentation/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/presentation/components/ui/dialog";
import {
	Field,
	FieldGroup,
	FieldLabel,
} from "@/presentation/components/ui/field";
import { Input } from "@/presentation/components/ui/input";
import {
	type CreateClientDTO,
	CreateClientSchema,
} from "../validation/create-client.validation";

export const CreateClient = () => {
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
		} satisfies CreateClientDTO as CreateClientDTO,
		validators: {
			onSubmit: CreateClientSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				console.log(value);
			} catch (error) {
				console.error(error);
			}
		},
		onSubmitInvalid: ({ value }) => {
			console.log("Form submission failed with errors:", value);
		},
	});
	const submitForm = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		event.stopPropagation();
		await form.handleSubmit();
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button type="button" variant="default">
					Create a Client
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<form onSubmit={submitForm}>
					<FieldGroup>
						<DialogHeader>
							<DialogTitle>Create a Client</DialogTitle>
						</DialogHeader>
						<DialogDescription></DialogDescription>
						<div className="grid gap-4">
							<form.Field name="name">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid} className="grid gap-1">
											<FieldLabel htmlFor={field.name}>Name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												placeholder="Insert Person name"
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												className={isInvalid ? "border-red-500" : ""}
											/>
										</Field>
									);
								}}
							</form.Field>
							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid} className="grid gap-1">
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												value={field.state.value}
												placeholder="Insert Person email"
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
												className={isInvalid ? "border-red-500" : ""}
											/>
										</Field>
									);
								}}
							</form.Field>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button">Cancel</Button>
							</DialogClose>
							<Button type="submit">Create</Button>
						</DialogFooter>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
};

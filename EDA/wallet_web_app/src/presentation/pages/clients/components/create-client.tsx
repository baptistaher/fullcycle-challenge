import { Button } from "@/presentation/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/presentation/components/ui/dialog";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";

export const CreateClient = () => {
	return (
		<Dialog>
			<form>
				<DialogTrigger>
					<Button type="button" variant="default">
						Create a Client
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>Create a Client</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4">
						<div className="grid gap-3">
							<Label htmlFor="clientName">Name</Label>
							<Input id="nameName" placeholder="Insert Person name" />
						</div>
						<div className="grid gap-3">
							<Label htmlFor="clientEmail">Email</Label>
							<Input id="clientEmail" placeholder="Insert Person email" />
						</div>
					</div>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button">Cancel</Button>
						</DialogClose>
						<Button type="submit">Create</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};

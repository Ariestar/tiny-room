"use client";

import { useState } from "react";
import { Card, Input, Button } from "@/components/ui";
import type { User } from "next-auth";

interface SettingsFormProps {
	user: User;
}

export const SettingsForm = ({ user }: SettingsFormProps) => {
	const [name, setName] = useState(user.name || "");
	const [email, setEmail] = useState(user.email || "");

	const handleSave = () => {
		console.log("Saving user info:", { name, email });
		// Here you would typically call an API to update the user's information
	};

	return (
		<Card>
			<div className='p-6'>
				<h2 className='text-xl font-semibold mb-4'>Personal Information</h2>
				<div className='space-y-4'>
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-muted-foreground mb-1'
						>
							Name
						</label>
						<Input
							id='name'
							type='text'
							value={name}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setName(e.target.value)
							}
							className='w-full'
						/>
					</div>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-muted-foreground mb-1'
						>
							Email
						</label>
						<Input
							id='email'
							type='email'
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setEmail(e.target.value)
							}
							className='w-full'
							disabled // Email is usually not editable
						/>
					</div>
				</div>
				<div className='mt-6 flex justify-end'>
					<Button onClick={handleSave}>Save Changes</Button>
				</div>
			</div>
		</Card>
	);
};

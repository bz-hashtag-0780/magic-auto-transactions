'use client';

import { useState } from 'react';
import { useMagic } from '@/context/MagicContext';
import { saveToken } from '@/utils/common';
import { RPCError, RPCErrorCode } from 'magic-sdk';

export default function EmailOTP() {
	const { magic, token, setToken } = useMagic();
	const [email, setEmail] = useState('');
	const [isLoginInProgress, setLoginInProgress] = useState(false);
	const [emailError, setEmailError] = useState(false);

	const handleEmailSubmit = async () => {
		console.log('handleEmailSubmit');
		const emailRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

		if (!email.match(emailRegex)) {
			setEmailError(true);
			return;
		}
		setEmailError(false);

		try {
			console.log('try');
			setLoginInProgress(true);
			const token = await magic?.auth.loginWithEmailOTP({ email });
			if (token) {
				saveToken(token, setToken, 'EMAIL');
				setEmail('');
			}
		} catch (e) {
			console.error('Login error:', e);
			if (e instanceof RPCError) {
				switch (e.code) {
					case RPCErrorCode.MagicLinkFailedVerification:
					case RPCErrorCode.MagicLinkExpired:
					case RPCErrorCode.MagicLinkRateLimited:
					case RPCErrorCode.UserAlreadyLoggedIn:
						break;
					default:
						console.log(
							'Something went wrong. Please try again.',
							e
						);
				}
			} else {
				console.log('Unexpected error. Please try again.', e);
			}
		} finally {
			setLoginInProgress(false);
		}
	};

	return (
		<div className="sm:max-w-md text-black bg-white">
			<div>
				<div>Enter your email to receive a verification code.</div>
			</div>

			<div className="space-y-4">
				<input
					placeholder={
						token.length > 0
							? 'Already logged in'
							: 'example@gmail.com'
					}
					value={email}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						if (emailError) setEmailError(false);
						setEmail(e.target.value);
					}}
					className="text-black bg-white"
				/>
				{emailError && (
					<span className="self-start text-xs font-semibold text-red-700">
						Enter a valid email address
					</span>
				)}
				<button
					className="w-full bg-black text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
					disabled={isLoginInProgress || email.length === 0}
					onClick={handleEmailSubmit}
				>
					{isLoginInProgress ? <div>loading</div> : 'Send Code'}
				</button>
			</div>
			{token.length > 0 && <div>logged in</div>}
		</div>
	);
}

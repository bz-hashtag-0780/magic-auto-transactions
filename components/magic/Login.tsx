import EmailOTP from '@/components/magic/auth/EmailOTP';

const Login = () => {
	return (
		<div className="login-page">
			<div
				className={`max-w-[100%] grid grid-cols-1 grid-flow-row auto-rows-fr gap-5 p-4 mt-8`}
			>
				<EmailOTP />
			</div>
		</div>
	);
};

export default Login;

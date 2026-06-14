import {
	getAuthTokenPair,
	isAuthConfigurationError,
} from '@/app/api/utils/authJwt';

function buildPostMessageResponse(message, status = 200) {
	return new Response(
		`
		<html>
			<body>
				<script>
					window.parent.postMessage(${JSON.stringify(message)}, '*');
				</script>
			</body>
		</html>
		`,
		{
			status,
			headers: {
				'Content-Type': 'text/html',
			},
		}
	);
}

export async function GET(request) {
	try {
		const { token, jwt } = await getAuthTokenPair(request);

		if (!jwt) {
			return buildPostMessageResponse(
				{ type: 'AUTH_ERROR', error: 'Unauthorized' },
				401
			);
		}

		if (!token || typeof token !== 'string') {
			throw new Error('Authenticated session is missing a raw token');
		}

		const message = {
			type: 'AUTH_SUCCESS',
			jwt: token,
			user: {
				id: jwt.sub,
				email: jwt.email,
				name: jwt.name,
			},
		};

		return buildPostMessageResponse(message);
	} catch (error) {
		console.error('Expo web auth callback error:', error);
		const message = isAuthConfigurationError(error)
			? 'Authentication is temporarily unavailable. Server auth secret is not configured.'
			: 'Internal server error';
		const status = isAuthConfigurationError(error) ? 503 : 500;

		return buildPostMessageResponse(
			{ type: 'AUTH_ERROR', error: message },
			status
		);
	}
}

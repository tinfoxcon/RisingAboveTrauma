import { getContext } from 'hono/context-storage';
import { getAuthTokenPair } from '@/app/api/utils/authJwt';

export default function CreateAuth() {
	const auth = async () => {
		const c = getContext();
		const { jwt } = await getAuthTokenPair(c.req.raw);
		if (jwt) {
			return {
				user: {
					id: jwt.sub,
					email: jwt.email,
					name: jwt.name,
					image: jwt.picture,
				},
				expires: jwt.exp ? jwt.exp.toString() : '',
			};
		}
	};
	return {
		auth,
	};
}

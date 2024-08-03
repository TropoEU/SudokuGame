import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
	user?: any; // You can replace 'any' with a specific user type if you have one
}

const authenticate = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	console.log(req.header('Authorization'));
	const token = req.header('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return res.status(401).json({ error: 'No token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: string;
		};
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ error: 'Invalid token' });
	}
};

export default authenticate;
export { AuthenticatedRequest };

import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwt_secret = 'secret';
const prisma = new PrismaClient();

export interface RequestWithUser extends Request {
  userId?: number;
  user: User | null;
}

const generateToken = (userId: Number) => {
  const token = jwt.sign({ userId }, jwt_secret, { expiresIn: '3h' });
  return token;
};

const verifyToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, jwt_secret as string) as JwtPayload;
    (req as RequestWithUser).userId = decoded.userId;

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId
      }
    });
    (req as RequestWithUser).user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Please Authenticate' });
  }
};

export default { generateToken, verifyToken };

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import wrapper from '../helpers/wrapper';
import jwtAuth, { RequestWithUser } from '../middlewares/jwtAuth';
import { uploadImageKit } from '../middlewares/upload';

const prisma = new PrismaClient();

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return wrapper.errorResponse(res, user, "username and password didn't match with our record", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return wrapper.errorResponse(res, user, "username and password didn't match with our record", 404);
    }

    const token = jwtAuth.generateToken(user.id);
    const result = wrapper.data({ user, token });

    return wrapper.response(res, 'success', result, 'Success Login', 200);
  } catch (error) {
    return wrapper.errorResponse(res, error, 'Failed to login', 500);
  }
};

const register = async (req: Request, res: Response) => {
  const { nama_user, email, password, role } = req.body;
  const file = req.file;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return wrapper.errorResponse(res, existingUser, 'User with this email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let imageUpload = null;
    if (file) {
      imageUpload = await uploadImageKit(file);
    }

    const user = await prisma.user.create({
      data: {
        nama_user,
        foto_id: imageUpload ? imageUpload.fileId : '',
        foto_url: imageUpload ? imageUpload.url : '',
        email,
        password: hashedPassword,
        role
      }
    });
    if (!user) {
      return wrapper.errorResponse(res, user, 'Failed to register user');
    }

    const token = jwtAuth.generateToken(user.id);
    const result = wrapper.data({ user, token });

    return wrapper.response(res, 'success', result, 'Success register', 201);
  } catch (error) {
    return wrapper.errorResponse(res, error, 'Error register', 500);
  }
};

const getUser = async (req: RequestWithUser, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return wrapper.errorResponse(res, null, 'token not provided', 500);
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });
    const result = {
      data: {
        user
      }
    };
    return wrapper.response(res, 'success', result, 'Success get User Auth', 201);
  } catch (error) {
    return wrapper.errorResponse(res, error, 'Error get user Auth', 500);
  }
};

export default { login, register, getUser };

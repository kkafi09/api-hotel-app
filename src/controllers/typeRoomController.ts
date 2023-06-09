const { PrismaClient } = require('@prisma/client');
import { Tipe_Kamar } from '@prisma/client';
import { Request, Response } from 'express';
import wrapper from '../helpers/wrapper';
import { imagekit, uploadImageKit } from '../middlewares/upload';

const prisma = new PrismaClient();

const getTypes = async (_req: Request, res: Response) => {
  try {
    const getTypeRooms: Tipe_Kamar[] = await prisma.Tipe_Kamar.findMany();
    const result = wrapper.data(getTypeRooms);

    if (!getTypeRooms) {
      return wrapper.errorResponse(res, getTypeRooms, 'Type rooms not found', 404);
    }

    return wrapper.response(res, 'success', result, 'Success getting type rooms', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error getting type rooms');
  }
};

const getTypeById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const getTypeRoom = await prisma.Tipe_Kamar.findUnique({
      where: {
        id_tipe_kamar: Number(id)
      }
    });
    const result = wrapper.data(getTypeRoom);

    if (!getTypeRoom) {
      return wrapper.errorResponse(res, getTypeRoom, 'Type room not found', 404);
    }

    return wrapper.response(res, 'success', result, 'Success getting room by id', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error getting room by id');
  }
};

const createType = async (req: Request, res: Response) => {
  const { nama_tipe_kamar, harga, deskripsi } = req.body;
  const file = req.file;

  try {
    const checkType = await prisma.Tipe_Kamar.findFirst({
      where: {
        nama_tipe_kamar
      }
    });
    if (checkType) {
      return wrapper.errorResponse(res, checkType, 'Type already exists', 400);
    }

    if (Number(harga) <= 0) {
      return wrapper.errorResponse(res, Number(harga), 'The price must be valid', 400);
    }

    if (!file) {
      return wrapper.errorResponse(res, file, 'No file uploaded', 400);
    }

    const imageUrl = await uploadImageKit(file, 'type');

    const createType = await prisma.Tipe_Kamar.create({
      data: {
        nama_tipe_kamar,
        harga: Number(harga),
        deskripsi,
        foto_id: imageUrl.fileId,
        foto_url: imageUrl.url
      }
    });
    if (!createType) {
      return wrapper.errorResponse(res, createType, 'Failed to create type', 400);
    }

    const result = wrapper.data(createType);

    return wrapper.response(res, 'success', result, 'Success create type room', 200);
  } catch (err) {
    console.log('err', err);
    return wrapper.errorResponse(res, err, 'Error create type room');
  }
};

const updateType = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { harga, ...payload } = req.body;
  const file = req.file;

  try {
    const getType = await prisma.Tipe_Kamar.findUnique({
      where: {
        id_tipe_kamar: Number(id)
      }
    });
    if (!getType) {
      return wrapper.errorResponse(res, getType, 'Type room not found', 404);
    }

    if (!harga && Number(harga) < 0) {
      return wrapper.errorResponse(res, harga, 'The price must be valid', 400);
    }

    let imageUrl = null;
    if (file) {
      imageUrl = await uploadImageKit(file, 'type');

      try {
        await imagekit.deleteFile(getType.foto_id);
      } catch (error) {
        return wrapper.errorResponse(res, error, 'Failed to delete file from imagekit', 400);
      }
    }

    const updateType = await prisma.Tipe_Kamar.update({
      where: {
        id_tipe_kamar: parseInt(id)
      },
      data: {
        nama_tipe_kamar: payload.nama_tipe_kamar ? payload.nama_tipe_kamar : getType.nama_tipe_kamar,
        foto_id: imageUrl ? imageUrl.fileId : getType.foto_id,
        foto_url: imageUrl ? imageUrl.url : getType.foto_url,
        deskripsi: payload.deskripsi ? payload.deskripsi : getType.deskripsi,
        harga: payload.harga ? Number(payload.harga) : getType.harga
      }
    });
    if (!updateType) {
      return wrapper.errorResponse(res, updateType, 'Failed to update type room', 400);
    }

    const result = wrapper.data(updateType);

    return wrapper.response(res, 'success', result, 'Success update type room', 200);
  } catch (err) {
    console.log('err', err);
    return wrapper.errorResponse(res, err, 'Error update type room');
  }
};

const deleteType = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const getType = await prisma.Tipe_Kamar.findUnique({
      where: {
        id_tipe_kamar: parseInt(id)
      }
    });
    if (!getType) {
      return wrapper.errorResponse(res, getType, 'failed to find type', 404);
    }

    const deleteType = await prisma.Tipe_Kamar.delete({
      where: {
        id_tipe_kamar: parseInt(id)
      }
    });
    if (!deleteType) {
      return wrapper.errorResponse(res, deleteType, 'Failed to delete type', 400);
    }

    if (getType.foto_id || getType.foto_url) {
      try {
        await imagekit.deleteFile(getType.foto_id);
      } catch (error) {
        return wrapper.errorResponse(res, error, 'Failed to delete file from imagekit', 400);
      }
    }

    const result = wrapper.data(deleteType);

    return wrapper.response(res, 'success', result, 'Success delete type room', 204);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error delete type room');
  }
};

export default {
  getTypes,
  getTypeById,
  createType,
  updateType,
  deleteType
};

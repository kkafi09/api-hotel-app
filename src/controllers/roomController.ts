import { Kamar, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import wrapper from '../helpers/wrapper';

const prisma = new PrismaClient();

const getRooms = async (_req: Request, res: Response) => {
  try {
    const rooms: Kamar[] = await prisma.kamar.findMany();
    const result = wrapper.data(rooms);

    if (!rooms) {
      return wrapper.errorResponse(res, rooms, 'Rooms not found', 404);
    }

    return wrapper.response(res, 'success', result, 'Success getting rooms', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error getting rooms');
  }
};

const getRoomById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const room = await prisma.kamar.findUnique({
      where: {
        id_kamar: parseInt(id)
      }
    });
    const result = wrapper.data(room);

    if (!room) {
      return wrapper.errorResponse(res, result, 'Rooms not found', 404);
    }

    return wrapper.response(res, 'success', result, 'Success getting room', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error getting room');
  }
};

const createRoom = async (req: Request, res: Response) => {
  const { nomor_kamar, id_tipe_kamar, ...payload } = req.body;

  try {
    const findRoom = await prisma.kamar.findUnique({
      where: {
        nomor_kamar: Number(nomor_kamar)
      }
    });
    if (findRoom) {
      return wrapper.errorResponse(res, findRoom, 'Room number already exists', 400);
    }

    const findIdTipeKamar = await prisma.tipe_Kamar.findUnique({
      where: {
        id_tipe_kamar: Number(id_tipe_kamar)
      }
    });
    if (!findIdTipeKamar) {
      return wrapper.errorResponse(res, findIdTipeKamar, 'Type id room not found', 404);
    }

    const createRoom = await prisma.kamar.create({
      data: payload
    });
    if (!createRoom) {
      return wrapper.response(res, 'success', createRoom, 'Room created', 201);
    }

    const result = wrapper.data(createRoom);

    return wrapper.response(res, 'success', result, 'Success create room', 201);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error create room');
  }
};

const updateRoom = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_tipe_kamar, ...payload } = req.body;

  try {
    const findRoom = await prisma.kamar.findUnique({
      where: {
        id_kamar: Number(id)
      }
    });
    if (!findRoom) {
      return wrapper.errorResponse(res, findRoom, 'Room not found', 404);
    }

    const findIdTipeKamar = await prisma.tipe_Kamar.findUnique({
      where: {
        id_tipe_kamar: Number(id_tipe_kamar)
      }
    });
    if (!findIdTipeKamar) {
      return wrapper.errorResponse(res, findIdTipeKamar, 'Type room id not found', 404);
    }

    const updateRoom = await prisma.kamar.update({
      where: {
        id_kamar: parseInt(id)
      },
      data: payload
    });
    if (!updateRoom) {
      return wrapper.errorResponse(res, updateRoom, 'Failed to update room', 400);
    }

    const result = wrapper.data(updateRoom);

    return wrapper.response(res, 'success', result, 'Success update room', 201);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error update room');
  }
};

const deleteRoom = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const findRoom = await prisma.kamar.findUnique({
      where: {
        id_kamar: Number(id)
      }
    });
    if (!findRoom) {
      return res.status(404).json({ success: false, message: 'Data not found', data: [] });
    }

    const deleteRoom = await prisma.kamar.delete({
      where: {
        id_kamar: Number(id)
      }
    });
    if (!deleteRoom) {
      return res.status(400).json({ success: false, message: 'Failed to update data', data: [] });
    }

    const result = wrapper.data(deleteRoom);

    return wrapper.response(res, 'success', result, 'Success delete room', 204);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error delete room');
  }
};

export default {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom
};

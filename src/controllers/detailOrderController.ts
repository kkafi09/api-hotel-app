import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import wrapper from '../helpers/wrapper';

const prisma = new PrismaClient();

const getDetails = async (req: Request, res: Response) => {
  try {
    const details = await prisma.detail_Pemesanan.findMany({
      include: {
        pemesanan: true,
        kamar: true
      }
    });

    const result = wrapper.data(details);

    return wrapper.response(res, 'success', result, 'Success getting details');
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error getting details');
  }
};

const getDetailById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const detail = await prisma.detail_Pemesanan.findUnique({
      where: {
        id_detail_pemesanan: Number(id)
      },
      include: {
        pemesanan: true,
        kamar: true
      }
    });

    if (!detail) {
      return wrapper.errorResponse(res, detail, 'Detail not found', 404);
    }

    const result = wrapper.data(detail);

    return wrapper.response(res, 'success', result, 'Success getting detail');
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error getting detail');
  }
};

const updateDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id_pemesanan, id_kamar, tgl_akses, harga } = req.body;

  try {
    const findDetail = await prisma.detail_Pemesanan.findUnique({
      where: {
        id_detail_pemesanan: Number(id)
      },
      include: {
        pemesanan: true,
        kamar: true
      }
    });

    if (!findDetail) {
      return wrapper.errorResponse(res, findDetail, 'Detail not found', 404);
    }

    const updatedDetail = await prisma.detail_Pemesanan.update({
      where: {
        id_detail_pemesanan: Number(id)
      },
      data: {
        id_pemesanan,
        id_kamar,
        tgl_akses,
        harga
      },
      include: {
        pemesanan: true,
        kamar: true
      }
    });

    const result = wrapper.data(updatedDetail);

    return wrapper.response(res, 'success', result, 'Success update detail');
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error update detail');
  }
};

const deleteDetail = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const detail = await prisma.detail_Pemesanan.delete({
      where: {
        id_detail_pemesanan: Number(id)
      }
    });

    const result = wrapper.data(detail);

    return wrapper.response(res, 'success', result, 'Success delete detail', 204);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error delete detail');
  }
};

export default {
  getDetails,
  getDetailById,
  updateDetail,
  deleteDetail
};

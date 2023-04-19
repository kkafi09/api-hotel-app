import { Pemesanan, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import moment from 'moment';
import shortid from 'shortid';
import { v4 as uuidv4 } from 'uuid';
import wrapper from '../helpers/wrapper';

const prisma = new PrismaClient();

const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders: Pemesanan[] = await prisma.pemesanan.findMany();
    const result = wrapper.data(orders);

    if (!orders) {
      return wrapper.errorResponse(res, orders, 'order not found', 404);
    }

    return wrapper.response(res, 'success', result, 'Success getting order', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error getting order');
  }
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await prisma.pemesanan.findUnique({
      where: {
        id_pemesanan: parseInt(id)
      },
      include: {
        detail_pemesanan: true,
        kamar: true
      }
    });
    const result = wrapper.data(order);
    if (!order) {
      return wrapper.errorResponse(res, result, 'order not found', 404);
    }

    return wrapper.response(res, 'success', result, 'Success getting order', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error getting order');
  }
};

const createOrder = async (req: Request, res: Response) => {
  const {
    nama_pemesan,
    email_pemesan,
    tgl_pemesanan,
    tgl_check_in,
    tgl_check_out,
    nama_tamu,
    jumlah_kamar,
    id_tipe_kamar,
    id_user,
    detail_pemesanan
  } = req.body;
  const order_id = 'HTL' + shortid.generate();
  const uuid = uuidv4();

  const parsedTglPemesanan = moment(tgl_pemesanan).toDate();
  const parsedTglCheckIn = moment(tgl_check_in).toDate();
  const parsedTglCheckOut = moment(tgl_check_out).toDate();

  try {
    const newOrder = await prisma.pemesanan.create({
      data: {
        nama_pemesan,
        nomor_pemesanan: order_id,
        uuid: uuid,
        email_pemesan,
        tgl_pemesanan: parsedTglPemesanan,
        tgl_check_in: parsedTglCheckIn,
        tgl_check_out: parsedTglCheckOut,
        nama_tamu,
        jumlah_kamar,
        id_tipe_kamar,
        status_kamar: 'BARU',
        id_user,
        detail_pemesanan: {
          create: detail_pemesanan.map((detail: any) => ({
            tgl_akses: detail.tgl_akses,
            harga: detail.harga,
            kamar: {
              connect: { id_kamar: detail.id_kamar }
            }
          }))
        }
      },
      include: {
        detail_pemesanan: {
          include: {
            kamar: true
          }
        }
      }
    });

    const result = wrapper.data(newOrder);

    return wrapper.response(res, 'success', result, 'Success getting order', 201);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error getting order');
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status_kamar } = req.body;

  try {
    const findOrder = await prisma.pemesanan.findUnique({
      where: {
        id_pemesanan: Number(id)
      },
      include: {
        detail_pemesanan: {
          include: {
            kamar: true
          }
        }
      }
    });

    if (!findOrder) {
      return wrapper.errorResponse(res, null, 'Order not found', 404);
    }

    const updatedOrder = await prisma.pemesanan.update({
      where: {
        id_pemesanan: Number(id)
      },
      data: {
        status_kamar
      },
      include: {
        detail_pemesanan: {
          include: {
            kamar: true
          }
        }
      }
    });

    const result = wrapper.data(updatedOrder);
    return wrapper.response(res, 'success', result, 'Success updating order');
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error updating order');
  }
};

const updateOrderAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    nama_pemesan,
    email_pemesan,
    tgl_pemesanan,
    tgl_check_in,
    tgl_check_out,
    nama_tamu,
    jumlah_kamar,
    id_tipe_kamar,
    id_user,
    detail_pemesanan
  } = req.body;

  const parsedTglPemesanan = moment(tgl_pemesanan).toDate();
  const parsedTglCheckIn = moment(tgl_check_in).toDate();
  const parsedTglCheckOut = moment(tgl_check_out).toDate();

  try {
    const findOrder = await prisma.pemesanan.findUnique({
      where: {
        id_pemesanan: Number(id)
      },
      include: {
        detail_pemesanan: true
      }
    });

    if (!findOrder) {
      return wrapper.errorResponse(res, null, 'Order not found', 404);
    }

    const updatedOrder = await prisma.pemesanan.update({
      where: {
        id_pemesanan: Number(id)
      },
      data: {
        nama_pemesan,
        email_pemesan,
        tgl_pemesanan: parsedTglPemesanan,
        tgl_check_in: parsedTglCheckIn,
        tgl_check_out: parsedTglCheckOut,
        nama_tamu,
        jumlah_kamar,
        id_tipe_kamar,
        status_kamar: 'BARU',
        id_user,
        detail_pemesanan: {
          deleteMany: findOrder.detail_pemesanan.map((detail) => ({
            id_detail_pemesanan: detail.id_detail_pemesanan
          })),
          create: detail_pemesanan.map((detail: any) => ({
            tgl_akses: detail.tgl_akses,
            harga: detail.harga,
            kamar: {
              connect: { id_kamar: detail.id_kamar }
            }
          }))
        }
      },
      include: {
        detail_pemesanan: {
          include: {
            kamar: true
          }
        }
      }
    });

    const result = wrapper.data(updatedOrder);

    return wrapper.response(res, 'success', result, 'Success updating order', 200);
  } catch (err) {
    return wrapper.errorResponse(res, err, 'Error updating order');
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await prisma.pemesanan.findUnique({
      where: { id_pemesanan: Number(id) },
      include: { detail_pemesanan: true }
    });
    if (!order) {
      return wrapper.errorResponse(res, null, 'Order not found', 404);
    }

    const deletedDetailOrders = await prisma.detail_Pemesanan.deleteMany({
      where: { id_pemesanan: Number(id) }
    });
    const deletedOrder = await prisma.pemesanan.delete({
      where: { id_pemesanan: Number(id) }
    });

    const result = wrapper.data({ deletedOrder, deletedDetailOrders });

    return wrapper.response(res, 'success', result, 'Order deleted successfully', 204);
  } catch (error) {
    return wrapper.errorResponse(res, error, 'Error deleting order');
  }
};

export default {
  getOrders,
  getOrderById,
  createOrder,
  deleteOrder,
  updateOrder,
  updateOrderAdmin
};

const prisma = require("../db");

const findTrackerDatas = async (id) => {
  const trackerDatas = await prisma.trackerData.findMany({
    where: {
      userId: id
    },
  });

  return trackerDatas;
};

const findTrackerDataById = async (id) => {
  const trackerData = await prisma.trackerData.findUnique({
    where: {
      id,
    },
  });

  return trackerData;
};

const createTrackerData = async (data) => {
  const trackerData = await prisma.trackerData.create({
    data: {
      date: data.date,
      name: data.name,
      nominal: parseInt(data.nominal),
      type: data.type,
      category: data.category,
      user: {
        connect: { id: data.userId },
      },
    },
  });
  return trackerData;
};

const deleteTrackerData = async (id) => {
  await prisma.trackerData.delete({
    where: {
      id,
    },
  });
};

const editTrackerData = async (id, data) => {
  const trackerData = await prisma.trackerData.update({
    where: {
      id: parseInt(id),
    },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
    },
  });

  return trackerData;
};

module.exports = {
  findTrackerDatas,
  findTrackerDataById,
  createTrackerData,
  deleteTrackerData,
  editTrackerData,
};

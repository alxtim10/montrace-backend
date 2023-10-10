const { findUserByRefreshToken } = require("../users/users.repository");
const {
  findTrackerDatas,
  findTrackerDataById,
  createTrackerData,
  deleteTrackerData,
  editTrackerData,
} = require("./tracker.repository");

const getAllTrackerData = async (refreshToken) => {

  const user = await findUserByRefreshToken(refreshToken);

  const trackerDatas = await findTrackerDatas(user.id);

  return trackerDatas;
};

const getTrackerDataById = async (id) => {
  const trackerData = await findTrackerDataById(id);

  if (!trackerData) {
    throw Error("Tracker Data Not Found.");
  }

  return trackerData;
};

const insertTrackerData = async (newData) => {
  const trackerData = await createTrackerData(newData);

  return trackerData;
};

const deleteTrackerDataById = async (id) => {
  await getTrackerDataById(id);

  await deleteTrackerData(id);
};

const editTrackerDataById = async (id, newData) => {
  await getTrackerDataById(id);

  const trackerData = await editTrackerData(id, newData);

  return trackerData;
};

module.exports = {
  getAllTrackerData,
  getTrackerDataById,
  insertTrackerData,
  deleteTrackerDataById,
  editTrackerDataById,
};

const express = require("express");
const router = express.Router();
const {
  getAllTrackerData,
  getTrackerDataById,
  insertTrackerData,
  deleteTrackerDataById,
  editTrackerDataById,
} = require("./tracker.service.js");
const verifyToken = require("../middleware/VerifyToken.js");

router.get("/", async (req, res) => {
  const token = req.cookies.refreshToken;
  const trackers = await getAllTrackerData(token)
  res.send(trackers);
});
router.get("/", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await getTrackerDataById(productId);

    res.send(product);
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const product = await insertTrackerData(newProduct);

    res.send({
      data: product,
      message: "Tracker data Created.",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    await deleteTrackerDataById(productId);
    res.send("Tracker data deleted.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.put("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);
  const productData = req.body;

  if (
    !(
      productData.name &&
      productData.description &&
      productData.price &&
      productData.image
    )
  ) {
    return res.status(400).send("Missing fields.");
  }

  try {
    const product = await editTrackerDataById(productId, productData);
    res.send({
      data: product,
      message: "Tracker data edited.",
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productData = req.body;

    const product = await editTrackerDataById(productId, productData);

    res.send({
      data: product,
      message: "Tracker data edited.",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

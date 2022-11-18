const express = require("express");

const ctrl = require("../../controllers/transactions");
const { ctrlWrapper } = require("../../helpers");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/transaction");

const router = express.Router();

router.post("/", authenticate, validateBody(schemas.addSchema), ctrlWrapper(ctrl.add));
router.get("/", authenticate, ctrlWrapper(ctrl.getAll));
router.get("/categories", ctrlWrapper(ctrl.getCategories));

module.exports = router;

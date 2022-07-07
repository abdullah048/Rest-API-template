const express = require("express");
const mongoose = require("mongoose");
const BodyParser = require("body-parser");
const app = express();

mongoose
	.connect("mongodb://localhost:27017/Sample", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to Mongo!");
	})
	.catch((err) => {
		console.log(`Error: ${err}`);
	});

app.use(BodyParser({ extended: false }));
app.use(express.json());

// Creating Product Schema
const productSchema = new mongoose.Schema({
	name: String,
	desc: String,
	price: Number,
});

const Product = new mongoose.model("Product", productSchema);

// Create Product
app.post("/api/v1/product/new", async (req, res) => {
	const product = await Product.create(req.body);
	res.status(201).json({
		success: true,
		product,
	});
});

// Get Products
app.get("/api/v1/products", async (req, res) => {
	const products = await Product.find();
	res.status(200).json({
		success: true,
		products,
	});
});

// Update Product
app.put("/api/v1/product/:id", async (req, res) => {
	let product = Product.findById(req.params.id);

	if (!product) {
		return res.status(500).json({
			success: false,
			message: "Product not found!",
		});
	}

	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		useFindAndModify: false,
		useValidators: true,
	});

	res.status(200).json({
		success: true,
		product,
	});
});

// Delete Product
app.delete("/api/v1/product/:id", async (req, res) => {
	let product = Product.findById(req.params.id);

	if (!product) {
		return res.status(500).json({
			success: false,
			message: "Product not found!",
		});
	}

	product = await Product.findByIdAndDelete(req.params.id);

	res.status(200).json({
		success: true,
		message: "Product Deleted",
	});
});

app.listen(8800, () => {
	console.log("Server Working!");
});

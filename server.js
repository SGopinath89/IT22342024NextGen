const express = require('express');
const dotenv = require('dotenv');
const stripe = require('stripe');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const userRoute = require("./routes/user");

// Load variables
dotenv.config();

// DB connection
mongoose
.connect(process.env.MONGO_URL)
.then(()=> console.log("DB Connection Successfull!"))
.catch((err) => {
    console.log(err);
});

// Start Server
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/users', userRoute);

// Home Route
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

// Success
app.get("/success", (req, res) => {
    res.sendFile("success.html", { root: "public" });
});

// Cancel
app.get("/cancel", (req, res) => {
    res.sendFile("cancel.html", { root: "public" });
});

// Stripe
const stripeGateway = stripe(process.env.stripe_api);
const DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout", async (req, res) => {
    try{
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.productImg]
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });

    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${DOMAIN}/success`,
        cancel_url: `${DOMAIN}/cancel`,
        line_items: lineItems,
        billing_address_collection: "required",
    });
    res.json({ url: session.url });
}catch(error){
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
}
});

app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port 3000")
});

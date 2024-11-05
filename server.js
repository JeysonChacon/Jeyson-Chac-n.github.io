// server.js
const express = require("express");
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51QHVqdEPl0ilYsB6zVMXKauMvKTaM7D9XPFECMdEyeT9WuJJ5gO6DNt4NHtMIXky1SQ0zrItRBLbsNk93P5ULx8M00CJoVZM2s");

const app = express();
app.use(express.static("."));
app.use(express.json());

app.post("/crear-sesion", async (req, res) => {
    const { carrito } = req.body;
    const line_items = carrito.map(item => ({
        price_data: {
            currency: "usd",
            product_data: { name: item.nombre },
            unit_amount: item.precio * 100,
        },
        quantity: 1,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });
        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).send("Error al crear la sesión de pago");
    }
});

app.listen(3000, () => console.log("Servidor iniciado en http://localhost:3000"));

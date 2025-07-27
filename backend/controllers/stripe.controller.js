// controllers/stripe.controller.js
import { stripe } from '../config/stripe.js';

const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:4200';

export const createCheckoutSession = async (req, res) => {
    try {
        const items = req.body.items;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Aucun produit dans le panier.' });
        }

        const line_items = items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.product_name,
                    description: item.product_desc || '',
                },
                unit_amount: Math.round(item.product_price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}/success`,
            cancel_url: `${YOUR_DOMAIN}/cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création de la session Stripe" });
    }
};

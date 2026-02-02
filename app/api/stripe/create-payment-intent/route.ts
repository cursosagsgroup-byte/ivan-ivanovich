import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
    try {
        const { amount, orderId, metadata } = await req.json();

        // Log received amount for debugging
        console.log(`[PaymentIntent] Received amount: ${amount}, Type: ${typeof amount}`);

        // Parse amount just in case it's a string
        const amountVal = typeof amount === 'string' ? parseFloat(amount) : amount;

        if (!amountVal || isNaN(amountVal) || amountVal <= 0) {
            console.error(`[PaymentIntent] Invalid amount: ${amount}`);
            return NextResponse.json({
                error: `Invalid amount received: ${amount} (Type: ${typeof amount})`
            }, { status: 400 });
        }

        // Get Stripe credentials from database
        const stripeConfig = await prisma.paymentConfig.findUnique({
            where: { gateway: 'stripe' },
        });

        if (!stripeConfig || !stripeConfig.enabled || !stripeConfig.secretKey) {
            return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
        }

        // Initialize Stripe
        const stripe = new Stripe(stripeConfig.secretKey, {
            apiVersion: '2025-12-15.clover',
        });

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'mxn',
            metadata: {
                orderId: orderId || '',
                ...metadata,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (error: any) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create payment intent' },
            { status: 500 }
        );
    }
}

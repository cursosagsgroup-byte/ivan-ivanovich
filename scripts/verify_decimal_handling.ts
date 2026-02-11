async function main() {
    console.log('--- Verifying Decimal Handling Logic ---');

    const testCases = [
        { price: 1900, description: "Standard Integer Price" },
        { price: 2500.50, description: "Price with 50 cents" },
        { price: 99.99, description: "Price with 99 cents" },
        { price: 100.0000001, description: "Price with extra precision (floating point error case)" },
        { price: 433.333333, description: "Recurring decimal" }
    ];

    console.log('\n1. Order Total Calculation (Sum of items)');
    // Simulate summing items
    const cartItems = [
        { price: 10.10 },
        { price: 20.20 },
        { price: 30.30 }
    ];
    // In JS: 10.10 + 20.20 + 30.30 = 60.599999999999994
    let jsSum = cartItems.reduce((acc, item) => acc + item.price, 0);
    console.log(`JS Sum (10.10 + 20.20 + 30.30): ${jsSum}`);

    // Simulate what we likely want (2 decimals)
    // Note: The app currently uses `total += course.price` in a loop in `orders/route.ts`
    // We need to check if it does any rounding.


    console.log('\n2. Stripe Cent Conversion (Math.round(amount * 100))');
    testCases.forEach(({ price, description }) => {
        const cents = Math.round(price * 100);
        console.log(`Price: ${price} (${description}) -> Cents: ${cents}`);

        // Reverse verification (Webhook logic)
        const storedAmount = cents / 100;
        console.log(`  Webhook Storage (cents / 100): ${storedAmount}`);

        const isPreserved = Math.abs(storedAmount - Number(price.toFixed(2))) < 0.001;
        console.log(`  Precision Preserved (vs 2 decimals): ${isPreserved ? '✅' : '❌'}`);
    });
}

main();

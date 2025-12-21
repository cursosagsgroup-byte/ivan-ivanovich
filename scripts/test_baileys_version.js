
const { fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');

console.log('Starting version fetch...');
const start = Date.now();

fetchLatestBaileysVersion().then(v => {
    console.log('Fetched version:', v);
    console.log('Time taken:', Date.now() - start, 'ms');
}).catch(e => {
    console.error('Error fetching version:', e);
}).finally(() => {
    process.exit(0);
});

setTimeout(() => {
    console.log('Timeout reached (10s)!');
    process.exit(1);
}, 10000);

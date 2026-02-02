


const API_BASE = 'http://127.0.0.1:3000/api/mobile';

async function main() {
    console.log('Testing Mobile Login...');
    const loginRes = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'prueba@prueba.com',
            password: '051312898'
        })
    });

    if (!loginRes.ok) {
        console.error('Login failed:', await loginRes.text());
        return;
    }

    const loginData: any = await loginRes.json();
    console.log('Login successful. Token received.');
    const token = loginData.token;

    console.log('Testing Fetch Courses...');
    const coursesRes = await fetch(`${API_BASE}/courses`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!coursesRes.ok) {
        console.error('Fetch courses failed:', await coursesRes.text());
        return;
    }

    const coursesData: any = await coursesRes.json();
    console.log(`Fetched ${coursesData.courses.length} courses.`);
    coursesData.courses.forEach((c: any) => {
        console.log(`- ${c.title}`);
        console.log(`  imageUrl: ${c.imageUrl}`);
        console.log(`  certificateUrl: ${c.certificateUrl}`);
    });
}

main().catch(console.error);

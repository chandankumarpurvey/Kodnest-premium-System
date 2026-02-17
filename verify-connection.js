fetch('http://127.0.0.1:5173/dashboard')
    .then(res => {
        console.log('✅ Connection Successful');
        console.log('Status:', res.status);
        return res.text();
    })
    .then(text => {
        console.log('Body length:', text.length);
        if (text.includes('vite')) console.log('✅ Vite Payload Verified');
    })
    .catch(err => console.error('❌ Connection Failed:', err));

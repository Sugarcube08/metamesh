// verify-setup.js
// Quick verification script for MetaMesh Phase 2 setup

const BASE_URL = 'http://localhost:3333';

console.log('🔍 MetaMesh Phase 2 Setup Verification\n');

// Check 1: Backend running
async function checkBackend() {
  try {
    const response = await fetch(`${BASE_URL}/requests`);
    if (response.ok) {
      console.log('✅ Backend is running on port 3333');
      return true;
    }
  } catch (error) {
    console.log('❌ Backend is NOT running');
    console.log('   → Start backend: cd backend && npm start');
    return false;
  }
}

// Check 2: Test endpoint
async function testEndpoint() {
  try {
    const response = await fetch(`${BASE_URL}/issue-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientDID: 'did:test123',
        recipientAddress: 'addr1qx83g9s4qc6katjszpa32pqvwmcqyljzqn374t8ry7jlg8nhvujqyxyt680k4x0y6stqzkcpgedrvuuqf2crn39nm32q5gwcz9',
        amount: '1000000',
        description: 'Verification test',
        issuer: 'MetaMesh'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend endpoint working');
      console.log(`   → Test ID: ${data.id}`);
      console.log(`   → Metadata URI: ${data.metadataURI}`);
      return true;
    } else {
      console.log('❌ Backend endpoint failed');
      const error = await response.text();
      console.log(`   → Error: ${error}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend');
    console.log(`   → Error: ${error.message}`);
    return false;
  }
}

// Check 3: Environment variables
function checkEnv() {
  console.log('\n📋 Environment Check:');
  
  // Note: In browser, these are set via .env.local
  console.log('   → Check .env.local exists in project root');
  console.log('   → NEXT_PUBLIC_CARDANO_NETWORK=Mainnet');
  console.log('   → NEXT_PUBLIC_BACKEND_URL=http://localhost:3333');
}

// Main verification
async function verify() {
  console.log('Step 1: Checking backend...');
  const backendOk = await checkBackend();
  
  if (backendOk) {
    console.log('\nStep 2: Testing endpoint...');
    await testEndpoint();
  }
  
  checkEnv();
  
  console.log('\n📝 Next Steps:');
  console.log('1. Ensure backend is running: cd backend && npm start');
  console.log('2. Ensure frontend is running: npm run dev');
  console.log('3. Open http://localhost:3000/test-mint');
  console.log('4. Follow TEST-COMPLETE-FLOW.md');
  
  console.log('\n✨ Verification complete!');
}

// Run if executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  let fetch;
  if (typeof globalThis.fetch !== 'undefined') {
    fetch = globalThis.fetch;
  } else {
    try {
      fetch = require('node-fetch');
    } catch (e) {
      console.error('❌ Fetch not available. Install node-fetch or use Node.js 18+');
      process.exit(1);
    }
  }
  verify();
} else {
  // Browser environment
  verify();
}


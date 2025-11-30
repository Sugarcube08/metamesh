// backend/test-endpoints.js
// Test script for backend endpoints

// Use built-in fetch (Node 18+) or require node-fetch for older versions
let fetch;
if (typeof globalThis.fetch !== 'undefined') {
  fetch = globalThis.fetch;
} else {
  try {
    fetch = require('node-fetch');
  } catch (e) {
    console.error('❌ Fetch not available. Please use Node.js 18+ or install node-fetch:');
    console.error('   npm install node-fetch');
    process.exit(1);
  }
}

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:3333';

// Example payloads
const examplePayloads = {
  issueRequest: {
    recipientDID: 'did:cardano:test123',
    recipientAddress: 'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk',
    amount: '1000000', // 1 ADA in lovelace
    description: 'Payment for services rendered',
    issuer: 'MetaMesh'
  },
  markIssued: {
    id: '1732920000000', // Replace with actual ID from issue-request response
    txId: 'abc123def456...' // Replace with actual transaction hash
  }
};

// Test functions
async function testIssueRequest() {
  console.log('\n=== Testing POST /issue-request ===');
  try {
    const response = await fetch(`${BASE_URL}/issue-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examplePayloads.issueRequest),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Success!');
      return data.id; // Return ID for use in mark-issued test
    } else {
      console.log('❌ Failed');
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function testGetRequests() {
  console.log('\n=== Testing GET /requests ===');
  try {
    const response = await fetch(`${BASE_URL}/requests`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Success!');
      return data;
    } else {
      console.log('❌ Failed');
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function testMarkIssued(requestId, txId) {
  console.log('\n=== Testing POST /mark-issued ===');
  try {
    const payload = {
      id: requestId || examplePayloads.markIssued.id,
      txId: txId || examplePayloads.markIssued.txId
    };

    const response = await fetch(`${BASE_URL}/mark-issued`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Success!');
      return true;
    } else {
      console.log('❌ Failed');
      return false;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting backend endpoint tests...');
  console.log(`Backend URL: ${BASE_URL}\n`);

  // Test 1: Create issue request
  const requestId = await testIssueRequest();
  
  // Test 2: Get all requests
  await testGetRequests();
  
  // Test 3: Mark as issued (if we got a request ID)
  if (requestId) {
    await testMarkIssued(requestId, 'test_tx_hash_' + Date.now());
    
    // Test 4: Get requests again to see updated status
    console.log('\n=== Verifying updated status ===');
    await testGetRequests();
  }

  console.log('\n✨ Tests completed!');
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testIssueRequest,
  testGetRequests,
  testMarkIssued,
  examplePayloads
};


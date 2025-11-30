#!/bin/bash
# Backend API test examples using curl

BASE_URL="http://localhost:3333"

echo "=== Testing MetaMesh Backend API ===\n"

# Test 1: Create issue request
echo "1. POST /issue-request"
echo "Request:"
cat << EOF
{
  "recipientDID": "did:cardano:test123",
  "recipientAddress": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk",
  "amount": "1000000",
  "description": "Payment for services rendered",
  "issuer": "MetaMesh"
}
EOF

echo "\nResponse:"
curl -X POST "$BASE_URL/issue-request" \
  -H "Content-Type: application/json" \
  -d '{
    "recipientDID": "did:cardano:test123",
    "recipientAddress": "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk",
    "amount": "1000000",
    "description": "Payment for services rendered",
    "issuer": "MetaMesh"
  }' | jq '.'

echo "\n\n=== 2. GET /requests ==="
curl -X GET "$BASE_URL/requests" | jq '.'

echo "\n\n=== 3. POST /mark-issued ==="
echo "Note: Replace ID and txId with actual values from step 1"
curl -X POST "$BASE_URL/mark-issued" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1732920000000",
    "txId": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
  }' | jq '.'

echo "\n\n=== 4. GET /requests (after marking as issued) ==="
curl -X GET "$BASE_URL/requests" | jq '.'


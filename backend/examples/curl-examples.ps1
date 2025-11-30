# Backend API test examples using PowerShell (Invoke-RestMethod)

$BaseUrl = "http://localhost:3333"

Write-Host "=== Testing MetaMesh Backend API ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Create issue request
Write-Host "1. POST /issue-request" -ForegroundColor Yellow
$issueRequestBody = @{
    recipientDID = "did:cardano:test123"
    recipientAddress = "addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj3758qy7se82nag3qer8wqk"
    amount = "1000000"
    description = "Payment for services rendered"
    issuer = "MetaMesh"
} | ConvertTo-Json

Write-Host "Request:" -ForegroundColor Gray
Write-Host $issueRequestBody
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/issue-request" -Method Post -Body $issueRequestBody -ContentType "application/json"
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
    $requestId = $response.id
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    $requestId = $null
}

Write-Host ""

# Test 2: Get all requests
Write-Host "2. GET /requests" -ForegroundColor Yellow
try {
    $requests = Invoke-RestMethod -Uri "$BaseUrl/requests" -Method Get
    Write-Host "Response:" -ForegroundColor Green
    $requests | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Mark as issued (if we have a request ID)
if ($requestId) {
    Write-Host "3. POST /mark-issued" -ForegroundColor Yellow
    $markIssuedBody = @{
        id = $requestId
        txId = "test_tx_hash_$(Get-Date -Format 'yyyyMMddHHmmss')"
    } | ConvertTo-Json

    Write-Host "Request:" -ForegroundColor Gray
    Write-Host $markIssuedBody
    Write-Host ""

    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/mark-issued" -Method Post -Body $markIssuedBody -ContentType "application/json"
        Write-Host "Response:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }

    Write-Host ""

    # Test 4: Get requests again to verify status
    Write-Host "4. GET /requests (after marking as issued)" -ForegroundColor Yellow
    try {
        $requests = Invoke-RestMethod -Uri "$BaseUrl/requests" -Method Get
        Write-Host "Response:" -ForegroundColor Green
        $requests | ConvertTo-Json -Depth 10
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Tests completed ===" -ForegroundColor Cyan


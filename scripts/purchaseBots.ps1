# Define the URLs
$botUrl = "http://localhost:4005/api/bot"
$purchaseUrl = "http://localhost:4007/api/purchase"

# Define user IDs for easy modification
$userId1 = "9X7l8xFnxTPwslzbfySCinrm46c2"
$userId2 = "bXLCX4lxskUkbyolqok8lTBXnQt1"

# Get the list of bots
$botsResponse = Invoke-RestMethod -Uri $botUrl -Method Get

# Check if the response contains bots
if ($botsResponse -and $botsResponse.Count -gt 1) {
    # Select the first and second bots' IDs
    $botId1 = $botsResponse[0].id
    $botId2 = $botsResponse[1].id

    Write-Host "Selected Bot ID for User 1: $botId1"
    Write-Host "Selected Bot ID for User 2: $botId2"

    # Define the purchase body for User 1
    $purchaseBody1 = @{
        userId = $userId1
        botId = $botId1
    } | ConvertTo-Json

    # Define the purchase body for User 2
    $purchaseBody2 = @{
        userId = $userId2
        botId = $botId2
    } | ConvertTo-Json

    # Set the headers
    $headers = @{
        "Content-Type" = "application/json"
    }

    # Send the POST request for User 1
    $purchaseResponse1 = Invoke-RestMethod -Uri $purchaseUrl -Method Post -Body $purchaseBody1 -Headers $headers
    Write-Host "Purchase Response for User 1:" -ForegroundColor Green
    $purchaseResponse1

    # Send the POST request for User 2
    $purchaseResponse2 = Invoke-RestMethod -Uri $purchaseUrl -Method Post -Body $purchaseBody2 -Headers $headers
    Write-Host "Purchase Response for User 2:" -ForegroundColor Green
    $purchaseResponse2

} else {
    Write-Host "Not enough bots found in the response." -ForegroundColor Red
}

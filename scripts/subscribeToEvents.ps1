# Step 1: Retrieve events
$eventsUrl = "http://localhost:4006/api/events"
$eventsResponse = Invoke-RestMethod -Uri $eventsUrl -Method Get

# Step 2: Save the second event ID
$eventId = $eventsResponse[1].id
Write-Host "Retrieved Event ID: $eventId"

# Define user IDs for easy modification
$userId1 = "9X7l8xFnxTPwslzbfySCinrm46c2"
$userId2 = "bXLCX4lxskUkbyolqok8lTBXnQt1"

# Define the base URLs for further requests
$purchaseUrlTemplate = "http://localhost:4007/api/purchase/{0}"
$behaviourUrlTemplate = "http://localhost:4013/api/bot-behaviours/{0}"

# Loop through each userId
foreach ($userId in @($userId1, $userId2)) {
    # Step 3: Get the botId for the user
    $purchaseUrl = $purchaseUrlTemplate -f $userId
    $purchaseResponse = Invoke-RestMethod -Uri $purchaseUrl -Method Get
    $botId = $purchaseResponse[0]  # Get the first bot ID
    Write-Host "User ID: $userId, Bot ID: $botId"

    # Step 4: Get the behaviourId for the user
    $behaviourUrl = $behaviourUrlTemplate -f $userId
    $behaviourResponse = Invoke-RestMethod -Uri $behaviourUrl -Method Get
    $behaviourId = $behaviourResponse[0].id  # Get the first behaviour ID
    Write-Host "User ID: $userId, Behaviour ID: $behaviourId"

    # Step 5: Subscribe to the event
    $subscriptionUrl = "http://localhost:4012/api/eventsubscriptions"
    $subscriptionBody = @{
        userId            = $userId
        eventId           = $eventId
        botId             = $botId
        botBehaviourId    = $behaviourId
    } | ConvertTo-Json

    # Set the headers
    $headers = @{
        "Content-Type" = "application/json"
    }

    # Send the POST request
    $subscriptionResponse = Invoke-RestMethod -Uri $subscriptionUrl -Method Post -Body $subscriptionBody -Headers $headers
    Write-Host "Subscription Response for User ${userId}:" -ForegroundColor Green
    $subscriptionResponse
}

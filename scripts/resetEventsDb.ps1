# Define the different sets of data
$bots = @(
    '{"name": "event1", "description": "this is the first event"}',
    '{"name": "event2", "description": "this is the second event"}'
)

# Loop through the bot data and make the HTTP POST request
foreach ($bot_data in $bots) {
    Write-Host "Sending data: $bot_data"

    Invoke-RestMethod -Uri 'http://localhost:3001/gateway/events' `
                      -Method Post `
                      -Headers @{'Content-Type' = 'application/json'} `
                      -Body $bot_data
}

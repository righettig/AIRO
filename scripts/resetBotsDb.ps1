# Define the different sets of data
$bots = @(
    '{"name": "bot1", "price": 100}',
    '{"name": "bot2", "price": 150}',
    '{"name": "bot3", "price": 200}',
    '{"name": "bot4", "price": 250}'
)

# Loop through the bot data and make the HTTP POST request
foreach ($bot_data in $bots) {
    Write-Host "Sending data: $bot_data"

    Invoke-RestMethod -Uri 'http://localhost:3001/gateway/bot' `
                      -Method Post `
                      -Headers @{'Content-Type' = 'application/json'} `
                      -Body $bot_data
}

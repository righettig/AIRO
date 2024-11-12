# Define the different sets of data
$bots = @(
    '{"name": "Titan", "price": 500, "health": 150, "attack": 40, "defense": 30}',
    '{"name": "Shadow", "price": 300, "health": 120, "attack": 60, "defense": 20}',
    '{"name": "Guardian", "price": 600, "health": 200, "attack": 20, "defense": 50}'
)

# Loop through the bot data and make the HTTP POST request
foreach ($bot_data in $bots) {
    Write-Host "Sending data: $bot_data"

    Invoke-RestMethod -Uri 'http://localhost:3001/gateway/bot' `
                      -Method Post `
                      -Headers @{'Content-Type' = 'application/json'} `
                      -Body $bot_data
}

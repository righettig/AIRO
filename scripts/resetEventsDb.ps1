# Define the different sets of data
$events = @(
    '{"name": "event1", "description": "this is the first event", "scheduledAt": null}',
    '{"name": "event2", "description": "this is the second event", "scheduledAt": null}'
)

# Get the current time and add 5 minutes to it
$scheduledTime = (Get-Date).AddMinutes(3).ToString("yyyy-MM-ddTHH:mm:ss")

# Loop through the event data and make the HTTP POST request
foreach ($event_data in $events) {
    # Convert JSON string to a PowerShell object to add the scheduledAt field
    $_event = $event_data | ConvertFrom-Json
    $_event.scheduledAt = $scheduledTime

    # Convert the PowerShell object back to a JSON string
    $event_data_with_schedule = $_event | ConvertTo-Json

    Write-Host "Sending data: $event_data_with_schedule"

    Invoke-RestMethod -Uri 'http://localhost:3001/gateway/events' `
                      -Method Post `
                      -Headers @{'Content-Type' = 'application/json'} `
                      -Body $event_data_with_schedule
}

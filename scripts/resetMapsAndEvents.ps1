# Define the different sets of map data
$maps = @(
    '{"mapData": "{\"name\":\"Small_1\",\"size\":6,\"tiles\":[{\"x\":0,\"y\":0,\"type\":\"spawn\"},{\"x\":2,\"y\":2,\"type\":\"food\"},{\"x\":3,\"y\":2,\"type\":\"food\"},{\"x\":2,\"y\":3,\"type\":\"food\"},{\"x\":3,\"y\":3,\"type\":\"food\"},{\"x\":5,\"y\":5,\"type\":\"spawn\"}]}"}',
    '{"mapData": "{\"name\":\"Medium_1\",\"size\":16,\"tiles\":[{\"x\":0,\"y\":0,\"type\":\"spawn\"},{\"x\":15,\"y\":0,\"type\":\"spawn\"},{\"x\":9,\"y\":4,\"type\":\"food\"},{\"x\":6,\"y\":5,\"type\":\"food\"},{\"x\":8,\"y\":5,\"type\":\"food\"},{\"x\":10,\"y\":5,\"type\":\"food\"},{\"x\":9,\"y\":6,\"type\":\"food\"},{\"x\":11,\"y\":6,\"type\":\"food\"},{\"x\":3,\"y\":7,\"type\":\"food\"},{\"x\":5,\"y\":7,\"type\":\"food\"},{\"x\":6,\"y\":8,\"type\":\"food\"},{\"x\":8,\"y\":8,\"type\":\"food\"},{\"x\":10,\"y\":8,\"type\":\"food\"},{\"x\":5,\"y\":10,\"type\":\"food\"},{\"x\":8,\"y\":10,\"type\":\"food\"},{\"x\":11,\"y\":10,\"type\":\"food\"},{\"x\":0,\"y\":15,\"type\":\"spawn\"},{\"x\":15,\"y\":15,\"type\":\"spawn\"}]}"}'
)

# Initialize an array to store the map IDs
$mapIds = @()

# Loop through the map data and make the HTTP POST request
foreach ($map in $maps) {
    Write-Host "Sending data: $map"
    
    # Send the POST request to create the map and capture the response
    $response = Invoke-RestMethod -Uri 'http://localhost:3001/gateway/maps' `
                                  -Method Post `
                                  -Headers @{'Content-Type' = 'application/json'} `
                                  -Body $map
    
    # Assuming the response contains the map ID, store it in the array
    $mapId = $response.id  # Adjust if the map ID field is different
    $mapIds += $mapId
}

# Define the different sets of event data
$events = @(
    '{"name": "event1", "description": "this is the first event", "scheduledAt": null, "mapId": null}'
    '{"name": "event2", "description": "this is the second event", "scheduledAt": null, "mapId": null}'
)

# Get the current time and add 5 minutes to it
$scheduledTime = (Get-Date).AddMinutes(1).ToString("yyyy-MM-ddTHH:mm:ss")

# Loop through the event data and map IDs to create events with associated map IDs
for ($i = 0; $i -lt $events.Count; $i++) {
    $event_data = $events[$i]

    # Convert JSON string to a PowerShell object to add the scheduledAt and mapId fields
    $_event = $event_data | ConvertFrom-Json
    $_event.scheduledAt = $scheduledTime
    $_event.mapId = $mapIds[$i]  # Assign the map ID from the corresponding created map

    # Convert the PowerShell object back to a JSON string
    $event_data_with_map_and_schedule = $_event | ConvertTo-Json

    Write-Host "Sending event data: $event_data_with_map_and_schedule"

    # Send the POST request to create the event
    Invoke-RestMethod -Uri 'http://localhost:3001/gateway/events' `
                      -Method Post `
                      -Headers @{'Content-Type' = 'application/json'} `
                      -Body $event_data_with_map_and_schedule
}

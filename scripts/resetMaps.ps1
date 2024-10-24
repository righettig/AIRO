# Define the different sets of data
$maps = @(
    '{"mapData": "{\"name\":\"Small_1\",\"size\":6,\"tiles\":[{\"x\":0,\"y\":0,\"type\":\"spawn\"},{\"x\":2,\"y\":2,\"type\":\"food\"},{\"x\":3,\"y\":2,\"type\":\"food\"},{\"x\":2,\"y\":3,\"type\":\"food\"},{\"x\":3,\"y\":3,\"type\":\"food\"},{\"x\":5,\"y\":5,\"type\":\"spawn\"}]}"}',
    '{"mapData": "{\"name\":\"Medium_1\",\"size\":16,\"tiles\":[{\"x\":0,\"y\":0,\"type\":\"spawn\"},{\"x\":15,\"y\":0,\"type\":\"spawn\"},{\"x\":9,\"y\":4,\"type\":\"food\"},{\"x\":6,\"y\":5,\"type\":\"food\"},{\"x\":8,\"y\":5,\"type\":\"food\"},{\"x\":10,\"y\":5,\"type\":\"food\"},{\"x\":9,\"y\":6,\"type\":\"food\"},{\"x\":11,\"y\":6,\"type\":\"food\"},{\"x\":3,\"y\":7,\"type\":\"food\"},{\"x\":5,\"y\":7,\"type\":\"food\"},{\"x\":6,\"y\":8,\"type\":\"food\"},{\"x\":8,\"y\":8,\"type\":\"food\"},{\"x\":10,\"y\":8,\"type\":\"food\"},{\"x\":5,\"y\":10,\"type\":\"food\"},{\"x\":8,\"y\":10,\"type\":\"food\"},{\"x\":11,\"y\":10,\"type\":\"food\"},{\"x\":0,\"y\":15,\"type\":\"spawn\"},{\"x\":15,\"y\":15,\"type\":\"spawn\"}]}"}'
)

# Loop through the event data and make the HTTP POST request
foreach ($map in $maps) {
    Write-Host "Sending data: $map"

    Invoke-RestMethod -Uri 'http://localhost:3001/gateway/maps' `
                      -Method Post `
                      -Headers @{'Content-Type' = 'application/json'} `
                      -Body $map
}

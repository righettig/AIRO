# ANYbotics ANYmal API

Run from the command line by doing:

dotnet run --launch-profile "anybotics-anymal-api"

Swagger available @ https://localhost:7272/swagger/index.html

to recharge an agent's battery level do via postman

POST https://localhost:5001/api/anymal/recharge
Content-Type: application/json

{
  "agent-id-here"
}

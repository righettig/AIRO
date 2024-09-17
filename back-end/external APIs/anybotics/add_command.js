// Usage: node add_command.js Foo [--skip-proto]

const fs = require('fs');
const path = require('path');

// Get the command name from the command line arguments
const args = process.argv.slice(2);
const COMMAND_NAME = args.find(arg => !arg.startsWith('--'));
const SKIP_PROTO = args.includes('--skip-proto');

if (!COMMAND_NAME) {
    console.error("Please provide a command name as an argument.");
    process.exit(1);
}

const COMMAND_NAME_CAMEL_CASE = COMMAND_NAME.charAt(0).toLowerCase() + COMMAND_NAME.slice(1);

// File paths
const protoFilePath = path.join(__dirname, 'anybotics-anymal-common', 'Protos', 'anymal.proto');
const commandFilePath = path.join(__dirname, 'anybotics-anymal-api', 'Commands', `${COMMAND_NAME}Command.cs`);
const commandHandlerFilePath = path.join(__dirname, 'anybotics-anymal-api', 'Commands', 'CommandHandlers', `${COMMAND_NAME}CommandHandler.cs`);
const controllerFilePath = path.join(__dirname, 'anybotics-anymal-api', 'Commands', 'Controllers', `${COMMAND_NAME}Controller.cs`);
const anymalServiceFilePath = path.join(__dirname, 'anybotics-anymal-api', 'Services', `AnymalService.${COMMAND_NAME}.cs`);
const commandProcessorFilePath = path.join(__dirname, 'anybotics-anymal', 'CommandProcessors', `${COMMAND_NAME}CommandProcessor.cs`);
const agentServiceFilePath = path.join(__dirname, 'anybotics-workforce-ng', 'src', 'app', 'services', 'agent.service.ts');
const commandsFilePath = path.join(__dirname, 'anybotics-workforce-ng', 'src', 'app', 'commands', 'commands.component.ts');

// Helper functions
function addProtoMessage() {
    const messageDefinition = `
message ${COMMAND_NAME}Request {
  string id = 1;
}

message ${COMMAND_NAME}Response {
  bool success = 1;
}\n`;

    fs.appendFileSync(protoFilePath, messageDefinition, 'utf8');
    console.log(`Proto message added for ${COMMAND_NAME}`);
}

function createCommandFile() {
    const commandContent = `
using anybotics_anymal_api.Commands.Core;

namespace anybotics_anymal_api.Commands;

public class ${COMMAND_NAME}Command(string agentId, string initiatedBy) : CommandBase(agentId, initiatedBy)
{
    public override string ToString() => "${COMMAND_NAME}";
}\n`;

    fs.writeFileSync(commandFilePath, commandContent, 'utf8');
    console.log(`Command file created for ${COMMAND_NAME}`);
}

function createCommandHandlerFile() {
    const commandHandlerContent = `
using AnymalGrpc;
using anybotics_anymal_api.Commands.Core;
using AnymalService = anybotics_anymal_api.Services.AnymalService;

namespace anybotics_anymal_api.Commands.CommandHandlers;

public class ${COMMAND_NAME}CommandHandler(AnymalService anymalService) : CommandHandlerBase<${COMMAND_NAME}Command>(anymalService)
{
    public override async Task<UpdateResponse> HandleAsync(${COMMAND_NAME}Command command)
    {
        return await anymalService.${COMMAND_NAME}Async(command.AgentId);
    }
}\n`;

    fs.writeFileSync(commandHandlerFilePath, commandHandlerContent, 'utf8');
    console.log(`Command handler file created for ${COMMAND_NAME}`);
}

function createControllerFile() {
    const controllerContent = `
using anybotics_anymal_api.Commands.Controllers;
using anybotics_anymal_api.Commands.Core;
using anybotics_anymal_api.Commands;
using anybotics_anymal_api.CustomAttributes;
using Microsoft.AspNetCore.Mvc;

namespace anybotics_anymal_api.Controllers;

[ApiController]
[Route("anymal/${COMMAND_NAME_CAMEL_CASE}")]
public class ${COMMAND_NAME}Controller(ICommandBus commandBus) : BaseAnymalCommandController(commandBus)
{
    [HttpPost]
    [Deny("guest")]
    public async Task<IActionResult> ${COMMAND_NAME}([FromBody] string id)
    {
        var validationResult = ValidateId(id);
        if (validationResult != null)
        {
            return validationResult;
        }

        var result = await commandBus.SendAsync(new ${COMMAND_NAME}Command(id, UserUid));
        return Ok(result);
    }
}\n`;

    fs.writeFileSync(controllerFilePath, controllerContent, 'utf8');
    console.log(`Controller file created for ${COMMAND_NAME}`);
}

function createAnymalServiceFile() {
    const anymalServiceContent = `
using AnymalGrpc;

namespace anybotics_anymal_api.Services;

public partial class AnymalService
{
    public Task<UpdateResponse> ${COMMAND_NAME}Async(string id)
        => PerformAgentActionAsync(id, async agentClient =>
        {
            if (agentClient.Agent.Status == Status.Offline)
            {
                throw new InvalidOperationException("Agent is Offline. ${COMMAND_NAME} requests are ignored.");
            }

            var @event = new Command { Id = id, CommandId = "${COMMAND_NAME}" };
            await agentClient.CommandStream?.WriteAsync(@event);
        },
        $"Performing ${COMMAND_NAME} agent {id}.", "Agent not found.");
}\n`;

    fs.writeFileSync(anymalServiceFilePath, anymalServiceContent, 'utf8');
    console.log(`AnymalService file created for ${COMMAND_NAME}`);
}

function createCommandProcessorFile() {
    const commandProcessorContent = `
using AnymalGrpc;
using anybotics_anymal_common.Domain;

namespace anybotics_anymal.CommandProcessors;

public class ${COMMAND_NAME}CommandProcessor() : BaseCommandProcessor("${COMMAND_NAME}")
{
    public override void PerformCommand(AnymalAgent agent, Command response)
    {
        // placeholder
    }
}\n`;

    fs.writeFileSync(commandProcessorFilePath, commandProcessorContent, 'utf8');
    console.log(`Command processor created for ${COMMAND_NAME}`);
}

function updateAgentServiceFile() {
    // Read the existing content of the agent service file
    const agentServiceContent = fs.readFileSync(agentServiceFilePath, 'utf8');

    // Define the new method to be inserted
    const newMethodContent = `  async ${COMMAND_NAME_CAMEL_CASE}(id: string): Promise<void> {
    const url = \`\${this.baseApiUrl}/${COMMAND_NAME_CAMEL_CASE}\`;
    await this.performAction(url, id);
  }`;

    // Define the marker to locate the position of the private performAction method
    const marker = 'private async performAction(url: string, id: string): Promise<void> {';

    // Find the position of the marker
    const markerIndex = agentServiceContent.indexOf(marker);

    if (markerIndex === -1) {
        console.error('performAction method not found in the agent service file.');
        return;
    }

    // Find the last method's ending bracket before the performAction method
    const methodEndIndex = agentServiceContent.lastIndexOf('}', markerIndex);

    if (methodEndIndex === -1) {
        console.error('Unable to find the end of the last method in the agent service file.');
        return;
    }

    // Insert the new method content after the last method
    const updatedContent =
        agentServiceContent.slice(0, methodEndIndex + 1) + '\n\n' +
        newMethodContent +
        agentServiceContent.slice(methodEndIndex + 1);

    // Write the updated content back to the file
    fs.writeFileSync(agentServiceFilePath, updatedContent, 'utf8');
    console.log(`Agent service updated with ${COMMAND_NAME_CAMEL_CASE} method.`);
}

function updateCommandsFile() {
    // Read the existing content of the commands file
    const commandsFileContent = fs.readFileSync(commandsFilePath, 'utf8');

    // Define the new method to be inserted
    const newMethodContent = `  ${COMMAND_NAME_CAMEL_CASE}() {
    this.performAction(() => this.agentService.${COMMAND_NAME_CAMEL_CASE}(this.agentId!));
  }`;

    // Find the last method's ending bracket
    const lastMethodEndIndex = commandsFileContent.lastIndexOf('}');

    if (lastMethodEndIndex === -1) {
        console.error('Unable to find the end of the last method in the commands file.');
        return;
    }

    // Insert the new method content before the last closing bracket
    const updatedContent =
        commandsFileContent.slice(0, lastMethodEndIndex) + '\n' +
        newMethodContent + '\n' +
        commandsFileContent.slice(lastMethodEndIndex);

    // Write the updated content back to the file
    fs.writeFileSync(commandsFilePath, updatedContent, 'utf8');
    console.log(`Commands file updated with ${COMMAND_NAME_CAMEL_CASE} method.`);
}

// Main function
function main() {
    if (!SKIP_PROTO) {
        addProtoMessage();
    }
    createCommandFile();
    createCommandHandlerFile();
    createControllerFile();
    createAnymalServiceFile();
    createCommandProcessorFile();
    updateAgentServiceFile();
    updateCommandsFile();
}

// Execute script
main();

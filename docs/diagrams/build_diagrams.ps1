# Define the input and output files
$diagrams = @(
    @{ Input = "admin-front-end-diagram.mmd"; Output = "output/admin-front-end-diagram.svg" },
    @{ Input = "enterprise-front-end-diagram.mmd"; Output = "output/enterprise-front-end-diagram.svg" },
    @{ Input = "users-front-end-diagram.mmd"; Output = "output/users-front-end-diagram.svg" }
    @{ Input = "microservices-diagram.mmd"; Output = "output/microservices-diagram.svg" }
)

# Loop through each diagram and run the mmdc command
foreach ($diagram in $diagrams) {
    $inputFile = $diagram.Input
    $outputFile = $diagram.Output

    Write-Host "Processing $inputFile."

    # Execute the mmdc command
    mmdc -i $inputFile -o $outputFile
}

Write-Host "All diagrams have been processed."

namespace airo_event_simulation_playground;

public static class FileReader
{
    public static string ReadMap(string fileName)
    {
        return ReadFile(Path.Combine("Examples", "Maps", fileName));
    }

    public static string ReadBehaviour(string fileName)
    {
        return ReadFile(Path.Combine("Examples", fileName));
    }

    private static string ReadFile(string relativePath)
    {
        string currentDirectory = AppDomain.CurrentDomain.BaseDirectory;
        string projectDirectory = Directory.GetParent(currentDirectory).Parent.Parent.Parent.FullName;
        string filePath = Path.Combine(projectDirectory, relativePath);
        string fileContent = "";

        if (File.Exists(filePath))
        {
            fileContent = File.ReadAllText(filePath);
        }
        else
        {
            Console.WriteLine("File not found!");
        }

        return fileContent;
    }
}
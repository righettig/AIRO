using Google.Cloud.Firestore;

namespace airo_profile_microservice.Models;

[FirestoreData]
public class Profile
{
    [FirestoreProperty("uid")]
    public string Uid { get; set; }

    [FirestoreProperty("firstName")]
    public string FirstName { get; set; }
    
    [FirestoreProperty("lastName")]
    public string LastName { get; set; }
    
    [FirestoreProperty("accountType")]
    public string AccountType { get; set; }

    [FirestoreProperty("email")]
    public string Email { get; set; }

    [FirestoreProperty("nickname")]
    public string Nickname { get; set; }

    public Profile() { }
}
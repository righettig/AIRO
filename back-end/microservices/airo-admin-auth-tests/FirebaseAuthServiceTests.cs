using airo_admin_auth_microservice.Services;
using Firebase.Auth;
using Moq;

namespace airo_admin_auth_tests;

public class FirebaseAuthServiceTests
{
    private readonly Mock<IFirebaseAuthClient> _mockFirebaseAuthClient;

    private readonly FirebaseAuthService _authService;

    public FirebaseAuthServiceTests()
    {
        _mockFirebaseAuthClient = new Mock<IFirebaseAuthClient>();
        _authService = new FirebaseAuthService(_mockFirebaseAuthClient.Object);
    }

    [Fact]
    public async Task Login_ShouldReturnNull_WhenCredentialsAreInvalid()
    {
        // Arrange
        _mockFirebaseAuthClient
            .Setup(client => client.SignInWithEmailAndPasswordAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((UserCredential)null); // Simulate invalid credentials

        // Act
        var result = await _authService.Login("test@example.com", "wrongpassword");

        // Assert
        Assert.Null(result);
    }

    // cannot be tested as User does not have a public ctor
    //[Fact]
    //public async Task Login_ShouldReturnLoginResponse_WhenCredentialsAreValid()
    //{
    //    // Arrange
    //    var mockUser = new Mock<User>();

    //    mockUser.SetupGet(user => user.Uid).Returns("12345");
    //    mockUser.Setup(user => user.GetIdTokenAsync(It.IsAny<bool>())).ReturnsAsync("valid_token");

    //    var mockUserCredential = new Mock<UserCredential>();
    //    mockUserCredential.SetupGet(user => user.User).Returns(mockUser.Object);

    //    _mockFirebaseAuthClient
    //        .Setup(client => client.SignInWithEmailAndPasswordAsync(It.IsAny<string>(), It.IsAny<string>()))
    //        .ReturnsAsync(mockUserCredential.Object);

    //    // Act
    //    var result = await _authService.Login("test@example.com", "validpassword");

    //    // Assert
    //    Assert.NotNull(result);
    //    Assert.Equal("12345", result.Uid);
    //    Assert.Equal("valid_token", result.Token);
    //}

    // cannot be tested as User does not have a public ctor
    //[Fact]
    //public async Task RefreshToken_ShouldReturnNewToken()
    //{
    //    // Arrange
    //    var mockUser = new Mock<User>(); 
    //    mockUser.Setup(user => user.GetIdTokenAsync(It.IsAny<bool>())).ReturnsAsync("new_token");

    //    _mockFirebaseAuthClient.Setup(client => client.User).Returns(mockUser.Object);

    //    // Act
    //    var result = await _authService.RefreshToken();

    //    // Assert
    //    Assert.NotNull(result);
    //    Assert.Equal("new_token", result);
    //}

    [Fact]
    public void SignOut_ShouldCallFirebaseSignOut()
    {
        // Act
        _authService.SignOut();

        // Assert
        _mockFirebaseAuthClient.Verify(client => client.SignOut(), Times.Once);
    }
}
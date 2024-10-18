using airo_auth_microservice.Services.Impl;
using airo_auth_microservice.Services.Interfaces;
using Firebase.Auth;
using Moq;

namespace airo_auth_tests;

public class FirebaseAuthServiceTests
{
    private readonly Mock<IFirebaseAuthClient> _mockFirebaseAuthClient;
    private readonly Mock<IUserRolesRepository> _mockRolesRepository;

    private readonly FirebaseAuthService _authService;

    public FirebaseAuthServiceTests()
    {
        _mockFirebaseAuthClient = new Mock<IFirebaseAuthClient>();
        _mockRolesRepository = new Mock<IUserRolesRepository>();
        _authService = new FirebaseAuthService(_mockFirebaseAuthClient.Object, _mockRolesRepository.Object);
    }

    [Fact]
    public async Task SignUp_ShouldReturnNull_WhenSignUpFails()
    {
        // Arrange
        _mockFirebaseAuthClient
            .Setup(client => client.CreateUserWithEmailAndPasswordAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((UserCredential)null); // Simulate sign-up failure

        // Act
        var result = await _authService.SignUp("test@example.com", "password");

        // Assert
        Assert.Null(result);
    }

    // cannot be tested as User does not have a public ctor
    //[Fact]
    //public async Task SignUp_ShouldReturnSignupResponse_AndSetUserRole_WhenSignUpSucceeds()
    //{
    //    // Arrange
    //    var mockUser = new Mock<User>();

    //    mockUser.Setup(user => user.Uid).Returns("12345");
    //    mockUser.Setup(user => user.GetIdTokenAsync(It.IsAny<bool>())).ReturnsAsync("signup_token");

    //    var mockUserCredential = new Mock<UserCredential>();
    //    mockUserCredential.SetupGet(user => user.User).Returns(mockUser.Object);

    //    _mockFirebaseAuthClient
    //        .Setup(client => client.CreateUserWithEmailAndPasswordAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
    //        .ReturnsAsync(mockUserCredential.Object);

    //    _mockRolesRepository.Setup(repo => repo.SetRole(It.IsAny<string>(), "standard")).Returns(Task.CompletedTask);

    //    // Act
    //    var result = await _authService.SignUp("test@example.com", "password");

    //    // Assert
    //    Assert.NotNull(result);
    //    Assert.Equal("12345", result.Uid);
    //    Assert.Equal("signup_token", result.Token);
    //    _mockRolesRepository.Verify(repo => repo.SetRole("test@example.com", "standard"), Times.Once);
    //}

    [Fact]
    public async Task Login_ShouldReturnNull_WhenLoginFails()
    {
        // Arrange
        _mockFirebaseAuthClient
            .Setup(client => client.SignInWithEmailAndPasswordAsync(It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync((UserCredential)null); // Simulate login failure

        // Act
        var result = await _authService.Login("test@example.com", "wrongpassword");

        // Assert
        Assert.Null(result);
    }

    // cannot be tested as User does not have a public ctor
    //[Fact]
    //public async Task Login_ShouldReturnLoginResponse_WhenLoginSucceeds()
    //{
    //    // Arrange
    //    var mockUser = new Mock<User>();

    //    mockUser.SetupGet(user => user.Uid).Returns("12345");
    //    mockUser.Setup(user => user.GetIdTokenAsync(It.IsAny<bool>())).ReturnsAsync("login_token");

    //    var mockUserCredential = new Mock<UserCredential>();
    //    mockUserCredential.SetupGet(user => user.User).Returns(mockUser.Object);

    //    _mockFirebaseAuthClient
    //        .Setup(client => client.SignInWithEmailAndPasswordAsync(It.IsAny<string>(), It.IsAny<string>()))
    //        .ReturnsAsync(mockUserCredential.Object);

    //    // Act
    //    var result = await _authService.Login("test@example.com", "password");

    //    // Assert
    //    Assert.NotNull(result);
    //    Assert.Equal("12345", result.Uid);
    //    Assert.Equal("login_token", result.Token);
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

    [Fact]
    public async Task GetUserRole_ShouldReturnRole_WhenCalled()
    {
        // Arrange
        _mockRolesRepository.Setup(repo => repo.GetRole(It.IsAny<string>())).ReturnsAsync("admin");

        // Act
        var result = await _authService.GetUserRole("test@example.com");

        // Assert
        Assert.Equal("admin", result);
        _mockRolesRepository.Verify(repo => repo.GetRole("test@example.com"), Times.Once);
    }
}

﻿using airo_auth_microservice.Models;

namespace airo_auth_microservice.Services;

public interface IAuthService
{
    Task<string> GetUserRole(string email);
    Task<LoginResponse?> Login(string email, string password);
    void SignOut();
    Task<SignupResponse?> SignUp(string email, string password);
    Task<string?> RefreshToken();
}
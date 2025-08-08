package com.example.quizapp.model;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private String role; // optional for registration
}

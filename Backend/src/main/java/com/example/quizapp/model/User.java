package com.example.quizapp.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")  // safer name

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;
}

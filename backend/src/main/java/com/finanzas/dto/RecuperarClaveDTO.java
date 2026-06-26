package com.finanzas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RecuperarClaveDTO {
    @NotBlank
    @Email
    private String email;

    // getters and setters
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
}

package com.finanzas.dto;

import jakarta.validation.constraints.NotBlank;

public class ResetClaveDTO {
    @NotBlank
    private String token;

    @NotBlank
    private String nuevaClave;

    // getters and setters
    public String getToken() { return this.token; }
    public void setToken(String token) { this.token = token; }
    public String getNuevaClave() { return this.nuevaClave; }
    public void setNuevaClave(String nuevaClave) { this.nuevaClave = nuevaClave; }
}

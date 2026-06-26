package com.finanzas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CambiarPasswordDTO {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String claveActual;

    @NotBlank
    private String nuevaClave;

    // getters and setters
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getClaveActual() { return this.claveActual; }
    public void setClaveActual(String claveActual) { this.claveActual = claveActual; }
    public String getNuevaClave() { return this.nuevaClave; }
    public void setNuevaClave(String nuevaClave) { this.nuevaClave = nuevaClave; }
}

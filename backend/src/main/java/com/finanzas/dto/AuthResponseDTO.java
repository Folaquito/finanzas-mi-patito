package com.finanzas.dto;

import com.finanzas.model.Usuario;

public class AuthResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;

    public AuthResponseDTO() {}

    public AuthResponseDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nombre = usuario.getNombre();
        this.email = usuario.getEmail();
        this.telefono = usuario.getTelefono();
    }

    // getters and setters
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return this.nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefono() { return this.telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}

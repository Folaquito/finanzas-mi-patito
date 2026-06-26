package com.finanzas.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "categorias")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nombre;

    @Enumerated(EnumType.STRING)
    private TipoCategoria tipo;

    // getters and setters
    public Long getId() { return this.id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return this.nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public TipoCategoria getTipo() { return this.tipo; }
    public void setTipo(TipoCategoria tipo) { this.tipo = tipo; }
}

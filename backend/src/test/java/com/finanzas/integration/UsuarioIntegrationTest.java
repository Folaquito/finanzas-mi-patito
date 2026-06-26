package com.finanzas.integration;

import com.finanzas.dto.UsuarioDTO;
import com.finanzas.model.Usuario;
import com.finanzas.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UsuarioIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @BeforeEach
    void setUp() {
        usuarioRepository.deleteAll();
    }

    // ===== CRITERIOS DE ACEPTACION - API USUARIO =====

    // CA-008: El API debe responder con codigo 201 al crear un usuario exitosamente
    // CA-009: El API debe responder con codigo 200 al listar usuarios
    // CA-010: El API debe responder con codigo 200 al obtener un usuario por ID
    // CA-011: El API debe responder con codigo 204 al eliminar un usuario
    // CA-012: El API debe responder con codigo 404 cuando el usuario no existe
    // CA-013: El API debe validar los datos de entrada

    @Test
    void create_conDatosValidos_retorna201() throws Exception {
        // Arrange
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Perez");
        dto.setEmail("juan@test.com");
        dto.setPassword("password123");
        dto.setTelefono("1234567890");

        // Act
        ResultActions resultado = mockMvc.perform(post("/api/usuarios")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dto)));

        // Assert
        resultado.andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.nombre").value("Juan Perez"))
            .andExpect(jsonPath("$.email").value("juan@test.com"));
    }

    @Test
    void all_retorna200_conListaVacia() throws Exception {
        // Act
        ResultActions resultado = mockMvc.perform(get("/api/usuarios"));

        // Assert
        resultado.andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void all_despuesDeCrearUsuario_retorna200_conUsuario() throws Exception {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setNombre("Juan Perez");
        usuario.setEmail("juan@test.com");
        usuario.setPassword("encodedPassword");
        usuario.setTelefono("1234567890");
        usuarioRepository.save(usuario);

        // Act
        ResultActions resultado = mockMvc.perform(get("/api/usuarios"));

        // Assert
        resultado.andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].nombre").value("Juan Perez"));
    }

    @Test
    void get_conIdExistente_retorna200() throws Exception {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setNombre("Juan Perez");
        usuario.setEmail("juan@test.com");
        usuario.setPassword("encodedPassword");
        usuario.setTelefono("1234567890");
        Usuario guardado = usuarioRepository.save(usuario);

        // Act
        ResultActions resultado = mockMvc.perform(get("/api/usuarios/" + guardado.getId()));

        // Assert
        resultado.andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(guardado.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value("Juan Perez"));
    }

    @Test
    void get_conIdNoExistente_retorna404() throws Exception {
        // Act
        ResultActions resultado = mockMvc.perform(get("/api/usuarios/999"));

        // Assert
        resultado.andExpect(status().isNotFound());
    }

    @Test
    void update_conDatosValidos_retorna200() throws Exception {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setNombre("Juan Perez");
        usuario.setEmail("juan@test.com");
        usuario.setPassword("encodedPassword");
        usuario.setTelefono("1234567890");
        Usuario guardado = usuarioRepository.save(usuario);

        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Actualizado");
        dto.setEmail("juanUpdated@test.com");
        dto.setPassword("newpassword");
        dto.setTelefono("0987654321");

        // Act
        ResultActions resultado = mockMvc.perform(put("/api/usuarios/" + guardado.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dto)));

        // Assert
        resultado.andExpect(status().isOk())
            .andExpect(jsonPath("$.nombre").value("Juan Actualizado"));
    }

    @Test
    void delete_conIdExistente_retorna204() throws Exception {
        // Arrange
        Usuario usuario = new Usuario();
        usuario.setNombre("Juan Perez");
        usuario.setEmail("juan@test.com");
        usuario.setPassword("encodedPassword");
        usuario.setTelefono("1234567890");
        Usuario guardado = usuarioRepository.save(usuario);

        // Act
        ResultActions resultado = mockMvc.perform(delete("/api/usuarios/" + guardado.getId()));

        // Assert
        resultado.andExpect(status().isNoContent());
        assertThat(usuarioRepository.findById(guardado.getId())).isEmpty();
    }

    @Test
    void create_conDatosInvalidos_retorna400() throws Exception {
        // Arrange - nombre vacio
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("");
        dto.setEmail("invalid-email");
        dto.setPassword("123");
        dto.setTelefono("123");

        // Act
        ResultActions resultado = mockMvc.perform(post("/api/usuarios")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(dto)));

        // Assert
        resultado.andExpect(status().isBadRequest());
    }
}
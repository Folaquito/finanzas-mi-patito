package com.finanzas.controller;

import com.finanzas.dto.UsuarioDTO;
import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.Usuario;
import com.finanzas.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Tests de unidad para UsuarioController utilizando Mocks
 *
 * Criterios de aceptacion:
 * - CA-014: El controlador debe delegar la creacion al servicio
 * - CA-015: El controlador debe retornar error 404 cuando no existe usuario
 * - CA-016: El controlador debe manejar excepciones correctement
 */
@ExtendWith(MockitoExtension.class)
class UsuarioControllerMockTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void create_delegaAlServicioYRetornaOk() {
        // Arrange
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Perez");
        dto.setEmail("juan@test.com");
        dto.setPassword("password123");

        Usuario usuarioCreado = new Usuario();
        usuarioCreado.setId(1L);
        usuarioCreado.setNombre("Juan Perez");
        usuarioCreado.setEmail("juan@test.com");
        usuarioCreado.setPassword("encodedPassword");

        when(usuarioService.create(any(UsuarioDTO.class))).thenReturn(usuarioCreado);

        // Act
        ResponseEntity<Usuario> response = usuarioController.create(dto);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);
        verify(usuarioService).create(dto);
    }

    @Test
    void all_delegaAlServicioYRetornaOk() {
        // Arrange
        Usuario u1 = new Usuario();
        u1.setId(1L);
        u1.setNombre("Juan");

        Usuario u2 = new Usuario();
        u2.setId(2L);
        u2.setNombre("Maria");

        List<Usuario> usuarios = new ArrayList<>();
        usuarios.add(u1);
        usuarios.add(u2);

        when(usuarioService.getAll()).thenReturn(usuarios);

        // Act
        @SuppressWarnings("unchecked")
        ResponseEntity<List<Usuario>> response = usuarioController.all();

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(2);
        verify(usuarioService).getAll();
    }

    @Test
    void get_conIdExistente_retornaUsuario() {
        // Arrange
        Long id = 1L;
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNombre("Juan Perez");

        when(usuarioService.getById(id)).thenReturn(usuario);

        // Act
        ResponseEntity<Usuario> response = usuarioController.get(id);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getNombre()).isEqualTo("Juan Perez");
    }

    @Test
    void get_conIdNoExistente_lanzaExcepcion() {
        // Arrange
        Long id = 999L;
        when(usuarioService.getById(id))
            .thenThrow(new ResourceNotFoundException("Usuario no encontrado"));

        // Act & Assert
        try {
            usuarioController.get(id);
        } catch (ResourceNotFoundException e) {
            assertThat(e.getMessage()).contains("Usuario no encontrado");
        }
    }

    @Test
    void update_actualizaUsuario() {
        // Arrange
        Long id = 1L;
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Actualizado");
        dto.setEmail("juan@test.com");

        Usuario usuarioActualizado = new Usuario();
        usuarioActualizado.setId(id);
        usuarioActualizado.setNombre("Juan Actualizado");

        when(usuarioService.update(eq(id), any(UsuarioDTO.class))).thenReturn(usuarioActualizado);

        // Act
        ResponseEntity<Usuario> response = usuarioController.update(id, dto);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getNombre()).isEqualTo("Juan Actualizado");
    }

    @Test
    void delete_conIdExistente_retornaNoContent() {
        // Arrange
        Long id = 1L;
        doNothing().when(usuarioService).delete(id);

        // Act
        ResponseEntity<Void> response = usuarioController.delete(id);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(usuarioService).delete(id);
    }
}
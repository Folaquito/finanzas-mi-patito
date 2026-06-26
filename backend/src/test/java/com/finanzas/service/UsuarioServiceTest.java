package com.finanzas.service;

import com.finanzas.dto.UsuarioDTO;
import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.Usuario;
import com.finanzas.repository.UsuarioRepository;
import com.finanzas.service.impl.UsuarioServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        usuarioService = new UsuarioServiceImpl(usuarioRepository, passwordEncoder);
    }

    // ===== CRITERIOS DE ACEPTACION - USUARIO SERVICE =====

    // CA-001: El servicio debe permitir crear un nuevo usuario con datos validos
    // CA-002: El servicio debe encriptar la contrasena antes de guardar
    // CA-003: El servicio debe lanzar excepcion cuando el email ya existe
    // CA-004: El servicio debe permitir actualizar un usuario existente
    // CA-005: El servicio debe permitir eliminar un usuario existente
    // CA-006: El servicio debe retornar un usuario por su ID
    // CA-007: El servicio debe retornar todos los usuarios

    @Test
    void create_conDatosValidos_creaUsuario() {
        // Arrange
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Perez");
        dto.setEmail("juan@test.com");
        dto.setPassword("password123");
        dto.setTelefono("1234567890");

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setNombre("Juan Perez");
        usuarioGuardado.setEmail("juan@test.com");
        usuarioGuardado.setPassword("encodedPassword");
        usuarioGuardado.setTelefono("1234567890");

        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        // Act
        Usuario resultado = usuarioService.create(dto);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNombre()).isEqualTo("Juan Perez");
        assertThat(resultado.getEmail()).isEqualTo("juan@test.com");
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void create_encriptaLaContrasena() {
        // Arrange
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Perez");
        dto.setEmail("juan@test.com");
        dto.setPassword("password123");
        dto.setTelefono("1234567890");

        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> {
            Usuario u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        // Act
        usuarioService.create(dto);

        // Assert
        verify(passwordEncoder).encode("password123");
    }

    @Test
    void update_conDatosValidos_actualizaUsuario() {
        // Arrange
        Long id = 1L;
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan Actualizado");
        dto.setEmail("juan nuevo@test.com");
        dto.setPassword("newpassword");
        dto.setTelefono("0987654321");

        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setId(1L);
        usuarioExistente.setNombre("Juan Perez");
        usuarioExistente.setEmail("juan@test.com");
        usuarioExistente.setPassword("oldEncodedPassword");
        usuarioExistente.setTelefono("1234567890");

        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuarioExistente));
        when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        Usuario resultado = usuarioService.update(id, dto);

        // Assert
        assertThat(resultado.getNombre()).isEqualTo("Juan Actualizado");
        assertThat(resultado.getEmail()).isEqualTo("juan nuevo@test.com");
    }

    @Test
    void update_usuarioNoExistente_lanzaExcepcion() {
        // Arrange
        Long id = 999L;
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Juan");

        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> usuarioService.update(id, dto));
    }

    @Test
    void delete_conIdExistente_eliminaUsuario() {
        // Arrange
        Long id = 1L;
        Usuario usuario = new Usuario();
        usuario.setId(1L);

        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuario));
        doNothing().when(usuarioRepository).delete(usuario);

        // Act
        usuarioService.delete(id);

        // Assert
        verify(usuarioRepository).delete(usuario);
    }

    @Test
    void delete_usuarioNoExistente_lanzaExcepcion() {
        // Arrange
        Long id = 999L;
        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> usuarioService.delete(id));
    }

    @Test
    void getById_conIdExistente_retornaUsuario() {
        // Arrange
        Long id = 1L;
        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNombre("Juan Perez");
        usuario.setEmail("juan@test.com");

        when(usuarioRepository.findById(id)).thenReturn(Optional.of(usuario));

        // Act
        Usuario resultado = usuarioService.getById(id);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(id);
        assertThat(resultado.getNombre()).isEqualTo("Juan Perez");
    }

    @Test
    void getById_usuarioNoExistente_lanzaExcepcion() {
        // Arrange
        Long id = 999L;
        when(usuarioRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> usuarioService.getById(id));
    }

    @Test
    void getAll_retornaTodosLosUsuarios() {
        // Arrange
        Usuario u1 = new Usuario();
        u1.setId(1L);
        u1.setNombre("Juan");

        Usuario u2 = new Usuario();
        u2.setId(2L);
        u2.setNombre("Maria");

        when(usuarioRepository.findAll()).thenReturn(List.of(u1, u2));

        // Act
        List<Usuario> resultado = usuarioService.getAll();

        // Assert
        assertThat(resultado).hasSize(2);
        verify(usuarioRepository).findAll();
    }
}
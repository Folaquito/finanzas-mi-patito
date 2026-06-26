package com.finanzas.service.impl;

import com.finanzas.dto.AuthResponseDTO;
import com.finanzas.exception.BadRequestException;
import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.Usuario;
import com.finanzas.repository.UsuarioRepository;
import com.finanzas.service.AuthService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final long TOKEN_VALIDEZ_MINUTOS = 30;

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthServiceImpl(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponseDTO login(String email, String password) {
        Usuario u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Credenciales inválidas"));
        if (!passwordEncoder.matches(password, u.getPassword())) {
            throw new BadRequestException("Credenciales inválidas");
        }
        return new AuthResponseDTO(u);
    }

    @Override
    public String recuperarClave(String email) {
        Usuario u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        String token = UUID.randomUUID().toString();
        u.setResetToken(token);
        u.setResetTokenExpiracion(LocalDateTime.now().plusMinutes(TOKEN_VALIDEZ_MINUTOS));
        usuarioRepository.save(u);
        // En producción este token se enviaría por correo; aquí se devuelve para la demo.
        return token;
    }

    @Override
    public void resetClave(String token, String nuevaClave) {
        Usuario u = usuarioRepository.findByResetToken(token)
                .orElseThrow(() -> new BadRequestException("Token inválido"));
        if (u.getResetTokenExpiracion() == null || u.getResetTokenExpiracion().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token expirado");
        }
        u.setPassword(passwordEncoder.encode(nuevaClave));
        u.setResetToken(null);
        u.setResetTokenExpiracion(null);
        usuarioRepository.save(u);
    }

    @Override
    public void cambiarPassword(String email, String claveActual, String nuevaClave) {
        Usuario u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (!passwordEncoder.matches(claveActual, u.getPassword())) {
            throw new BadRequestException("Clave actual incorrecta");
        }
        u.setPassword(passwordEncoder.encode(nuevaClave));
        usuarioRepository.save(u);
    }
}

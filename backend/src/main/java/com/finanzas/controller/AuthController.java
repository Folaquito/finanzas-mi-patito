package com.finanzas.controller;

import com.finanzas.dto.AuthResponseDTO;
import com.finanzas.dto.CambiarPasswordDTO;
import com.finanzas.dto.LoginDTO;
import com.finanzas.dto.RecuperarClaveDTO;
import com.finanzas.dto.ResetClaveDTO;
import com.finanzas.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginDTO dto) {
        return ResponseEntity.ok(authService.login(dto.getEmail(), dto.getPassword()));
    }

    @PostMapping("/recuperar")
    public ResponseEntity<Map<String, String>> recuperar(@Valid @RequestBody RecuperarClaveDTO dto) {
        String token = authService.recuperarClave(dto.getEmail());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "mensaje", "Usa este token para restablecer tu contraseña"
        ));
    }

    @PostMapping("/reset-clave")
    public ResponseEntity<Map<String, String>> resetClave(@Valid @RequestBody ResetClaveDTO dto) {
        authService.resetClave(dto.getToken(), dto.getNuevaClave());
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña restablecida correctamente"));
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<Map<String, String>> cambiarPassword(@Valid @RequestBody CambiarPasswordDTO dto) {
        authService.cambiarPassword(dto.getEmail(), dto.getClaveActual(), dto.getNuevaClave());
        return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada correctamente"));
    }
}

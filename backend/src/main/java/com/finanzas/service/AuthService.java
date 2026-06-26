package com.finanzas.service;

import com.finanzas.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO login(String email, String password);
    String recuperarClave(String email);
    void resetClave(String token, String nuevaClave);
    void cambiarPassword(String email, String claveActual, String nuevaClave);
}

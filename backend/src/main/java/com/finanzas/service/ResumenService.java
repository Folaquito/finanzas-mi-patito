package com.finanzas.service;

import com.finanzas.dto.ResumenDTO;

public interface ResumenService {
    ResumenDTO resumenPorUsuario(Long usuarioId);
}

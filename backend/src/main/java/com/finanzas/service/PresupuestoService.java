package com.finanzas.service;

import com.finanzas.dto.PresupuestoDTO;

public interface PresupuestoService {
    PresupuestoDTO presupuestoPorUsuario(Long usuarioId);
}

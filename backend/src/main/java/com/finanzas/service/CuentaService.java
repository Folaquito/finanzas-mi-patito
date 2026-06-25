package com.finanzas.service;

import com.finanzas.dto.CuentaDTO;
import com.finanzas.model.Cuenta;

import java.util.List;

public interface CuentaService {
    Cuenta create(CuentaDTO dto);
    Cuenta update(Long id, CuentaDTO dto);
    void delete(Long id);
    Cuenta getById(Long id);
    List<Cuenta> getAll();
    List<Cuenta> getByUsuarioId(Long usuarioId);
}

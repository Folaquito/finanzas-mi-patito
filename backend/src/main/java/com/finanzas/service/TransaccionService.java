package com.finanzas.service;

import com.finanzas.dto.TransaccionDTO;
import com.finanzas.model.Transaccion;

import java.util.List;

public interface TransaccionService {
    Transaccion create(TransaccionDTO dto);
    Transaccion update(Long id, TransaccionDTO dto);
    void delete(Long id);
    Transaccion getById(Long id);
    List<Transaccion> getByCuentaId(Long cuentaId);
    List<Transaccion> getAll();
}

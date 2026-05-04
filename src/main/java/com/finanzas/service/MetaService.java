package com.finanzas.service;

import com.finanzas.dto.MetaDTO;
import com.finanzas.model.Meta;

import java.util.List;

public interface MetaService {
    Meta create(MetaDTO dto);
    Meta update(Long id, MetaDTO dto);
    void delete(Long id);
    Meta getById(Long id);
    List<Meta> getByUsuarioId(Long usuarioId);
}

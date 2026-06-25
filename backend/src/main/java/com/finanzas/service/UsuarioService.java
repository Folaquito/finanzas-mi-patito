package com.finanzas.service;

import com.finanzas.dto.UsuarioDTO;
import com.finanzas.model.Usuario;

import java.util.List;

public interface UsuarioService {
    Usuario create(UsuarioDTO dto);
    Usuario update(Long id, UsuarioDTO dto);
    void delete(Long id);
    Usuario getById(Long id);
    List<Usuario> getAll();
}

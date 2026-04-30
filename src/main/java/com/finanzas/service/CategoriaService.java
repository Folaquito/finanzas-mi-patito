package com.finanzas.service;

import com.finanzas.model.Categoria;

import java.util.List;

public interface CategoriaService {
    Categoria create(Categoria categoria);
    Categoria update(Long id, Categoria categoria);
    void delete(Long id);
    Categoria getById(Long id);
    List<Categoria> getAll();
}

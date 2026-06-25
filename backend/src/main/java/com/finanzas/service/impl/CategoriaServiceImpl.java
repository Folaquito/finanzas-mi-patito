package com.finanzas.service.impl;

import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.Categoria;
import com.finanzas.repository.CategoriaRepository;
import com.finanzas.service.CategoriaService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaServiceImpl implements CategoriaService {
    private final CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) { this.categoriaRepository = categoriaRepository; }

    @Override
    public Categoria create(Categoria categoria) { return this.categoriaRepository.save(categoria); }

    @Override
    public Categoria update(Long id, Categoria categoria) {
        Categoria c = this.categoriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada"));
        c.setNombre(categoria.getNombre());
        c.setTipo(categoria.getTipo());
        return this.categoriaRepository.save(c);
    }

    @Override
    public void delete(Long id) { this.categoriaRepository.delete(this.categoriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada"))); }

    @Override
    public Categoria getById(Long id) { return this.categoriaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada")); }

    @Override
    public List<Categoria> getAll() { return this.categoriaRepository.findAll(); }
}

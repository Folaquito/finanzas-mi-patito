package com.finanzas.controller;

import com.finanzas.model.Categoria;
import com.finanzas.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) { this.categoriaService = categoriaService; }

    @PostMapping
    public ResponseEntity<Categoria> create(@Valid @RequestBody Categoria categoria) { return ResponseEntity.ok(categoriaService.create(categoria)); }

    @GetMapping
    public ResponseEntity<List<Categoria>> all() { return ResponseEntity.ok(categoriaService.getAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> get(@PathVariable Long id) { return ResponseEntity.ok(categoriaService.getById(id)); }

    @PutMapping("/{id}")
    public ResponseEntity<Categoria> update(@PathVariable Long id, @Valid @RequestBody Categoria categoria) { return ResponseEntity.ok(categoriaService.update(id, categoria)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { categoriaService.delete(id); return ResponseEntity.noContent().build(); }
}

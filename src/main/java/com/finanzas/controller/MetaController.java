package com.finanzas.controller;

import com.finanzas.dto.MetaDTO;
import com.finanzas.model.Meta;
import com.finanzas.service.MetaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metas")
public class MetaController {
    private final MetaService metaService;

    public MetaController(MetaService metaService) { this.metaService = metaService; }

    @PostMapping
    public ResponseEntity<Meta> create(@Valid @RequestBody MetaDTO dto) { return ResponseEntity.ok(metaService.create(dto)); }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Meta>> byUsuario(@PathVariable Long usuarioId) { return ResponseEntity.ok(metaService.getByUsuarioId(usuarioId)); }

    @GetMapping("/{id}")
    public ResponseEntity<Meta> get(@PathVariable Long id) { return ResponseEntity.ok(metaService.getById(id)); }

    @PutMapping("/{id}")
    public ResponseEntity<Meta> update(@PathVariable Long id, @Valid @RequestBody MetaDTO dto) { return ResponseEntity.ok(metaService.update(id, dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { metaService.delete(id); return ResponseEntity.noContent().build(); }
}

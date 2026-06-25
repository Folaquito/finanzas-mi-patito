package com.finanzas.controller;

import com.finanzas.dto.UsuarioDTO;
import com.finanzas.model.Usuario;
import com.finanzas.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) { this.usuarioService = usuarioService; }

    @PostMapping
    public ResponseEntity<Usuario> create(@Valid @RequestBody UsuarioDTO dto) {
        return ResponseEntity.ok(usuarioService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> all() { return ResponseEntity.ok(usuarioService.getAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> get(@PathVariable Long id) { return ResponseEntity.ok(usuarioService.getById(id)); }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Long id, @Valid @RequestBody UsuarioDTO dto) { return ResponseEntity.ok(usuarioService.update(id, dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { usuarioService.delete(id); return ResponseEntity.noContent().build(); }
}

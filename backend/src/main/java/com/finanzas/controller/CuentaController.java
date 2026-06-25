package com.finanzas.controller;

import com.finanzas.dto.CuentaDTO;
import com.finanzas.model.Cuenta;
import com.finanzas.service.CuentaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
public class CuentaController {
    private final CuentaService cuentaService;

    public CuentaController(CuentaService cuentaService) { this.cuentaService = cuentaService; }

    @PostMapping
    public ResponseEntity<Cuenta> create(@Valid @RequestBody CuentaDTO dto) { return ResponseEntity.ok(cuentaService.create(dto)); }

    @GetMapping
    public ResponseEntity<List<Cuenta>> all() { return ResponseEntity.ok(cuentaService.getAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Cuenta> get(@PathVariable Long id) { return ResponseEntity.ok(cuentaService.getById(id)); }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Cuenta>> byUsuario(@PathVariable Long usuarioId) { return ResponseEntity.ok(cuentaService.getByUsuarioId(usuarioId)); }

    @PutMapping("/{id}")
    public ResponseEntity<Cuenta> update(@PathVariable Long id, @Valid @RequestBody CuentaDTO dto) { return ResponseEntity.ok(cuentaService.update(id, dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { cuentaService.delete(id); return ResponseEntity.noContent().build(); }
}

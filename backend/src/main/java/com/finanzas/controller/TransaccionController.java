package com.finanzas.controller;

import com.finanzas.dto.TransaccionDTO;
import com.finanzas.model.Transaccion;
import com.finanzas.service.TransaccionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
public class TransaccionController {
    private final TransaccionService transaccionService;

    public TransaccionController(TransaccionService transaccionService) { this.transaccionService = transaccionService; }

    @PostMapping
    public ResponseEntity<Transaccion> create(@Valid @RequestBody TransaccionDTO dto) { return ResponseEntity.ok(transaccionService.create(dto)); }

    @GetMapping
    public ResponseEntity<List<Transaccion>> all() { return ResponseEntity.ok(transaccionService.getAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<Transaccion> get(@PathVariable Long id) { return ResponseEntity.ok(transaccionService.getById(id)); }

    @GetMapping("/cuenta/{cuentaId}")
    public ResponseEntity<List<Transaccion>> byCuenta(@PathVariable Long cuentaId) { return ResponseEntity.ok(transaccionService.getByCuentaId(cuentaId)); }

    @PutMapping("/{id}")
    public ResponseEntity<Transaccion> update(@PathVariable Long id, @Valid @RequestBody TransaccionDTO dto) { return ResponseEntity.ok(transaccionService.update(id, dto)); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { transaccionService.delete(id); return ResponseEntity.noContent().build(); }
}

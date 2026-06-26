package com.finanzas.controller;

import com.finanzas.dto.PresupuestoDTO;
import com.finanzas.service.PresupuestoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PresupuestoController {
    private final PresupuestoService presupuestoService;

    public PresupuestoController(PresupuestoService presupuestoService) { this.presupuestoService = presupuestoService; }

    @GetMapping("/presupuesto/{usuarioId}")
    public ResponseEntity<PresupuestoDTO> presupuesto(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(presupuestoService.presupuestoPorUsuario(usuarioId));
    }
}

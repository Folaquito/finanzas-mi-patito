package com.finanzas.controller;

import com.finanzas.dto.ResumenDTO;
import com.finanzas.service.ResumenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ResumenController {
    private final ResumenService resumenService;

    public ResumenController(ResumenService resumenService) { this.resumenService = resumenService; }

    @GetMapping("/resumen/{usuarioId}")
    public ResponseEntity<ResumenDTO> resumen(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(resumenService.resumenPorUsuario(usuarioId));
    }
}

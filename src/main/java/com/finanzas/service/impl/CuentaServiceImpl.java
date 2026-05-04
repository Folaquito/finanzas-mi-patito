package com.finanzas.service.impl;

import com.finanzas.dto.CuentaDTO;
import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.Cuenta;
import com.finanzas.model.Usuario;
import com.finanzas.repository.CuentaRepository;
import com.finanzas.repository.UsuarioRepository;
import com.finanzas.service.CuentaService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuentaServiceImpl implements CuentaService {

    private final CuentaRepository cuentaRepository;
    private final UsuarioRepository usuarioRepository;

    public CuentaServiceImpl(CuentaRepository cuentaRepository, UsuarioRepository usuarioRepository) {
        this.cuentaRepository = cuentaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Cuenta create(CuentaDTO dto) {
        Usuario u = usuarioRepository.findById(dto.getUsuarioId()).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado para la cuenta"));
        Cuenta c = new Cuenta();
        c.setNombre(dto.getNombre());
        c.setTipo(dto.getTipo());
        c.setSaldo(dto.getSaldo() == null ? c.getSaldo() : dto.getSaldo());
        c.setUsuario(u);
        return cuentaRepository.save(c);
    }

    @Override
    public Cuenta update(Long id, CuentaDTO dto) {
        Cuenta c = cuentaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada"));
        c.setNombre(dto.getNombre());
        c.setTipo(dto.getTipo());
        if (dto.getSaldo() != null) c.setSaldo(dto.getSaldo());
        return cuentaRepository.save(c);
    }

    @Override
    public void delete(Long id) {
        Cuenta c = cuentaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada"));
        cuentaRepository.delete(c);
    }

    @Override
    public Cuenta getById(Long id) {
        return cuentaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada"));
    }

    @Override
    public List<Cuenta> getAll() { return cuentaRepository.findAll(); }

    @Override
    public List<Cuenta> getByUsuarioId(Long usuarioId) { return cuentaRepository.findByUsuarioId(usuarioId); }
}

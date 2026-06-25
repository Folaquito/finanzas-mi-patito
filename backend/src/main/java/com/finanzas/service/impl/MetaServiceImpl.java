package com.finanzas.service.impl;

import com.finanzas.dto.MetaDTO;
import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.Meta;
import com.finanzas.model.Usuario;
import com.finanzas.repository.MetaRepository;
import com.finanzas.repository.UsuarioRepository;
import com.finanzas.service.MetaService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MetaServiceImpl implements MetaService {
    private final MetaRepository metaRepository;
    private final UsuarioRepository usuarioRepository;

    public MetaServiceImpl(MetaRepository metaRepository, UsuarioRepository usuarioRepository) {
        this.metaRepository = metaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public Meta create(MetaDTO dto) {
        Usuario u = usuarioRepository.findById(dto.getUsuarioId()).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Meta m = new Meta();
        m.setUsuario(u);
        m.setNombre(dto.getNombre());
        m.setMontoObjetivo(dto.getMontoObjetivo());
        if (dto.getMontoActual() != null) m.setMontoActual(dto.getMontoActual());
        m.setFechaLimite(dto.getFechaLimite());
        return metaRepository.save(m);
    }

    @Override
    public Meta update(Long id, MetaDTO dto) {
        Meta m = metaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Meta no encontrada"));
        m.setNombre(dto.getNombre());
        if (dto.getMontoObjetivo() != null) m.setMontoObjetivo(dto.getMontoObjetivo());
        if (dto.getMontoActual() != null) m.setMontoActual(dto.getMontoActual());
        m.setFechaLimite(dto.getFechaLimite());
        return metaRepository.save(m);
    }

    @Override
    public void delete(Long id) { metaRepository.delete(metaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Meta no encontrada"))); }

    @Override
    public Meta getById(Long id) { return metaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Meta no encontrada")); }

    @Override
    public List<Meta> getByUsuarioId(Long usuarioId) { return metaRepository.findByUsuarioId(usuarioId); }
}

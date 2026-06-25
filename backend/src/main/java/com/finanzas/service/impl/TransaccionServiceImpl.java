package com.finanzas.service.impl;

import com.finanzas.dto.TransaccionDTO;
import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.*;
import com.finanzas.repository.CuentaRepository;
import com.finanzas.repository.CategoriaRepository;
import com.finanzas.repository.TransaccionRepository;
import com.finanzas.service.TransaccionService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TransaccionServiceImpl implements TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final CuentaRepository cuentaRepository;
    private final CategoriaRepository categoriaRepository;

    public TransaccionServiceImpl(TransaccionRepository transaccionRepository, CuentaRepository cuentaRepository, CategoriaRepository categoriaRepository) {
        this.transaccionRepository = transaccionRepository;
        this.cuentaRepository = cuentaRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public Transaccion create(TransaccionDTO dto) {
        Cuenta cuenta = cuentaRepository.findById(dto.getCuentaId()).orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada"));
        Categoria categoria = null;
        if (dto.getCategoriaId() != null) categoria = categoriaRepository.findById(dto.getCategoriaId()).orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada"));

        Transaccion t = new Transaccion();
        t.setCuenta(cuenta);
        t.setCategoria(categoria);
        t.setMonto(dto.getMonto());
        t.setTipo(dto.getTipo());
        t.setTipoMovimiento(dto.getTipoMovimiento());
        t.setDescripcion(dto.getDescripcion());
        t.setFecha(dto.getFecha() == null ? t.getFecha() : dto.getFecha());
        t.setBancoOrigen(dto.getBancoOrigen());
        t.setBancoDestino(dto.getBancoDestino());
        t.setNombreOrigen(dto.getNombreOrigen());
        t.setNombreDestino(dto.getNombreDestino());
        t.setCuentaOrigen(dto.getCuentaOrigen());
        t.setCuentaDestino(dto.getCuentaDestino());
        t.setReferencia(dto.getReferencia());

        applySaldo(cuenta, dto.getMonto(), dto.getTipo());
        cuentaRepository.save(cuenta);
        return transaccionRepository.save(t);
    }

    @Override
    public Transaccion update(Long id, TransaccionDTO dto) {
        Transaccion t = transaccionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transaccion no encontrada"));
        Cuenta cuenta = cuentaRepository.findById(dto.getCuentaId()).orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada"));

        // revert previous impact
        revertSaldo(t.getCuenta(), t.getMonto(), t.getTipo());

        t.setCuenta(cuenta);
        if (dto.getCategoriaId() != null) t.setCategoria(categoriaRepository.findById(dto.getCategoriaId()).orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada")));
        t.setMonto(dto.getMonto());
        t.setTipo(dto.getTipo());
        t.setTipoMovimiento(dto.getTipoMovimiento());
        t.setDescripcion(dto.getDescripcion());
        t.setFecha(dto.getFecha() == null ? t.getFecha() : dto.getFecha());
        t.setBancoOrigen(dto.getBancoOrigen());
        t.setBancoDestino(dto.getBancoDestino());
        t.setNombreOrigen(dto.getNombreOrigen());
        t.setNombreDestino(dto.getNombreDestino());
        t.setCuentaOrigen(dto.getCuentaOrigen());
        t.setCuentaDestino(dto.getCuentaDestino());
        t.setReferencia(dto.getReferencia());

        applySaldo(cuenta, dto.getMonto(), dto.getTipo());
        cuentaRepository.save(cuenta);
        return transaccionRepository.save(t);
    }

    @Override
    public void delete(Long id) {
        Transaccion t = transaccionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transaccion no encontrada"));
        revertSaldo(t.getCuenta(), t.getMonto(), t.getTipo());
        cuentaRepository.save(t.getCuenta());
        transaccionRepository.delete(t);
    }

    @Override
    public Transaccion getById(Long id) { return transaccionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transaccion no encontrada")); }

    @Override
    public List<Transaccion> getByCuentaId(Long cuentaId) { return transaccionRepository.findByCuentaId(cuentaId); }

    @Override
    public List<Transaccion> getAll() { return transaccionRepository.findAll(); }

    private void applySaldo(Cuenta cuenta, java.math.BigDecimal monto, TipoTransaccion tipo) {
        if (monto == null) return;
        if (tipo == TipoTransaccion.INGRESO) {
            cuenta.setSaldo(cuenta.getSaldo().add(monto));
        } else if (tipo == TipoTransaccion.GASTO) {
            cuenta.setSaldo(cuenta.getSaldo().subtract(monto));
        }
    }

    private void revertSaldo(Cuenta cuenta, java.math.BigDecimal monto, TipoTransaccion tipo) {
        if (monto == null) return;
        if (tipo == TipoTransaccion.INGRESO) {
            cuenta.setSaldo(cuenta.getSaldo().subtract(monto));
        } else if (tipo == TipoTransaccion.GASTO) {
            cuenta.setSaldo(cuenta.getSaldo().add(monto));
        }
    }
}

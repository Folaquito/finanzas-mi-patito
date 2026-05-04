package com.finanzas.service.impl;

import com.finanzas.dto.ResumenDTO;
import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.Cuenta;
import com.finanzas.model.Transaccion;
import com.finanzas.model.TipoTransaccion;
import com.finanzas.repository.CuentaRepository;
import com.finanzas.repository.TransaccionRepository;
import com.finanzas.repository.UsuarioRepository;
import com.finanzas.service.ResumenService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ResumenServiceImpl implements ResumenService {

    private final CuentaRepository cuentaRepository;
    private final TransaccionRepository transaccionRepository;
    private final UsuarioRepository usuarioRepository;

    public ResumenServiceImpl(CuentaRepository cuentaRepository, TransaccionRepository transaccionRepository, UsuarioRepository usuarioRepository) {
        this.cuentaRepository = cuentaRepository;
        this.transaccionRepository = transaccionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public ResumenDTO resumenPorUsuario(Long usuarioId) {
        this.usuarioRepository.findById(usuarioId).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        List<Cuenta> cuentas = this.cuentaRepository.findByUsuarioId(usuarioId);
        BigDecimal totalIngresos = BigDecimal.ZERO;
        BigDecimal totalGastos = BigDecimal.ZERO;

        for (Cuenta c : cuentas) {
            List<Transaccion> trans = this.transaccionRepository.findByCuentaId(c.getId());
            for (Transaccion t : trans) {
                if (t.getTipo() == TipoTransaccion.INGRESO) totalIngresos = totalIngresos.add(t.getMonto());
                else if (t.getTipo() == TipoTransaccion.GASTO) totalGastos = totalGastos.add(t.getMonto());
            }
        }

        BigDecimal balance = totalIngresos.subtract(totalGastos);
        return new ResumenDTO(totalIngresos, totalGastos, balance);
    }
}

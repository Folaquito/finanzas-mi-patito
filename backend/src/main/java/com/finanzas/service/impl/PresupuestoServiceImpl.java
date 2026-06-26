package com.finanzas.service.impl;

import com.finanzas.dto.LineaPresupuestoDTO;
import com.finanzas.dto.PresupuestoDTO;
import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.Cuenta;
import com.finanzas.model.TipoCategoria;
import com.finanzas.model.TipoTransaccion;
import com.finanzas.model.Transaccion;
import com.finanzas.repository.CuentaRepository;
import com.finanzas.repository.TransaccionRepository;
import com.finanzas.repository.UsuarioRepository;
import com.finanzas.service.PresupuestoService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class PresupuestoServiceImpl implements PresupuestoService {

    // Regla 50/30/20: distribución del ingreso por tipo de categoría.
    private static final int PORCENTAJE_NECESIDAD = 50;
    private static final int PORCENTAJE_DESEO = 30;
    private static final int PORCENTAJE_AHORRO = 20;

    private final CuentaRepository cuentaRepository;
    private final TransaccionRepository transaccionRepository;
    private final UsuarioRepository usuarioRepository;

    public PresupuestoServiceImpl(CuentaRepository cuentaRepository, TransaccionRepository transaccionRepository, UsuarioRepository usuarioRepository) {
        this.cuentaRepository = cuentaRepository;
        this.transaccionRepository = transaccionRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public PresupuestoDTO presupuestoPorUsuario(Long usuarioId) {
        this.usuarioRepository.findById(usuarioId).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        BigDecimal totalIngresos = BigDecimal.ZERO;
        Map<TipoCategoria, BigDecimal> gastoPorTipo = new EnumMap<>(TipoCategoria.class);
        for (TipoCategoria tipo : TipoCategoria.values()) {
            gastoPorTipo.put(tipo, BigDecimal.ZERO);
        }

        List<Cuenta> cuentas = this.cuentaRepository.findByUsuarioId(usuarioId);
        for (Cuenta c : cuentas) {
            for (Transaccion t : this.transaccionRepository.findByCuentaId(c.getId())) {
                if (t.getTipo() == TipoTransaccion.INGRESO) {
                    totalIngresos = totalIngresos.add(t.getMonto());
                } else if (t.getTipo() == TipoTransaccion.GASTO && t.getCategoria() != null && t.getCategoria().getTipo() != null) {
                    TipoCategoria tipo = t.getCategoria().getTipo();
                    gastoPorTipo.put(tipo, gastoPorTipo.get(tipo).add(t.getMonto()));
                }
            }
        }

        // CLP no usa decimales: se trabaja con montos enteros.
        totalIngresos = totalIngresos.setScale(0, RoundingMode.HALF_UP);
        BigDecimal presupuestoNecesidad = porcentajeDe(totalIngresos, PORCENTAJE_NECESIDAD);
        BigDecimal presupuestoDeseo = porcentajeDe(totalIngresos, PORCENTAJE_DESEO);
        // El ahorro toma el remanente para que las tres líneas sumen exactamente el ingreso.
        BigDecimal presupuestoAhorro = totalIngresos.subtract(presupuestoNecesidad).subtract(presupuestoDeseo);

        List<LineaPresupuestoDTO> lineas = new ArrayList<>();
        lineas.add(new LineaPresupuestoDTO(TipoCategoria.NECESIDAD, PORCENTAJE_NECESIDAD, presupuestoNecesidad, gastoEnPesos(gastoPorTipo, TipoCategoria.NECESIDAD)));
        lineas.add(new LineaPresupuestoDTO(TipoCategoria.DESEO, PORCENTAJE_DESEO, presupuestoDeseo, gastoEnPesos(gastoPorTipo, TipoCategoria.DESEO)));
        lineas.add(new LineaPresupuestoDTO(TipoCategoria.AHORRO, PORCENTAJE_AHORRO, presupuestoAhorro, gastoEnPesos(gastoPorTipo, TipoCategoria.AHORRO)));

        return new PresupuestoDTO(totalIngresos, lineas);
    }

    private BigDecimal porcentajeDe(BigDecimal monto, int porcentaje) {
        return monto.multiply(BigDecimal.valueOf(porcentaje))
                .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
    }

    private BigDecimal gastoEnPesos(Map<TipoCategoria, BigDecimal> gastoPorTipo, TipoCategoria tipo) {
        return gastoPorTipo.get(tipo).setScale(0, RoundingMode.HALF_UP);
    }
}

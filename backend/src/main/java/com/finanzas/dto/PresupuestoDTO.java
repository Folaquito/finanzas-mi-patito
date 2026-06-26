package com.finanzas.dto;

import java.math.BigDecimal;
import java.util.List;

public class PresupuestoDTO {
    private BigDecimal totalIngresos;
    private List<LineaPresupuestoDTO> lineas;

    public PresupuestoDTO() {}

    public PresupuestoDTO(BigDecimal totalIngresos, List<LineaPresupuestoDTO> lineas) {
        this.totalIngresos = totalIngresos;
        this.lineas = lineas;
    }

    // getters and setters
    public BigDecimal getTotalIngresos() { return this.totalIngresos; }
    public void setTotalIngresos(BigDecimal totalIngresos) { this.totalIngresos = totalIngresos; }
    public List<LineaPresupuestoDTO> getLineas() { return this.lineas; }
    public void setLineas(List<LineaPresupuestoDTO> lineas) { this.lineas = lineas; }
}

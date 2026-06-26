package com.finanzas.dto;

import com.finanzas.model.TipoCategoria;

import java.math.BigDecimal;

public class LineaPresupuestoDTO {
    private TipoCategoria categoria;
    private int porcentajeObjetivo;
    private BigDecimal presupuestado;
    private BigDecimal gastado;
    private BigDecimal disponible;

    public LineaPresupuestoDTO() {}

    public LineaPresupuestoDTO(TipoCategoria categoria, int porcentajeObjetivo, BigDecimal presupuestado, BigDecimal gastado) {
        this.categoria = categoria;
        this.porcentajeObjetivo = porcentajeObjetivo;
        this.presupuestado = presupuestado;
        this.gastado = gastado;
        this.disponible = presupuestado.subtract(gastado);
    }

    // getters and setters
    public TipoCategoria getCategoria() { return this.categoria; }
    public void setCategoria(TipoCategoria categoria) { this.categoria = categoria; }
    public int getPorcentajeObjetivo() { return this.porcentajeObjetivo; }
    public void setPorcentajeObjetivo(int porcentajeObjetivo) { this.porcentajeObjetivo = porcentajeObjetivo; }
    public BigDecimal getPresupuestado() { return this.presupuestado; }
    public void setPresupuestado(BigDecimal presupuestado) { this.presupuestado = presupuestado; }
    public BigDecimal getGastado() { return this.gastado; }
    public void setGastado(BigDecimal gastado) { this.gastado = gastado; }
    public BigDecimal getDisponible() { return this.disponible; }
    public void setDisponible(BigDecimal disponible) { this.disponible = disponible; }
}

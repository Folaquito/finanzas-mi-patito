package com.finanzas.dto;

import com.finanzas.model.TipoMovimiento;
import com.finanzas.model.TipoTransaccion;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransaccionDTO {
    private Long id;
    private Long cuentaId;
    private Long categoriaId;

    @NotNull
    private BigDecimal monto;

    private TipoTransaccion tipo;
    private TipoMovimiento tipoMovimiento;
    private String descripcion;
    private LocalDateTime fecha;
    private String bancoOrigen;
    private String bancoDestino;
    private String nombreOrigen;
    private String nombreDestino;
    private String cuentaOrigen;
    private String cuentaDestino;
    private String referencia;

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCuentaId() { return cuentaId; }
    public void setCuentaId(Long cuentaId) { this.cuentaId = cuentaId; }
    public Long getCategoriaId() { return categoriaId; }
    public void setCategoriaId(Long categoriaId) { this.categoriaId = categoriaId; }
    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }
    public TipoTransaccion getTipo() { return tipo; }
    public void setTipo(TipoTransaccion tipo) { this.tipo = tipo; }
    public TipoMovimiento getTipoMovimiento() { return tipoMovimiento; }
    public void setTipoMovimiento(TipoMovimiento tipoMovimiento) { this.tipoMovimiento = tipoMovimiento; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }
    public String getBancoOrigen() { return bancoOrigen; }
    public void setBancoOrigen(String bancoOrigen) { this.bancoOrigen = bancoOrigen; }
    public String getBancoDestino() { return bancoDestino; }
    public void setBancoDestino(String bancoDestino) { this.bancoDestino = bancoDestino; }
    public String getNombreOrigen() { return nombreOrigen; }
    public void setNombreOrigen(String nombreOrigen) { this.nombreOrigen = nombreOrigen; }
    public String getNombreDestino() { return nombreDestino; }
    public void setNombreDestino(String nombreDestino) { this.nombreDestino = nombreDestino; }
    public String getCuentaOrigen() { return cuentaOrigen; }
    public void setCuentaOrigen(String cuentaOrigen) { this.cuentaOrigen = cuentaOrigen; }
    public String getCuentaDestino() { return cuentaDestino; }
    public void setCuentaDestino(String cuentaDestino) { this.cuentaDestino = cuentaDestino; }
    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }
}

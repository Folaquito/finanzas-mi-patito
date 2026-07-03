package com.finanzas.dto;

import java.math.BigDecimal;

/**
 * Resumen del resultado de importar una cartola bancaria a una cuenta.
 */
public class ImportacionCartolaDTO {
    private int transaccionesImportadas;
    private int ingresos;
    private int gastos;
    private BigDecimal totalAbonos;
    private BigDecimal totalCargos;
    private String mensaje;

    public ImportacionCartolaDTO() {
    }

    public ImportacionCartolaDTO(int transaccionesImportadas, int ingresos, int gastos,
                                 BigDecimal totalAbonos, BigDecimal totalCargos, String mensaje) {
        this.transaccionesImportadas = transaccionesImportadas;
        this.ingresos = ingresos;
        this.gastos = gastos;
        this.totalAbonos = totalAbonos;
        this.totalCargos = totalCargos;
        this.mensaje = mensaje;
    }

    public int getTransaccionesImportadas() { return transaccionesImportadas; }
    public void setTransaccionesImportadas(int transaccionesImportadas) { this.transaccionesImportadas = transaccionesImportadas; }
    public int getIngresos() { return ingresos; }
    public void setIngresos(int ingresos) { this.ingresos = ingresos; }
    public int getGastos() { return gastos; }
    public void setGastos(int gastos) { this.gastos = gastos; }
    public BigDecimal getTotalAbonos() { return totalAbonos; }
    public void setTotalAbonos(BigDecimal totalAbonos) { this.totalAbonos = totalAbonos; }
    public BigDecimal getTotalCargos() { return totalCargos; }
    public void setTotalCargos(BigDecimal totalCargos) { this.totalCargos = totalCargos; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
}

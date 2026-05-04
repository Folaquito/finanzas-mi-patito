package com.finanzas.dto;

import java.math.BigDecimal;

public class ResumenDTO {
    private BigDecimal totalIngresos;
    private BigDecimal totalGastos;
    private BigDecimal balance;

    public ResumenDTO() {}
    public ResumenDTO(BigDecimal ingresos, BigDecimal gastos, BigDecimal balance) {
        this.totalIngresos = ingresos;
        this.totalGastos = gastos;
        this.balance = balance;
    }

    public BigDecimal getTotalIngresos() { return totalIngresos; }
    public void setTotalIngresos(BigDecimal totalIngresos) { this.totalIngresos = totalIngresos; }
    public BigDecimal getTotalGastos() { return totalGastos; }
    public void setTotalGastos(BigDecimal totalGastos) { this.totalGastos = totalGastos; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}

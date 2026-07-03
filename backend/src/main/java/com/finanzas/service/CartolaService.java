package com.finanzas.service;

import com.finanzas.dto.ImportacionCartolaDTO;
import org.springframework.web.multipart.MultipartFile;

public interface CartolaService {
    /**
     * Lee una cartola bancaria (.xls/.xlsx), registra cada movimiento como una
     * transaccion de la cuenta indicada y ajusta el saldo. Los cargos se
     * registran como GASTO (clasificado segun la regla 50/30/20) y los abonos
     * como INGRESO.
     */
    ImportacionCartolaDTO importar(Long cuentaId, MultipartFile archivo);
}

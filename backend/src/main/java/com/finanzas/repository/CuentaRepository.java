package com.finanzas.repository;

import com.finanzas.model.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CuentaRepository extends JpaRepository<Cuenta, Long> {
    List<Cuenta> findByUsuarioId(Long usuarioId);
}

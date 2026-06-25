package com.finanzas.repository;

import com.finanzas.model.Meta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MetaRepository extends JpaRepository<Meta, Long> {
    List<Meta> findByUsuarioId(Long usuarioId);
}

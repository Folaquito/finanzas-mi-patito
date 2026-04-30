package com.finanzas.config;

import com.finanzas.model.*;
import com.finanzas.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Configuration
public class DataLoader {
    @Bean
    CommandLineRunner initData(UsuarioRepository usuarioRepository, CuentaRepository cuentaRepository, CategoriaRepository categoriaRepository, MetaRepository metaRepository, BCryptPasswordEncoder encoder) {
        return args -> {
            if (usuarioRepository.count() == 0) {
                Usuario u = new Usuario();
                u.setNombre("Admin");
                u.setEmail("admin@patito.com");
                u.setPassword(encoder.encode("password"));
                usuarioRepository.save(u);

                Cuenta c = new Cuenta();
                c.setNombre("Cuenta Principal");
                c.setTipo("Ahorros");
                c.setSaldo(new BigDecimal("1000.00"));
                c.setUsuario(u);
                cuentaRepository.save(c);

                Categoria cat = new Categoria();
                cat.setNombre("Sueldo");
                cat.setTipo(TipoCategoria.NECESIDAD);
                categoriaRepository.save(cat);

                Meta m = new Meta();
                m.setUsuario(u);
                m.setNombre("Vacaciones");
                m.setMontoObjetivo(new BigDecimal("2000.00"));
                m.setFechaLimite(LocalDate.now().plusMonths(6));
                metaRepository.save(m);
            }
        };
    }
}

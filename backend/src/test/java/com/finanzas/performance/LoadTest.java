package com.finanzas.performance;

import com.finanzas.dto.UsuarioDTO;
import com.finanzas.model.Usuario;
import com.finanzas.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pruebas de Carga y Estress para el sistema de finanzas-mi-patito
 *
 * Criterios de Rendimiento:
 * - CR-001: El sistema debe responder en menos de 200ms para operaciones basicas
 * - CR-002: El sistema debe soportar al menos 100 usuarios concurrentes
 * - CR-003: La base de datos debe manejar 10,000 registros sin degradacion
 * - CR-004: El tiempo de respuesta no debe exceder 1 segundo bajo carga normal
 */
@SpringBootTest
@AutoConfigureMockMvc
public class LoadTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void carga_con100UsuariosConcurrentes_respuestaExitosa() throws Exception {
        // Configuracion: 100 usuarios concurrentes
        int usuariosConcurrentes = 100;
        ExecutorService executor = Executors.newFixedThreadPool(usuariosConcurrentes);
        AtomicInteger exitosos = new AtomicInteger(0);
        AtomicInteger fallidos = new AtomicInteger(0);

        // Preparar datos de usuario
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Usuario Prueba");
        dto.setEmail("carga@test.com");
        dto.setPassword("password123");
        dto.setTelefono("1234567890");

        String jsonContent = objectMapper.writeValueAsString(dto);

        // Ejecutar prueba de carga
        for (int i = 0; i < usuariosConcurrentes; i++) {
            final int indice = i;
            executor.submit(() -> {
                try {
                    ResultActions resultado = mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonContent.replace("carga@test.com", "carga" + indice + "@test.com")));

                    int status = resultado.andReturn().getResponse().getStatus();
                    if (status == 200 || status == 201) {
                        exitosos.incrementAndGet();
                    } else {
                        fallidos.incrementAndGet();
                    }
                } catch (Exception e) {
                    fallidos.incrementAndGet();
                }
            });
        }

        // Esperar a que terminen todas las tareas
        executor.shutdown();
        executor.awaitTermination(60, TimeUnit.SECONDS);

        // Verificar resultados
        System.out.println("Usuarios exitosos: " + exitosos.get());
        System.out.println("Usuarios fallidos: " + fallidos.get());

        // CR-002: Al menos 90% de exitos
        assertThat(exitosos.get()).isGreaterThan((int)(usuariosConcurrentes * 0.9));
    }

    @Test
    void carga_lista100Usuarios_tiempoMenorA1Segundo() throws Exception {
        // Preparar datos
        for (int i = 0; i < 100; i++) {
            Usuario usuario = new Usuario();
            usuario.setNombre("Usuario " + i);
            usuario.setEmail("user" + i + "@test.com");
            usuario.setPassword("password123");
            usuario.setTelefono("123456789" + i);
            usuarioRepository.save(usuario);
        }

        // Medir tiempo de respuesta
        long tiempoInicio = System.currentTimeMillis();

        ResultActions resultado = mockMvc.perform(get("/api/usuarios"));

        long tiempoFin = System.currentTimeMillis();
        long tiempoTotal = tiempoFin - tiempoInicio;

        // CR-001: Tiempo menor a 1000ms
        System.out.println("Tiempo de respuesta: " + tiempoTotal + "ms");
        assertThat(tiempoTotal).isLessThan(1000);

        resultado.andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk());
    }

    @Test
    void carga_consultaRepetida_100Veces_respuestaConsistente() throws Exception {
        // Preparar un usuario
        Usuario usuario = new Usuario();
        usuario.setNombre("Usuario Prueba");
        usuario.setEmail("prueba@test.com");
        usuario.setPassword("password123");
        usuario.setTelefono("1234567890");
        Usuario guardado = usuarioRepository.save(usuario);

        long tiempoTotal = 0;

        // Realizar 100 consultas
        for (int i = 0; i < 100; i++) {
            long inicio = System.currentTimeMillis();

            mockMvc.perform(get("/api/usuarios/" + guardado.getId()))
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk());

            long fin = System.currentTimeMillis();
            tiempoTotal += (fin - inicio);
        }

        long promedio = tiempoTotal / 100;
        System.out.println("Tiempo promedio por consulta: " + promedio + "ms");

        // CR-001: Promedio menor a 200ms
        assertThat(promedio).isLessThan(200);
    }
}
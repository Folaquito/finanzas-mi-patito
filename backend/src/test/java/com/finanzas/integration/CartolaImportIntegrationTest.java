package com.finanzas.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finanzas.dto.CuentaDTO;
import com.finanzas.dto.UsuarioDTO;
import com.finanzas.repository.TransaccionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifica la importacion de una cartola bancaria real (Banco de Chile) de
 * extremo a extremo: subida del archivo, registro de transacciones, ajuste de
 * saldo y alimentacion de la regla 50/30/20.
 *
 * Los totales esperados se contrastan contra los que la propia cartola declara
 * en su encabezado: Total Cargos = 194.826 y Total Abonos = 281.040.
 */
@SpringBootTest
@AutoConfigureMockMvc
class CartolaImportIntegrationTest {

    private static final BigDecimal TOTAL_CARGOS = new BigDecimal("194826");
    private static final BigDecimal TOTAL_ABONOS = new BigDecimal("281040");
    private static final int MOVIMIENTOS = 36;
    private static final int INGRESOS = 7;
    private static final int GASTOS = 29;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransaccionRepository transaccionRepository;

    private Long crearUsuario() throws Exception {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setNombre("Cartola Tester");
        dto.setEmail("cartola-" + System.nanoTime() + "@test.com");
        dto.setPassword("password123");
        dto.setTelefono("1234567890");

        String body = mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).get("id").asLong();
    }

    private Long crearCuenta(Long usuarioId) throws Exception {
        CuentaDTO dto = new CuentaDTO();
        dto.setUsuarioId(usuarioId);
        dto.setNombre("Cuenta Corriente");
        dto.setTipo("Corriente");
        dto.setSaldo(BigDecimal.ZERO);

        String body = mockMvc.perform(post("/api/cuentas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).get("id").asLong();
    }

    private MockMultipartFile cartola() throws Exception {
        byte[] bytes = new ClassPathResource("cartola-ejemplo.xls").getInputStream().readAllBytes();
        return new MockMultipartFile("archivo", "cartola.xls", "application/vnd.ms-excel", bytes);
    }

    @Test
    void importar_cartolaReal_registraTodosLosMovimientos() throws Exception {
        Long usuarioId = crearUsuario();
        Long cuentaId = crearCuenta(usuarioId);

        mockMvc.perform(multipart("/api/transacciones/importar")
                        .file(cartola())
                        .param("cuentaId", cuentaId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.transaccionesImportadas").value(MOVIMIENTOS))
                .andExpect(jsonPath("$.ingresos").value(INGRESOS))
                .andExpect(jsonPath("$.gastos").value(GASTOS))
                .andExpect(jsonPath("$.totalCargos").value(TOTAL_CARGOS.intValue()))
                .andExpect(jsonPath("$.totalAbonos").value(TOTAL_ABONOS.intValue()));

        assertThat(transaccionRepository.findByCuentaId(cuentaId)).hasSize(MOVIMIENTOS);
    }

    @Test
    void importar_cartolaReal_actualizaSaldoDeLaCuenta() throws Exception {
        Long usuarioId = crearUsuario();
        Long cuentaId = crearCuenta(usuarioId);

        mockMvc.perform(multipart("/api/transacciones/importar")
                        .file(cartola())
                        .param("cuentaId", cuentaId.toString()))
                .andExpect(status().isOk());

        // Saldo = abonos - cargos = 281.040 - 194.826 = 86.214
        String body = mockMvc.perform(get("/api/cuentas/" + cuentaId))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        BigDecimal saldo = new BigDecimal(objectMapper.readTree(body).get("saldo").asText());
        assertThat(saldo).isEqualByComparingTo(TOTAL_ABONOS.subtract(TOTAL_CARGOS));
    }

    @Test
    void importar_cartolaReal_alimentaLaRegla503020() throws Exception {
        Long usuarioId = crearUsuario();
        Long cuentaId = crearCuenta(usuarioId);

        mockMvc.perform(multipart("/api/transacciones/importar")
                        .file(cartola())
                        .param("cuentaId", cuentaId.toString()))
                .andExpect(status().isOk());

        String body = mockMvc.perform(get("/api/presupuesto/" + usuarioId))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JsonNode presupuesto = objectMapper.readTree(body);

        // El ingreso base de la regla 50/30/20 es el total de abonos de la cartola.
        assertThat(new BigDecimal(presupuesto.get("totalIngresos").asText()))
                .isEqualByComparingTo(TOTAL_ABONOS);

        JsonNode lineas = presupuesto.get("lineas");
        assertThat(lineas).hasSize(3);

        // Como cada gasto importado queda clasificado en una categoria con tipo,
        // la suma de lo gastado en las tres lineas debe igualar el total de cargos.
        BigDecimal gastadoTotal = BigDecimal.ZERO;
        for (JsonNode linea : lineas) {
            gastadoTotal = gastadoTotal.add(new BigDecimal(linea.get("gastado").asText()));
        }
        assertThat(gastadoTotal).isEqualByComparingTo(TOTAL_CARGOS);
    }

    @Test
    void importar_sinArchivo_esRechazado() throws Exception {
        Long usuarioId = crearUsuario();
        Long cuentaId = crearCuenta(usuarioId);

        MockMultipartFile vacio = new MockMultipartFile("archivo", "vacio.xls",
                "application/vnd.ms-excel", new byte[0]);

        mockMvc.perform(multipart("/api/transacciones/importar")
                        .file(vacio)
                        .param("cuentaId", cuentaId.toString()))
                .andExpect(status().isBadRequest());
    }
}

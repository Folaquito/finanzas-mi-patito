package com.finanzas.service.impl;

import com.finanzas.dto.ImportacionCartolaDTO;
import com.finanzas.dto.TransaccionDTO;
import com.finanzas.exception.BadRequestException;
import com.finanzas.exception.ResourceNotFoundException;
import com.finanzas.model.Categoria;
import com.finanzas.model.TipoMovimiento;
import com.finanzas.model.TipoTransaccion;
import com.finanzas.repository.CategoriaRepository;
import com.finanzas.repository.CuentaRepository;
import com.finanzas.service.CartolaService;
import com.finanzas.service.TransaccionService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Importador de cartolas bancarias en formato Excel (Banco de Chile).
 * Detecta la fila de encabezado "Fecha / Descripcion / Cargos / Abonos" y
 * transforma cada movimiento en una transaccion de la cuenta destino.
 */
@Service
public class CartolaServiceImpl implements CartolaService {

    private static final DateTimeFormatter FORMATO_FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final CuentaRepository cuentaRepository;
    private final CategoriaRepository categoriaRepository;
    private final TransaccionService transaccionService;

    public CartolaServiceImpl(CuentaRepository cuentaRepository, CategoriaRepository categoriaRepository,
                              TransaccionService transaccionService) {
        this.cuentaRepository = cuentaRepository;
        this.categoriaRepository = categoriaRepository;
        this.transaccionService = transaccionService;
    }

    @Override
    public ImportacionCartolaDTO importar(Long cuentaId, MultipartFile archivo) {
        cuentaRepository.findById(cuentaId)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada"));
        if (archivo == null || archivo.isEmpty()) {
            throw new BadRequestException("Debe adjuntar un archivo de cartola.");
        }

        Map<String, Long> categoriasPorNombre = cargarCategorias();
        DataFormatter formateador = new DataFormatter();

        int importadas = 0;
        int ingresos = 0;
        int gastos = 0;
        BigDecimal totalAbonos = BigDecimal.ZERO;
        BigDecimal totalCargos = BigDecimal.ZERO;

        try (InputStream in = archivo.getInputStream();
             Workbook libro = WorkbookFactory.create(in)) {

            Sheet hoja = libro.getSheetAt(0);
            Encabezado enc = localizarEncabezado(hoja, formateador);

            for (int i = enc.fila + 1; i <= hoja.getLastRowNum(); i++) {
                Row fila = hoja.getRow(i);
                if (fila == null) {
                    continue;
                }

                String fechaTexto = leerTexto(fila, enc.colFecha, formateador);
                LocalDate fecha = parsearFecha(fechaTexto);
                if (fecha == null) {
                    continue; // filas vacias, subtotales o pie de pagina
                }

                BigDecimal cargos = leerMonto(fila, enc.colCargos);
                BigDecimal abonos = leerMonto(fila, enc.colAbonos);
                String descripcion = leerTexto(fila, enc.colDesc, formateador);
                String canal = enc.colCanal >= 0 ? leerTexto(fila, enc.colCanal, formateador) : null;

                TransaccionDTO dto = new TransaccionDTO();
                dto.setCuentaId(cuentaId);
                dto.setDescripcion(descripcion);
                dto.setFecha(fecha.atStartOfDay());
                dto.setTipoMovimiento(clasificarMovimiento(descripcion));
                dto.setReferencia(canal);

                if (cargos.signum() > 0) {
                    dto.setTipo(TipoTransaccion.GASTO);
                    dto.setMonto(cargos);
                    dto.setCategoriaId(categoriaPara(descripcion, categoriasPorNombre));
                    totalCargos = totalCargos.add(cargos);
                    gastos++;
                } else if (abonos.signum() > 0) {
                    dto.setTipo(TipoTransaccion.INGRESO);
                    dto.setMonto(abonos);
                    totalAbonos = totalAbonos.add(abonos);
                    ingresos++;
                } else {
                    continue; // fila sin monto
                }

                transaccionService.create(dto);
                importadas++;
            }
        } catch (IOException e) {
            throw new BadRequestException("No se pudo leer el archivo de cartola: " + e.getMessage());
        } catch (RuntimeException e) {
            throw new BadRequestException("El archivo no tiene un formato de cartola valido: " + e.getMessage());
        }

        if (importadas == 0) {
            throw new BadRequestException("No se encontraron movimientos en la cartola.");
        }

        String mensaje = String.format("Se importaron %d movimientos (%d ingresos, %d gastos).",
                importadas, ingresos, gastos);
        return new ImportacionCartolaDTO(importadas, ingresos, gastos, totalAbonos, totalCargos, mensaje);
    }

    private Map<String, Long> cargarCategorias() {
        Map<String, Long> mapa = new HashMap<>();
        for (Categoria c : categoriaRepository.findAll()) {
            mapa.put(c.getNombre(), c.getId());
        }
        return mapa;
    }

    /** Ubica la fila del encabezado de movimientos y el indice de cada columna. */
    private Encabezado localizarEncabezado(Sheet hoja, DataFormatter formateador) {
        for (Row fila : hoja) {
            Encabezado enc = new Encabezado();
            for (Cell celda : fila) {
                String valor = formateador.formatCellValue(celda).trim().toLowerCase();
                int idx = celda.getColumnIndex();
                if (valor.equals("fecha")) enc.colFecha = idx;
                else if (valor.startsWith("descrip")) enc.colDesc = idx;
                else if (valor.startsWith("canal")) enc.colCanal = idx;
                else if (valor.startsWith("cargos")) enc.colCargos = idx;
                else if (valor.startsWith("abonos")) enc.colAbonos = idx;
            }
            if (enc.colFecha >= 0 && enc.colDesc >= 0 && enc.colCargos >= 0 && enc.colAbonos >= 0) {
                enc.fila = fila.getRowNum();
                return enc;
            }
        }
        throw new BadRequestException("No se encontro el encabezado de movimientos (Fecha / Descripcion / Cargos / Abonos).");
    }

    private LocalDate parsearFecha(String texto) {
        if (texto == null || texto.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(texto.trim(), FORMATO_FECHA);
        } catch (Exception e) {
            return null;
        }
    }

    private String leerTexto(Row fila, int columna, DataFormatter formateador) {
        if (columna < 0) {
            return null;
        }
        Cell celda = fila.getCell(columna);
        if (celda == null) {
            return null;
        }
        String valor = formateador.formatCellValue(celda).trim();
        return valor.isEmpty() ? null : valor;
    }

    private BigDecimal leerMonto(Row fila, int columna) {
        if (columna < 0) {
            return BigDecimal.ZERO;
        }
        Cell celda = fila.getCell(columna);
        if (celda == null) {
            return BigDecimal.ZERO;
        }
        try {
            if (celda.getCellType() == org.apache.poi.ss.usermodel.CellType.NUMERIC) {
                return BigDecimal.valueOf(celda.getNumericCellValue()).setScale(0, java.math.RoundingMode.HALF_UP);
            }
            String txt = celda.getStringCellValue().replaceAll("[^0-9]", "");
            return txt.isEmpty() ? BigDecimal.ZERO : new BigDecimal(txt);
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }

    private TipoMovimiento clasificarMovimiento(String descripcion) {
        String d = descripcion == null ? "" : descripcion.toLowerCase();
        if (d.startsWith("traspaso")) return TipoMovimiento.TRANSFERENCIA;
        if (d.startsWith("devolucion") || d.startsWith("deposito")) return TipoMovimiento.DEPOSITO;
        return TipoMovimiento.PAGO;
    }

    /**
     * Clasificacion heuristica del gasto en una categoria del catalogo 50/30/20,
     * segun palabras clave presentes en la descripcion del movimiento.
     */
    private Long categoriaPara(String descripcion, Map<String, Long> categorias) {
        String d = descripcion == null ? "" : descripcion.toLowerCase();
        String nombre;

        if (contiene(d, "traspaso a")) {
            nombre = "Ahorro";
        } else if (contiene(d, "whoosh", "uber", "cabify", "metro", "copec", "shell", "bencina", "transporte")) {
            nombre = "Transporte";
        } else if (contiene(d, "tottus", "jumbo", "lider", "unimarc", "santa isabel", "acuenta", "supermercado")) {
            nombre = "Supermercado";
        } else if (contiene(d, "munic", "enel", "aguas", "vtr", "entel", "movistar", "claro", "gtd", "luz", "agua", "gas")) {
            nombre = "Servicios";
        } else if (contiene(d, "farmacia", "salcobrand", "cruz verde", "ahumada", "clinica", "hospital")) {
            nombre = "Salud";
        } else if (contiene(d, "pizza", "domino", "burger", "mcdonald", "kentucky", "kfc", "juan maestro",
                "starbucks", "cafe", "coffe", "delicia", "expresso", "principe de gales", "sumup", "catita")) {
            nombre = "Restaurantes";
        } else if (contiene(d, "spotify", "netflix", "eneba", "steam", "e-commerce", "disney", "hbo")) {
            nombre = "Entretenimiento";
        } else {
            nombre = "Otros";
        }

        Long id = categorias.get(nombre);
        return id != null ? id : categorias.get("Otros");
    }

    private boolean contiene(String texto, String... claves) {
        for (String clave : claves) {
            if (texto.contains(clave)) {
                return true;
            }
        }
        return false;
    }

    /** Posicion del encabezado y de sus columnas dentro de la hoja. */
    private static class Encabezado {
        int fila = -1;
        int colFecha = -1;
        int colDesc = -1;
        int colCanal = -1;
        int colCargos = -1;
        int colAbonos = -1;
    }
}

#!/usr/bin/env python3
"""
Lector de respaldo de cartolas bancarias (Banco de Chile) para la demo.

Reproduce, de forma independiente al backend Java, el procesamiento de una
cartola .xls/.xlsx: detecta el encabezado de movimientos, clasifica cada gasto
segun la regla 50/30/20 y muestra los totales. Sirve como plan B si durante la
demo no se pudiera levantar el stack completo (Spring Boot + React).

Uso:
    python leer_cartola.py [ruta_cartola.xls]

Si no se indica ruta, usa "cartola.xls" en el directorio actual.
"""
import sys
from pathlib import Path

import xlrd

# Mismas reglas de clasificacion que CartolaServiceImpl (backend Java).
# El primer grupo cuyo keyword aparezca en la descripcion define la categoria.
REGLAS = [
    ("Ahorro", "AHORRO", ["traspaso a"]),
    ("Transporte", "NECESIDAD", ["whoosh", "uber", "cabify", "metro", "copec", "shell", "bencina", "transporte"]),
    ("Supermercado", "NECESIDAD", ["tottus", "jumbo", "lider", "unimarc", "santa isabel", "acuenta", "supermercado"]),
    ("Servicios", "NECESIDAD", ["munic", "enel", "aguas", "vtr", "entel", "movistar", "claro", "gtd", "luz", "agua", "gas"]),
    ("Salud", "NECESIDAD", ["farmacia", "salcobrand", "cruz verde", "ahumada", "clinica", "hospital"]),
    ("Restaurantes", "DESEO", ["pizza", "domino", "burger", "mcdonald", "kentucky", "kfc", "juan maestro",
                                 "starbucks", "cafe", "coffe", "delicia", "expresso", "principe de gales", "sumup", "catita"]),
    ("Entretenimiento", "DESEO", ["spotify", "netflix", "eneba", "steam", "e-commerce", "disney", "hbo"]),
]


def clasificar(descripcion):
    d = (descripcion or "").lower()
    for nombre, tipo, claves in REGLAS:
        if any(clave in d for clave in claves):
            return nombre, tipo
    return "Otros", "DESEO"  # fallback


def ubicar_encabezado(hoja):
    """Devuelve (fila, {col_fecha, col_desc, col_cargos, col_abonos})."""
    for r in range(hoja.nrows):
        cols = {}
        for c in range(hoja.ncols):
            valor = str(hoja.cell_value(r, c)).strip().lower()
            if valor == "fecha":
                cols["fecha"] = c
            elif valor.startswith("descrip"):
                cols["desc"] = c
            elif valor.startswith("cargos"):
                cols["cargos"] = c
            elif valor.startswith("abonos"):
                cols["abonos"] = c
        if {"fecha", "desc", "cargos", "abonos"} <= cols.keys():
            return r, cols
    raise ValueError("No se encontro el encabezado de movimientos (Fecha / Descripcion / Cargos / Abonos).")


def monto(hoja, fila, col):
    valor = hoja.cell_value(fila, col)
    if isinstance(valor, (int, float)):
        return int(round(valor))
    return 0


def main():
    ruta = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("cartola.xls")
    if not ruta.exists():
        sys.exit(f"No existe el archivo: {ruta}")

    libro = xlrd.open_workbook(str(ruta))
    hoja = libro.sheet_by_index(0)
    fila_enc, cols = ubicar_encabezado(hoja)

    movimientos = 0
    ingresos = 0
    total_abonos = 0
    total_cargos = 0
    gasto_por_tipo = {"NECESIDAD": 0, "DESEO": 0, "AHORRO": 0}

    print(f"\nCartola: {ruta.name}")
    print("=" * 78)
    print(f"{'Fecha':<12} {'Descripcion':<38} {'Categoria':<14} {'Monto':>10}")
    print("-" * 78)

    for r in range(fila_enc + 1, hoja.nrows):
        fecha = str(hoja.cell_value(r, cols["fecha"])).strip()
        if not fecha or "/" not in fecha:
            continue
        cargos = monto(hoja, r, cols["cargos"])
        abonos = monto(hoja, r, cols["abonos"])
        desc = str(hoja.cell_value(r, cols["desc"])).strip()

        if cargos > 0:
            nombre, tipo = clasificar(desc)
            gasto_por_tipo[tipo] += cargos
            total_cargos += cargos
            etiqueta = f"-{cargos:,}"
        elif abonos > 0:
            nombre = "Ingreso"
            total_abonos += abonos
            ingresos += 1
            etiqueta = f"+{abonos:,}"
        else:
            continue

        movimientos += 1
        print(f"{fecha:<12} {desc[:37]:<38} {nombre:<14} {etiqueta:>10}")

    gastos = movimientos - ingresos
    print("-" * 78)
    print(f"Movimientos: {movimientos}  |  Ingresos: {ingresos}  |  Gastos: {gastos}")
    print(f"Total abonos (ingresos): ${total_abonos:,}")
    print(f"Total cargos (gastos):   ${total_cargos:,}")
    print(f"Saldo del periodo:       ${total_abonos - total_cargos:,}")

    print("\nRegla 50/30/20 (base = total de ingresos)")
    print("-" * 78)
    presup = {
        "NECESIDAD": round(total_abonos * 0.50),
        "DESEO": round(total_abonos * 0.30),
    }
    presup["AHORRO"] = total_abonos - presup["NECESIDAD"] - presup["DESEO"]
    porcentajes = {"NECESIDAD": 50, "DESEO": 30, "AHORRO": 20}
    for tipo in ("NECESIDAD", "DESEO", "AHORRO"):
        gastado = gasto_por_tipo[tipo]
        disponible = presup[tipo] - gastado
        estado = "EXCEDIDO" if disponible < 0 else "en rango"
        print(f"{tipo:<10} {porcentajes[tipo]:>2}%  presupuestado ${presup[tipo]:>9,}  "
              f"gastado ${gastado:>9,}  ->  {estado} (${disponible:,})")
    print("=" * 78)


if __name__ == "__main__":
    main()
